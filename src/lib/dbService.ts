import { 
  db, 
  auth,
  COLLECTIONS, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  createSecondaryAuthUser
} from './firebase';
import { handleFirestoreError, OperationType } from './firebaseErrorHandler';
import { INITIAL_WORKS, INITIAL_REVIEWS, INITIAL_SETTINGS, INITIAL_PRODUCTS_FOR_SALE } from '../data/initialData';
import { 
  BookingRecord, 
  BookingTrackingRecord,
  CustomerReview, 
  RepairWork, 
  BookingStatus, 
  Customer, 
  RepairJob, 
  AppSystemSettings, 
  BackupData,
  AdminUser,
  ApplianceForSale,
  AuditLog,
  AdminRole
} from '../types';
import { 
  BookingSchema, 
  BookingTrackingSchema,
  CustomerSchema, 
  RepairJobSchema, 
  ReviewSchema, 
  WorkSchema, 
  BackupSchema,
  SettingsSchema,
  AdminUserSchema,
  ForSaleItemSchema,
  AuditLogSchema
} from './schemas';
import { validateEgyptianPhone } from './validation';
import { isMasterAdminEmail, MASTER_ADMIN_EMAIL } from '../config';
import type { User } from 'firebase/auth';

// Storage keys for offline resilience
const STORAGE_KEYS = {
  BOOKINGS: 'alshamel_cache_bookings_v2',
  BOOKING_TRACKING: 'alshamel_cache_tracking_v2',
  WORKS: 'alshamel_cache_works_v2',
  FOR_SALE: 'alshamel_cache_for_sale_v2',
  REVIEWS: 'alshamel_cache_reviews_v2',
  CUSTOMERS: 'alshamel_cache_customers_v2',
  REPAIRS: 'alshamel_cache_repairs_v2',
  SETTINGS: 'alshamel_cache_settings_v2',
  AUDIT_LOGS: 'alshamel_cache_audit_logs_v2'
};

// Default System Settings
export const DEFAULT_SETTINGS: AppSystemSettings = INITIAL_SETTINGS;

// Helper: Run promise with a timeout fallback
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 3500, fallbackValue: T): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => {
      resolve(fallbackValue);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch {
    clearTimeout(timeoutHandle!);
    return fallbackValue;
  }
}

// Local Storage helpers
function getLocalCache<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalCache<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

// Generate Standardized Collision-Resistant Unique Booking Code, e.g. BK-2026-739412
export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const timeEntropy = Date.now().toString().slice(-3);
  const randEntropy = Math.floor(100 + Math.random() * 900);
  return `BK-${year}-${timeEntropy}${randEntropy}`;
}

// Generate Standardized Collision-Resistant Unique Repair Job Code, e.g. JOB-2026-739412
export function generateRepairJobId(): string {
  const year = new Date().getFullYear();
  const timeEntropy = Date.now().toString().slice(-3);
  const randEntropy = Math.floor(100 + Math.random() * 900);
  return `JOB-${year}-${timeEntropy}${randEntropy}`;
}

// Helper to determine tracking progress stage (1 to 4)
function calculateStageFromStatus(status: BookingStatus): number {
  switch (status) {
    case 'NEW':
      return 1; // تم استلام الطلب
    case 'CONTACTED':
    case 'SCHEDULED':
      return 2; // تم التواصل وتحديد الموعد
    case 'ASSIGNED':
    case 'IN_PROGRESS':
    case 'WAITING_FOR_PART':
      return 3; // الفحص والإصلاح الهندسي
    case 'COMPLETED':
      return 4; // اكتمال الإصلاح وتفعيل الضمان
    case 'CANCELLED':
      return 1;
    default:
      return 1;
  }
}

// -------------------------------------------------------------
// AUDIT LOG MANAGEMENT (ADMIN ONLY, APPEND-ONLY)
// -------------------------------------------------------------
export async function recordAuditLog(
  action: AuditLog['action'],
  targetCollection: string,
  targetId: string,
  details: string,
  oldValue?: any,
  newValue?: any
): Promise<void> {
  const user = auth.currentUser;
  const logId = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const logEntry: AuditLog = {
    id: logId,
    action,
    performedBy: {
      uid: user?.uid || 'system',
      email: user?.email || 'authenticated-admin',
      role: 'ADMIN'
    },
    targetId,
    targetCollection,
    details,
    timestamp: now,
    oldValue: oldValue ? JSON.parse(JSON.stringify(oldValue)) : undefined,
    newValue: newValue ? JSON.parse(JSON.stringify(newValue)) : undefined
  };

  try {
    AuditLogSchema.parse(logEntry);

    // Save locally
    const localLogs = getLocalCache<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    setLocalCache(STORAGE_KEYS.AUDIT_LOGS, [logEntry, ...localLogs.slice(0, 99)]);

    // Persist to Firestore if user is authenticated
    if (user) {
      await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, logId), logEntry);
    }
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
}

export async function fetchAllAuditLogs(): Promise<AuditLog[]> {
  const localLogs = getLocalCache<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);

  try {
    const q = query(collection(db, COLLECTIONS.AUDIT_LOGS), orderBy('timestamp', 'desc'));
    const snap = await withTimeout(
      getDocs(q).then(s => s.docs.map(d => d.data() as AuditLog)),
      3500,
      null
    );

    if (snap && snap.length > 0) {
      setLocalCache(STORAGE_KEYS.AUDIT_LOGS, snap);
      return snap;
    }
  } catch (error) {
    console.warn('Audit logs fetch fallback to local:', error);
  }

  return localLogs;
}

