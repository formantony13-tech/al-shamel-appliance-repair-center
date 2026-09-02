export type ApplianceCategory = 'الكل' | 'ثلاجات' | 'غسالات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات';

export type BookingStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'SCHEDULED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_PART' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type SyncState = 'PENDING_SYNC' | 'SYNCED' | 'SYNC_FAILED';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'TECHNICIAN';

export interface BookingRecord {
  id: string; // e.g. BK-2026-00101
  fullName: string;
  phoneNumber: string;
  address: string;
  deviceType: string;
  brand?: string;
  issueDescription: string;
  preferredTime: string;
  status: BookingStatus;
  notes?: string;
  technicianName?: string;
  estimatedCost?: number;
  imageUrl?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  syncState?: SyncState;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface BookingTrackingRecord {
  id: string; // e.g. BK-2026-00101
  status: BookingStatus;
  deviceType: string;
  brand?: string;
  preferredTime: string;
  phoneLast4: string; // only last 4 digits for secondary verification
  customerFirstName?: string; // e.g. "أحمد"
  hasWarranty: boolean;
  stage: number; // 1: استلام, 2: موعد, 3: فحص وإصلاح, 4: اكتمال وضمان
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string; // e.g. CUST-01012345678
  name: string;
  phone: string;
  address: string;
  area?: string;
  notes?: string;
  totalBookings: number;
  totalSpent?: number;
  lastBookingDate?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface RepairJob {
  id: string; // e.g. JOB-2026-00101
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  applianceType: string;
  brand: string;
  model?: string;
  problemDescription: string;
  diagnosis: string;
  solution: string;
  technicianName: string;
  status: BookingStatus;
  partsReplaced: string[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  warrantyDuration: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface RepairWork {
  id: string;
  title: string;
  category: 'ثلاجات' | 'غسالات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات';
  deviceType: string;
  brand?: string;
  problem: string;
  solution: string;
  date: string;
  image: string;
  beforeImage?: string;
  partsReplaced?: string[];
  warranty?: string;
  createdAt?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  deviceType: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  image?: string;
  avatarLetter: string;
  verified: boolean;
  bookingId?: string; // Verified link to an actual booking
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export interface AppSystemSettings {
  centerName: string;
  centerSlogan: string;
  phone1: string;
  phone1Display: string;
  phone2: string;
  phone2Display: string;
  whatsappNumber: string;
  locationName: string;
  yearsExperience: string;
  operatingHours: string;
  googleMapsLink: string;
  facebookPage: string;
  facebookGroup: string;
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroBannerImage?: string;
  warrantyDurationDefault: string;
  maintenancePriceStart: string;
  emergencyNotice: string;
}

export interface BookingFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  deviceType: string;
  brand: string;
  issueDescription: string;
  preferredTime: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ForSaleCategory = 'الكل' | 'ثلاجات' | 'غسالات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات' | 'أخرى';
export type ForSaleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export interface ApplianceForSale {
  id: string; // e.g. SALE-001
  title: string;
  category: 'ثلاجات' | 'غسالات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات' | 'أخرى';
  brand: string;
  model?: string;
  price: number;
  originalPrice?: number;
  status: ForSaleStatus;
  condition: string;
  specs: string[];
  warranty: string;
  image: string;
  additionalImages?: string[];
  description: string;
  location?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  data: {
    bookings: BookingRecord[];
    customers: Customer[];
    repairs: RepairJob[];
    works: RepairWork[];
    reviews: CustomerReview[];
    forSale?: ApplianceForSale[];
    settings?: AppSystemSettings;
    auditLogs?: AuditLog[];
  };
}

export interface AdminUser {
  id: string; // Firebase Auth UID
  email: string;
  role: AdminRole;
  displayName?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: 
    | 'BOOKING_CREATED' 
    | 'BOOKING_UPDATED' 
    | 'BOOKING_DELETED' 
    | 'BOOKING_STATUS_CHANGED'
    | 'REPAIR_CREATED' 
    | 'REPAIR_UPDATED' 
    | 'REPAIR_DELETED'
    | 'CUSTOMER_UPDATED' 
    | 'CUSTOMER_DELETED'
    | 'REVIEW_APPROVED' 
    | 'REVIEW_REJECTED' 
    | 'REVIEW_DELETED'
    | 'ADMIN_CREATED' 
    | 'ADMIN_DELETED' 
    | 'SETTINGS_UPDATED' 
    | 'BACKUP_EXPORTED' 
    | 'BACKUP_IMPORTED';
  performedBy: {
    uid: string;
    email: string;
    role?: string;
  };
  targetId: string;
  targetCollection: string;
  details: string;
  timestamp: string;
  oldValue?: any;
  newValue?: any;
}