// -------------------------------------------------------------
// ADMIN ROLE VERIFICATION & BOOTSTRAP
// -------------------------------------------------------------
export const MASTER_OWNER_EMAIL: string = MASTER_ADMIN_EMAIL;

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.email && isMasterAdminEmail(user.email)) return true;

  try {
    const snap = await getDoc(doc(db, COLLECTIONS.ADMINS, user.uid));
    if (!snap.exists() || !user.email) return false;
    const admin = snap.data() as AdminUser;
    const delegatedRoles: AdminRole[] = ['ADMIN', 'MANAGER', 'TECHNICIAN'];
    return delegatedRoles.includes(admin.role) &&
      admin.email.trim().toLowerCase() === user.email.trim().toLowerCase() &&
      !isMasterAdminEmail(admin.email);
  } catch {
    return false;
  }
}

export async function bootstrapMasterAdmin(user: User): Promise<void> {
  if (!user || !user.email) return;

  const adminData: AdminUser = {
    id: user.uid,
    email: user.email,
    role: 'SUPER_ADMIN',
    displayName: user.displayName || 'المدير العام (أشرف قطب)',
    createdAt: new Date().toISOString()
  };

  try {
    AdminUserSchema.parse(adminData);
    await setDoc(doc(db, COLLECTIONS.ADMINS, user.uid), adminData, { merge: true });
    await cleanupInvalidOwnerRecords();
  } catch (error) {
    console.warn('Could not bootstrap admin record in Firestore:', error);
  }
}

async function cleanupInvalidOwnerRecords(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.ADMINS));
    const invalidOwnerDocs = snap.docs.filter((d) => {
      const admin = d.data() as AdminUser;
      return admin.role === 'SUPER_ADMIN' && !isMasterAdminEmail(admin.email);
    });
    await Promise.all(invalidOwnerDocs.map(d => deleteDoc(d.ref)));
  } catch (error) {
    console.warn('Could not clean invalid owner records:', error);
  }
}

export async function fetchAllAdmins(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.ADMINS));
    return snap.docs.map(d => d.data() as AdminUser);
  } catch (error) {
    console.warn('Could not fetch admins from Firestore:', error);
    return [];
  }
}

export async function createAdminUser(data: {
  email: string;
  password: string;
  role: AdminRole;
  displayName?: string;
}): Promise<AdminUser> {
  const email = data.email.trim().toLowerCase();
  if (!email || isMasterAdminEmail(email)) {
    throw new Error('لا يمكن إضافة بريد المالك كمشرف إضافي.');
  }
  if (data.password.length < 6) {
    throw new Error('كلمة مرور المشرف يجب أن تكون 6 أحرف على الأقل.');
  }
  const authUser = await createSecondaryAuthUser(email, data.password);
  const newAdmin: AdminUser = {
    id: authUser.uid,
    email,
    role: data.role === 'SUPER_ADMIN' ? 'ADMIN' : data.role,
    displayName: data.displayName?.trim() || '',
    createdAt: new Date().toISOString()
  };
  AdminUserSchema.parse(newAdmin);
  await setDoc(doc(db, COLLECTIONS.ADMINS, newAdmin.id), newAdmin);
  await recordAuditLog('ADMIN_CREATED', 'admins', newAdmin.id, `تم إنشاء حساب مشرف: ${newAdmin.email}`);
  return newAdmin;
}

export async function deleteAdminUser(adminId: string): Promise<void> {
  if (adminId === auth.currentUser?.uid) {
    throw new Error('لا يمكن حذف صلاحية المالك الرئيسي.');
  }
  try {
    await deleteDoc(doc(db, COLLECTIONS.ADMINS, adminId));
    await recordAuditLog(
      'ADMIN_DELETED', 
      'admins', 
      adminId, 
      `تم إيقاف صلاحيات المشرف: ${adminId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${adminId}`);
  }
}

// -------------------------------------------------------------
// SEED INITIAL DATA IF DATABASE IS EMPTY
// -------------------------------------------------------------
export async function seedInitialDataIfNeeded(): Promise<void> {
  try {
    const localWorks = getLocalCache<RepairWork[]>(STORAGE_KEYS.WORKS, []);
    if (localWorks.length === 0) {
      setLocalCache(STORAGE_KEYS.WORKS, INITIAL_WORKS);
    }
    const localForSale = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, []);
    if (localForSale.length === 0) {
      setLocalCache(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);
    }
    const localReviews = getLocalCache<CustomerReview[]>(STORAGE_KEYS.REVIEWS, []);
    if (localReviews.length === 0) {
      setLocalCache(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    }

    // Only attempt remote seeding if an authenticated user is present
    if (auth.currentUser) {
      await withTimeout((async () => {
        // Seed Works to Firestore
        const worksSnapshot = await getDocs(collection(db, COLLECTIONS.WORKS));
        if (worksSnapshot.empty) {
          for (const work of INITIAL_WORKS) {
            await setDoc(doc(db, COLLECTIONS.WORKS, work.id), {
              ...work,
              createdAt: new Date().toISOString()
            }).catch(() => {});
          }
        }

        // Seed For Sale Products to Firestore
        const forSaleSnapshot = await getDocs(collection(db, COLLECTIONS.FOR_SALE));
        if (forSaleSnapshot.empty) {
          for (const item of INITIAL_PRODUCTS_FOR_SALE) {
            await setDoc(doc(db, COLLECTIONS.FOR_SALE, item.id), item).catch(() => {});
          }
        }
      })(), 3500, null);
    }
  } catch {
    // Silently fall back to cached initial data
  }
}

// -------------------------------------------------------------
// BOOKING OPERATIONS & SECURE PRIVACY-FIRST TRACKING
// -------------------------------------------------------------
export async function createBooking(data: {
  fullName: string;
  phoneNumber: string;
  address: string;
  deviceType: string;
  brand?: string;
  issueDescription: string;
  preferredTime?: string;
  imageUrl?: string;
}): Promise<BookingRecord> {
  const bookingId = generateBookingId();
  const now = new Date().toISOString();
  const phoneValidation = validateEgyptianPhone(data.phoneNumber);
  const normalizedPhone = phoneValidation.isValid ? phoneValidation.normalized : data.phoneNumber.trim();
  const phoneLast4 = normalizedPhone.slice(-4);
  const customerFirstName = data.fullName.trim().split(' ')[0] || 'عميل';

  // 1. Full Private Booking Record (Admin Only Access)
  const newBooking: BookingRecord = {
    id: bookingId,
    fullName: data.fullName.trim(),
    phoneNumber: normalizedPhone,
    address: data.address.trim(),
    deviceType: data.deviceType.trim(),
    brand: data.brand?.trim() || '',
    issueDescription: data.issueDescription.trim(),
    preferredTime: data.preferredTime || 'صباحاً (9 ص - 2 ظ)',
    status: 'NEW',
    notes: '',
    technicianName: '',
    estimatedCost: 0,
    imageUrl: data.imageUrl || '',
    createdAt: now,
    updatedAt: now,
    syncState: 'PENDING_SYNC'
  };

  // 2. Safe Public Tracking Record (No PII, No Address, No Notes)
  const trackingRecord: BookingTrackingRecord = {
    id: bookingId,
    status: 'NEW',
    deviceType: data.deviceType.trim(),
    brand: data.brand?.trim() || '',
    preferredTime: data.preferredTime || 'صباحاً (9 ص - 2 ظ)',
    phoneLast4,
    customerFirstName,
    hasWarranty: false,
    stage: 1,
    createdAt: now,
    updatedAt: now
  };

  // Strict Validation with Zod
  BookingSchema.parse(newBooking);
  BookingTrackingSchema.parse(trackingRecord);

  // Save to local storage caches immediately
  const localBookings = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  setLocalCache(STORAGE_KEYS.BOOKINGS, [newBooking, ...localBookings]);

  const localTracking = getLocalCache<BookingTrackingRecord[]>(STORAGE_KEYS.BOOKING_TRACKING, []);
  setLocalCache(STORAGE_KEYS.BOOKING_TRACKING, [trackingRecord, ...localTracking]);

  // Persist to Firestore: both the private booking and the public tracking card
  try {
    await Promise.all([
      setDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId), newBooking),
      setDoc(doc(db, COLLECTIONS.BOOKING_TRACKING, bookingId), trackingRecord)
    ]);
    newBooking.syncState = 'SYNCED';

    // Update sync state in local cache
    const updatedCache = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
    setLocalCache(
      STORAGE_KEYS.BOOKINGS, 
      updatedCache.map(b => b.id === bookingId ? { ...b, syncState: 'SYNCED' } : b)
    );
  } catch (error) {
    console.warn('Booking stored locally, pending cloud sync:', error);
    newBooking.syncState = 'PENDING_SYNC';
  }

  return newBooking;
}

/**
 * Synchronize offline/pending bookings to Firestore
 */
export async function syncPendingBookings(): Promise<number> {
  const localBookings = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  const pending = localBookings.filter(b => b.syncState === 'PENDING_SYNC' || b.syncState === 'SYNC_FAILED');
  if (pending.length === 0) return 0;

  let synced = 0;
  for (const booking of pending) {
    try {
      const customerFirstName = booking.fullName.trim().split(' ')[0] || 'عميل';
      const trackingRecord: BookingTrackingRecord = {
        id: booking.id,
        status: booking.status,
        deviceType: booking.deviceType.trim(),
        brand: booking.brand?.trim() || '',
        preferredTime: booking.preferredTime || 'صباحاً (9 ص - 2 ظ)',
        phoneLast4: booking.phoneNumber.slice(-4),
        customerFirstName,
        hasWarranty: false,
        stage: calculateStageFromStatus(booking.status),
        createdAt: booking.createdAt,
        updatedAt: new Date().toISOString()
      };

      await Promise.all([
        setDoc(doc(db, COLLECTIONS.BOOKINGS, booking.id), { ...booking, syncState: 'SYNCED', updatedAt: new Date().toISOString() }),
        setDoc(doc(db, COLLECTIONS.BOOKING_TRACKING, booking.id), trackingRecord)
      ]);
      booking.syncState = 'SYNCED';
      synced++;
    } catch {
      booking.syncState = 'SYNC_FAILED';
    }
  }

  setLocalCache(STORAGE_KEYS.BOOKINGS, localBookings);
  return synced;
}

// Auto-sync listener when browser reconnects to internet
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncPendingBookings().catch(() => {});
  });
}

/**
 * Safe Public Booking Tracker:
 * Queries the public-safe booking_tracking collection.
 * Requires bookingId + optional phoneLast4 for secondary verification.
 */
export async function getBookingTracking(
  bookingId: string, 
  phoneLast4?: string
): Promise<{ success: boolean; data?: BookingTrackingRecord; error?: string }> {
  const cleanId = bookingId.trim().toUpperCase();

  // 1. Check local cache first
  const localList = getLocalCache<BookingTrackingRecord[]>(STORAGE_KEYS.BOOKING_TRACKING, []);
  let found = localList.find(t => t.id.toUpperCase() === cleanId);

  // 2. Query Firestore public booking_tracking document
  if (!found) {
    try {
      const snap = await withTimeout(
        getDoc(doc(db, COLLECTIONS.BOOKING_TRACKING, cleanId)),
        3000,
        null
      );
      if (snap && snap.exists()) {
        found = snap.data() as BookingTrackingRecord;
      }
    } catch (err) {
      console.warn('Booking tracking lookup error:', err);
    }
  }

  if (!found) {
    return {
      success: false,
      error: 'لم نتمكن من العثور على حجز بهذا الكود، يرجى التأكد من كتابة الكود بشكل صحيح (مثال: BK-2026-10294)'
    };
  }

  // Verification factor: check last 4 digits if provided
  if (phoneLast4 && phoneLast4.trim().length === 4) {
    if (found.phoneLast4 !== phoneLast4.trim()) {
      return {
        success: false,
        error: 'عفواً، آخر 4 أرقام من الهاتف غير مطابقة لكود هذا الحجز لضمان الخصوصية'
      };
    }
  }

  return {
    success: true,
    data: found
  };
}

export async function fetchAllBookings(): Promise<BookingRecord[]> {
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);

  try {
    const q = query(collection(db, COLLECTIONS.BOOKINGS), orderBy('createdAt', 'desc'));
    const remoteDocs = await withTimeout(
      getDocs(q).then(snap => snap.docs.map(d => d.data() as BookingRecord)),
      3500,
      null
    );

    if (remoteDocs && remoteDocs.length > 0) {
      setLocalCache(STORAGE_KEYS.BOOKINGS, remoteDocs);
      return remoteDocs;
    }
  } catch (error) {
    console.warn('Could not fetch remote bookings, returning local cache:', error);
  }

  return localList;
}

export async function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus, 
  notes?: string,
  technicianName?: string,
  estimatedCost?: number
): Promise<void> {
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  const now = new Date().toISOString();
  const stage = calculateStageFromStatus(status);

  let targetBooking: BookingRecord | null = null;
  const updated = localList.map(b => {
    if (b.id === bookingId) {
      targetBooking = {
        ...b,
        status,
        notes: notes !== undefined ? notes : b.notes,
        technicianName: technicianName !== undefined ? technicianName : b.technicianName,
        estimatedCost: estimatedCost !== undefined ? estimatedCost : b.estimatedCost,
        updatedAt: now
      };
      return targetBooking;
    }
    return b;
  });
  setLocalCache(STORAGE_KEYS.BOOKINGS, updated);

  try {
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const trackingRef = doc(db, COLLECTIONS.BOOKING_TRACKING, bookingId);

    const payload: Record<string, any> = {
      status,
      updatedAt: now
    };
    if (notes !== undefined) payload.notes = notes;
    if (technicianName !== undefined) payload.technicianName = technicianName;
    if (estimatedCost !== undefined) payload.estimatedCost = estimatedCost;

    // Update both booking and safe tracking card
    await Promise.all([
      updateDoc(bookingRef, payload),
      setDoc(trackingRef, {
        status,
        stage,
        hasWarranty: status === 'COMPLETED',
        updatedAt: now
      }, { merge: true })
    ]);

    // Record Audit Log
    await recordAuditLog(
      'BOOKING_STATUS_CHANGED',
      'bookings',
      bookingId,
      `تحديث حالة الحجز إلى: ${status} (المرحلة: ${stage})`
    );

    // If booking is updated by admin, sync customer CRM
    if (targetBooking) {
      syncCustomerFromBooking(targetBooking).catch(() => {});
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
  }
}

export async function softDeleteBooking(bookingId: string): Promise<void> {
  const user = auth.currentUser;
  const now = new Date().toISOString();
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);

  setLocalCache(
    STORAGE_KEYS.BOOKINGS, 
    localList.map(b => b.id === bookingId ? { ...b, isDeleted: true, deletedAt: now, deletedBy: user?.email || 'admin' } : b)
  );

  try {
    await updateDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId), {
      isDeleted: true,
      deletedAt: now,
      deletedBy: user?.email || 'admin'
    });

    await recordAuditLog(
      'BOOKING_DELETED',
      'bookings',
      bookingId,
      `أرشفة ونقل الحجز لسلة المحذوفات بواسطة: ${user?.email || 'admin'}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${bookingId}`);
  }
}

export async function deleteBooking(bookingId: string): Promise<void> {
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  setLocalCache(STORAGE_KEYS.BOOKINGS, localList.filter(b => b.id !== bookingId));

  try {
    await Promise.all([
      deleteDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId)),
      deleteDoc(doc(db, COLLECTIONS.BOOKING_TRACKING, bookingId)).catch(() => {})
    ]);

    await recordAuditLog(
      'BOOKING_DELETED',
      'bookings',
      bookingId,
      `حذف نهائي لسجل الحجز: ${bookingId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${bookingId}`);
  }
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  const localFound = localList.find(b => b.id.toLowerCase() === bookingId.trim().toLowerCase());
  if (localFound) return localFound;

  try {
    const snap = await withTimeout(
      getDoc(doc(db, COLLECTIONS.BOOKINGS, bookingId.trim())),
      3000,
      null
    );
    if (snap && snap.exists()) {
      return snap.data() as BookingRecord;
    }
  } catch (error) {
    console.warn('Failed to retrieve booking by ID:', error);
  }
  return null;
}

export async function getBookingsByPhone(phoneNumber: string): Promise<BookingRecord[]> {
  const cleanPhone = phoneNumber.trim();
  const localList = getLocalCache<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
  const localMatches = localList.filter(b => b.phoneNumber.includes(cleanPhone) || cleanPhone.includes(b.phoneNumber));

  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('phoneNumber', '==', cleanPhone)
    );
    const snap = await withTimeout(
      getDocs(q).then(s => s.docs.map(d => d.data() as BookingRecord)),
      3000,
      null
    );
    if (snap && snap.length > 0) {
      return snap;
    }
  } catch {
    // Handled
  }

  return localMatches;
}

// -------------------------------------------------------------
// CUSTOMER CRM MANAGEMENT (ADMIN ONLY)
// -------------------------------------------------------------
export async function syncCustomerFromBooking(booking: BookingRecord): Promise<Customer> {
  const customerId = `CUST-${booking.phoneNumber}`;
  const now = new Date().toISOString();
  const localCustomers = getLocalCache<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  const existingIndex = localCustomers.findIndex(c => c.phone === booking.phoneNumber);

  let customer: Customer;

  if (existingIndex >= 0) {
    customer = {
      ...localCustomers[existingIndex],
      name: booking.fullName || localCustomers[existingIndex].name,
      address: booking.address || localCustomers[existingIndex].address,
      totalBookings: (localCustomers[existingIndex].totalBookings || 1) + 1,
      lastBookingDate: now,
      updatedAt: now
    };
    localCustomers[existingIndex] = customer;
  } else {
    customer = {
      id: customerId,
      name: booking.fullName,
      phone: booking.phoneNumber,
      address: booking.address,
      area: 'مركز أبو المطامير',
      notes: '',
      totalBookings: 1,
      totalSpent: booking.estimatedCost || 0,
      lastBookingDate: now,
      createdAt: now,
      updatedAt: now
    };
    localCustomers.unshift(customer);
  }

  setLocalCache(STORAGE_KEYS.CUSTOMERS, localCustomers);

  try {
    CustomerSchema.parse(customer);
    await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId), customer, { merge: true });
  } catch (error) {
    console.warn('Customer CRM sync skipped in unauthenticated context:', error);
  }

  return customer;
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  const localList = getLocalCache<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);

  try {
    const q = query(collection(db, COLLECTIONS.CUSTOMERS), orderBy('updatedAt', 'desc'));
    const remoteDocs = await withTimeout(
      getDocs(q).then(snap => snap.docs.map(d => d.data() as Customer)),
      3000,
      null
    );

    if (remoteDocs && remoteDocs.length > 0) {
      setLocalCache(STORAGE_KEYS.CUSTOMERS, remoteDocs);
      return remoteDocs;
    }
  } catch (error) {
    console.warn('Customers fetch fallback to local:', error);
  }

  return localList;
}

export async function deleteCustomer(customerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId));
    const local = getLocalCache<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    setLocalCache(STORAGE_KEYS.CUSTOMERS, local.filter(customer => customer.id !== customerId));
    await recordAuditLog(
      'CUSTOMER_DELETED',
      'customers',
      customerId,
      `حذف سجل العميل: ${customerId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `customers/${customerId}`);
  }
}

export async function updateCustomerNotes(customerId: string, notes: string): Promise<void> {
  const local = getLocalCache<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  const now = new Date().toISOString();
  const updated = local.map(c => c.id === customerId ? { ...c, notes, updatedAt: now } : c);
  setLocalCache(STORAGE_KEYS.CUSTOMERS, updated);

  try {
    await updateDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId), { notes, updatedAt: now });
    await recordAuditLog(
      'CUSTOMER_UPDATED',
      'customers',
      customerId,
      'تحديث ملاحظات العميل'
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `customers/${customerId}`);
  }
}

// -------------------------------------------------------------
// REPAIR JOB OPERATIONS (ADMIN ONLY)
// -------------------------------------------------------------
export async function createRepairJob(jobData: Omit<RepairJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepairJob> {
  const jobId = generateRepairJobId();
  const now = new Date().toISOString();
  const newJob: RepairJob = {
    ...jobData,
    id: jobId,
    createdAt: now,
    updatedAt: now
  };

  RepairJobSchema.parse(newJob);

  const local = getLocalCache<RepairJob[]>(STORAGE_KEYS.REPAIRS, []);
  setLocalCache(STORAGE_KEYS.REPAIRS, [newJob, ...local]);

  try {
    await setDoc(doc(db, COLLECTIONS.REPAIRS, jobId), newJob);
    await recordAuditLog(
      'REPAIR_CREATED',
      'repairs',
      jobId,
      `إنشاء أمر صيانة فني للجهاز: ${newJob.applianceType} (${newJob.brand}) للعميل: ${newJob.customerName}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `repairs/${jobId}`);
  }

  return newJob;
}

export async function fetchAllRepairJobs(): Promise<RepairJob[]> {
  const local = getLocalCache<RepairJob[]>(STORAGE_KEYS.REPAIRS, []);

  try {
    const q = query(collection(db, COLLECTIONS.REPAIRS), orderBy('createdAt', 'desc'));
    const remote = await withTimeout(
      getDocs(q).then(snap => snap.docs.map(d => d.data() as RepairJob)),
      3000,
      null
    );
    if (remote && remote.length > 0) {
      setLocalCache(STORAGE_KEYS.REPAIRS, remote);
      return remote;
    }
  } catch (error) {
    console.warn('Repairs fetch fallback to local:', error);
  }

  return local;
}

export async function updateRepairJob(jobId: string, updates: Partial<RepairJob>): Promise<void> {
  const local = getLocalCache<RepairJob[]>(STORAGE_KEYS.REPAIRS, []);
  const now = new Date().toISOString();

  const updated = local.map(j => j.id === jobId ? { ...j, ...updates, updatedAt: now } : j);
  setLocalCache(STORAGE_KEYS.REPAIRS, updated);

  try {
    await updateDoc(doc(db, COLLECTIONS.REPAIRS, jobId), { ...updates, updatedAt: now });
    await recordAuditLog(
      'REPAIR_UPDATED',
      'repairs',
      jobId,
      `تحديث بيانات أمر الصيانة: ${jobId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `repairs/${jobId}`);
  }
}

export async function deleteRepairJob(jobId: string): Promise<void> {
  const local = getLocalCache<RepairJob[]>(STORAGE_KEYS.REPAIRS, []);
  setLocalCache(STORAGE_KEYS.REPAIRS, local.filter(j => j.id !== jobId));

  try {
    await deleteDoc(doc(db, COLLECTIONS.REPAIRS, jobId));
    await recordAuditLog(
      'REPAIR_DELETED',
      'repairs',
      jobId,
      `حذف أمر الصيانة: ${jobId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `repairs/${jobId}`);
  }
}

// -------------------------------------------------------------
// REPAIR WORKS SHOWCASE OPERATIONS (PUBLIC READ, ADMIN WRITE)
// -------------------------------------------------------------
export async function fetchAllWorks(): Promise<RepairWork[]> {
  const local = getLocalCache<RepairWork[]>(STORAGE_KEYS.WORKS, INITIAL_WORKS);

  return withTimeout(
    (async () => {
      try {
        const q = query(collection(db, COLLECTIONS.WORKS), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const works = querySnapshot.docs.map(doc => doc.data() as RepairWork);
          setLocalCache(STORAGE_KEYS.WORKS, works);
          return works;
        }
        return local;
      } catch {
        return local;
      }
    })(),
    3500,
    local
  );
}

export async function createRepairWork(workData: Omit<RepairWork, 'id' | 'createdAt'>): Promise<RepairWork> {
  const id = `work-${Date.now()}`;
  const now = new Date().toISOString();
  const newWork: RepairWork = {
    ...workData,
    id,
    createdAt: now
  };

  WorkSchema.parse(newWork);

  const local = getLocalCache<RepairWork[]>(STORAGE_KEYS.WORKS, INITIAL_WORKS);
  setLocalCache(STORAGE_KEYS.WORKS, [newWork, ...local]);

  try {
    await setDoc(doc(db, COLLECTIONS.WORKS, id), newWork);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `works/${id}`);
  }

  return newWork;
}

export async function updateRepairWork(workId: string, updates: Partial<RepairWork>): Promise<void> {
  const local = getLocalCache<RepairWork[]>(STORAGE_KEYS.WORKS, INITIAL_WORKS);
  const updated = local.map(w => w.id === workId ? { ...w, ...updates } : w);
  setLocalCache(STORAGE_KEYS.WORKS, updated);

  try {
    await updateDoc(doc(db, COLLECTIONS.WORKS, workId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `works/${workId}`);
  }
}

export async function deleteRepairWork(workId: string): Promise<void> {
  const local = getLocalCache<RepairWork[]>(STORAGE_KEYS.WORKS, INITIAL_WORKS);
  setLocalCache(STORAGE_KEYS.WORKS, local.filter(w => w.id !== workId));

  try {
    await deleteDoc(doc(db, COLLECTIONS.WORKS, workId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `works/${workId}`);
  }
}

// -------------------------------------------------------------
// FOR SALE MARKETPLACE OPERATIONS (PUBLIC READ, ADMIN WRITE)
// -------------------------------------------------------------
export async function fetchAllForSaleItems(): Promise<ApplianceForSale[]> {
  const local = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);

  return withTimeout(
    (async () => {
      try {
        const q = query(collection(db, COLLECTIONS.FOR_SALE), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map(doc => doc.data() as ApplianceForSale);
          setLocalCache(STORAGE_KEYS.FOR_SALE, items);
          return items;
        }
        return local;
      } catch {
        return local;
      }
    })(),
    3500,
    local
  );
}

export async function createForSaleItem(itemData: Omit<ApplianceForSale, 'id' | 'createdAt'>): Promise<ApplianceForSale> {
  const id = `sale-${Date.now()}`;
  const now = new Date().toISOString();
  const newItem: ApplianceForSale = {
    ...itemData,
    id,
    createdAt: now,
    updatedAt: now
  };

  ForSaleItemSchema.parse(newItem);

  const local = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);
  setLocalCache(STORAGE_KEYS.FOR_SALE, [newItem, ...local]);

  try {
    await setDoc(doc(db, COLLECTIONS.FOR_SALE, id), newItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `for_sale/${id}`);
  }

  return newItem;
}

export async function updateForSaleItem(itemId: string, updates: Partial<ApplianceForSale>): Promise<void> {
  const local = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);
  const now = new Date().toISOString();
  const updated = local.map(item => item.id === itemId ? { ...item, ...updates, updatedAt: now } : item);
  setLocalCache(STORAGE_KEYS.FOR_SALE, updated);

  try {
    await updateDoc(doc(db, COLLECTIONS.FOR_SALE, itemId), { ...updates, updatedAt: now });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `for_sale/${itemId}`);
  }
}

export async function deleteForSaleItem(itemId: string): Promise<void> {
  const local = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);
  setLocalCache(STORAGE_KEYS.FOR_SALE, local.filter(item => item.id !== itemId));

  try {
    await deleteDoc(doc(db, COLLECTIONS.FOR_SALE, itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `for_sale/${itemId}`);
  }
}

export async function getForSaleItemById(itemId: string): Promise<ApplianceForSale | null> {
  const local = getLocalCache<ApplianceForSale[]>(STORAGE_KEYS.FOR_SALE, INITIAL_PRODUCTS_FOR_SALE);
  const localFound = local.find(item => item.id === itemId);
  if (localFound) return localFound;

  try {
    const docSnap = await getDoc(doc(db, COLLECTIONS.FOR_SALE, itemId));
    if (docSnap.exists()) {
      return docSnap.data() as ApplianceForSale;
    }
  } catch (error) {
    console.warn('Failed to retrieve for_sale item by id:', error);
  }
  return null;
}

// -------------------------------------------------------------
// REVIEWS & TESTIMONIALS (MODERATED)
// -------------------------------------------------------------
export async function fetchAllReviews(includePending = false): Promise<CustomerReview[]> {
  const local = getLocalCache<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);

  return withTimeout(
    (async () => {
      try {
        // Public visitors may only query approved reviews. Request that subset
        // from Firestore instead of fetching pending/rejected records and
        // filtering them in the browser (which is rejected by security rules).
        const q = includePending
          ? query(collection(db, COLLECTIONS.REVIEWS), orderBy('createdAt', 'desc'))
          : query(collection(db, COLLECTIONS.REVIEWS), where('status', '==', 'APPROVED'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const reviews = querySnapshot.docs
            .map(doc => doc.data() as CustomerReview)
            .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
          setLocalCache(STORAGE_KEYS.REVIEWS, reviews);
          if (includePending) {
            return reviews;
          }
          return reviews;
        }
        return includePending ? local : local.filter(r => r.status === 'APPROVED');
      } catch {
        return includePending ? local : local.filter(r => r.status === 'APPROVED');
      }
    })(),
    3500,
    includePending ? local : local.filter(r => r.status === 'APPROVED')
  );
}

export async function submitCustomerReview(data: {
  name: string;
  deviceType: string;
  rating: number;
  comment: string;
  image?: string;
  bookingId?: string;
}): Promise<CustomerReview> {
  const reviewId = `rev-${Date.now()}`;
  const now = new Date().toISOString();
  const avatarLetter = data.name.trim().charAt(0) || 'ع';

  const newReview: CustomerReview = {
    id: reviewId,
    name: data.name.trim(),
    deviceType: data.deviceType.trim(),
    rating: Number(data.rating),
    comment: data.comment.trim(),
    date: 'الآن',
    image: data.image || '',
    avatarLetter,
    verified: false,
    bookingId: data.bookingId?.trim() || undefined,
    status: 'PENDING',
    createdAt: now
  };

  ReviewSchema.parse(newReview);

  const local = getLocalCache<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalCache(STORAGE_KEYS.REVIEWS, [newReview, ...local]);

  try {
    await setDoc(doc(db, COLLECTIONS.REVIEWS, reviewId), newReview);
  } catch (error) {
    console.error('Firestore review submission error:', error);
  }

  return newReview;
}

export async function updateCustomerReviewStatus(reviewId: string, status: 'APPROVED' | 'REJECTED', verified?: boolean): Promise<void> {
  const local = getLocalCache<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const updated = local.map(r => {
    if (r.id === reviewId) {
      return {
        ...r,
        status,
        verified: verified !== undefined ? verified : r.verified
      };
    }
    return r;
  });
  setLocalCache(STORAGE_KEYS.REVIEWS, updated);

  try {
    const payload: Record<string, any> = { status };
    if (verified !== undefined) payload.verified = verified;
    await updateDoc(doc(db, COLLECTIONS.REVIEWS, reviewId), payload);

    await recordAuditLog(
      status === 'APPROVED' ? 'REVIEW_APPROVED' : 'REVIEW_REJECTED',
      'reviews',
      reviewId,
      `تحديث حالة التقييم إلى: ${status} (توثيق: ${verified ? 'نعم' : 'لا'})`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `reviews/${reviewId}`);
  }
}

export async function deleteCustomerReview(reviewId: string): Promise<void> {
  const local = getLocalCache<CustomerReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalCache(STORAGE_KEYS.REVIEWS, local.filter(r => r.id !== reviewId));

  try {
    await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId));
    await recordAuditLog(
      'REVIEW_DELETED',
      'reviews',
      reviewId,
      `حذف التقييم: ${reviewId}`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
  }
}

// -------------------------------------------------------------
// SYSTEM SETTINGS (PUBLIC READ, ADMIN WRITE)
// -------------------------------------------------------------
export async function fetchSystemSettings(): Promise<AppSystemSettings> {
  const local = getLocalCache<AppSystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

  return withTimeout(
    (async () => {
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'general'));
        if (docSnap.exists()) {
          const data = docSnap.data() as AppSystemSettings;
          setLocalCache(STORAGE_KEYS.SETTINGS, { ...INITIAL_SETTINGS, ...data });
          return { ...INITIAL_SETTINGS, ...data };
        } else {
          return local;
        }
      } catch (err) {
        console.warn('Using cached system settings:', err);
        return local;
      }
    })(),
    3500,
    local
  );
}

export async function updateSystemSettings(newSettings: Partial<AppSystemSettings>): Promise<AppSystemSettings> {
  const current = getLocalCache<AppSystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  const updated: AppSystemSettings = {
    ...current,
    ...newSettings
  };

  SettingsSchema.parse(updated);
  setLocalCache(STORAGE_KEYS.SETTINGS, updated);

  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), updated, { merge: true });
    await recordAuditLog(
      'SETTINGS_UPDATED',
      'settings',
      'general',
      'تحديث إعدادات النظام وتخصيص الموقع'
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/general');
  }

  return updated;
}

// -------------------------------------------------------------
// BACKUP EXPORT & VALIDATED IMPORT (ADMIN ONLY)
// -------------------------------------------------------------
export async function exportAllDatabaseData(): Promise<BackupData> {
  const [bookings, customers, repairs, works, forSale, reviews, settings, auditLogs] = await Promise.all([
    fetchAllBookings(),
    fetchAllCustomers(),
    fetchAllRepairJobs(),
    fetchAllWorks(),
    fetchAllForSaleItems(),
    fetchAllReviews(true),
    fetchSystemSettings(),
    fetchAllAuditLogs()
  ]);

  await recordAuditLog(
    'BACKUP_EXPORTED',
    'backups',
    'all',
    `تصدير نسخة احتياطية كاملة (${bookings.length} طلب، ${customers.length} عميل)`
  );

  return {
    version: '3.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      bookings,
      customers,
      repairs,
      works,
      forSale,
      reviews,
      settings,
      auditLogs
    }
  };
}

export async function importDatabaseData(rawJson: string): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const parsed = JSON.parse(rawJson);
    const validated = BackupSchema.parse(parsed);

    // Save bookings
    if (validated.data.bookings && validated.data.bookings.length > 0) {
      setLocalCache(STORAGE_KEYS.BOOKINGS, validated.data.bookings);
      for (const b of validated.data.bookings) {
        await setDoc(doc(db, COLLECTIONS.BOOKINGS, b.id), b).catch(() => {});
      }
    }

    // Save works
    if (validated.data.works && validated.data.works.length > 0) {
      setLocalCache(STORAGE_KEYS.WORKS, validated.data.works);
      for (const w of validated.data.works) {
        await setDoc(doc(db, COLLECTIONS.WORKS, w.id), w).catch(() => {});
      }
    }

    // Save for sale items
    if (validated.data.forSale && validated.data.forSale.length > 0) {
      setLocalCache(STORAGE_KEYS.FOR_SALE, validated.data.forSale);
      for (const item of validated.data.forSale) {
        await setDoc(doc(db, COLLECTIONS.FOR_SALE, item.id), item).catch(() => {});
      }
    }

    // Save reviews
    if (validated.data.reviews && validated.data.reviews.length > 0) {
      setLocalCache(STORAGE_KEYS.REVIEWS, validated.data.reviews);
      for (const r of validated.data.reviews) {
        await setDoc(doc(db, COLLECTIONS.REVIEWS, r.id), r).catch(() => {});
      }
    }

    // Save repairs
    if (validated.data.repairs && validated.data.repairs.length > 0) {
      setLocalCache(STORAGE_KEYS.REPAIRS, validated.data.repairs);
      for (const rep of validated.data.repairs) {
        await setDoc(doc(db, COLLECTIONS.REPAIRS, rep.id), rep).catch(() => {});
      }
    }

    // Save customers
    if (validated.data.customers && validated.data.customers.length > 0) {
      setLocalCache(STORAGE_KEYS.CUSTOMERS, validated.data.customers);
      for (const c of validated.data.customers) {
        await setDoc(doc(db, COLLECTIONS.CUSTOMERS, c.id), c).catch(() => {});
      }
    }

    // Save settings if present
    if (validated.data.settings) {
      setLocalCache(STORAGE_KEYS.SETTINGS, validated.data.settings);
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), validated.data.settings).catch(() => {});
    }

    await recordAuditLog(
      'BACKUP_IMPORTED',
      'backups',
      'all',
      `استيراد نسخة احتياطية (${validated.data.bookings?.length || 0} طلب)`
    );

    return {
      success: true,
      message: `تم استعادة النسخة الاحتياطية بنجاح (${validated.data.bookings?.length || 0} طلب، ${validated.data.works?.length || 0} عمل، ${validated.data.forSale?.length || 0} معروض، ${validated.data.reviews?.length || 0} تقييم)`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل استيراد النسخة الاحتياطية: ${err?.message || 'تنسيق الملف غير صالح'}`
    };
  }
}

// Aliases for backwards compatibility
export const addWorkItem = createRepairWork;
export const deleteWorkItem = deleteRepairWork;
export const addCustomerReview = submitCustomerReview;
export const updateReviewStatus = updateCustomerReviewStatus;
