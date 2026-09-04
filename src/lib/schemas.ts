import { z } from 'zod';
import { validateEgyptianPhone } from './validation';

// Egyptian Phone Schema using our custom validator
export const EgyptianPhoneSchema = z.string().superRefine((val, ctx) => {
  const result = validateEgyptianPhone(val);
  if (!result.isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error || 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)'
    });
  }
});

// Appliance Categories
export const ApplianceCategorySchema = z.enum([
  'الكل',
  'ثلاجات',
  'غسالات',
  'ديب فريزر',
  'تكييفات',
  'بوتاجازات'
]);

// Booking Status Schema
export const BookingStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'SCHEDULED',
  'ASSIGNED',
  'IN_PROGRESS',
  'WAITING_FOR_PART',
  'COMPLETED',
  'CANCELLED'
]);

// Booking Record Schema
export const BookingSchema = z.object({
  id: z.string().min(3),
  fullName: z.string().min(3, 'الاسم بالكامل يجب أن لا يقل عن 3 أحرف'),
  phoneNumber: EgyptianPhoneSchema,
  address: z.string().min(5, 'العنوان بالتفصيل أو اسم القرية مطلوب'),
  deviceType: z.string().min(2, 'يرجى تحديد نوع الجهاز'),
  brand: z.string().optional().default(''),
  issueDescription: z.string().min(5, 'يرجى كتابة وصف مختصر للعطل (5 أحرف على الأقل)'),
  preferredTime: z.string().optional().default('صباحاً (9 ص - 2 ظ)'),
  status: BookingStatusSchema.default('NEW'),
  notes: z.string().optional().default(''),
  technicianName: z.string().optional().default(''),
  estimatedCost: z.number().optional().default(0),
  imageUrl: z.string().optional().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
  syncState: z.enum(['PENDING_SYNC', 'SYNCED', 'SYNC_FAILED']).optional(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
  deletedBy: z.string().optional()
});

// Safe Booking Tracking Schema (Public, no PII)
export const BookingTrackingSchema = z.object({
  id: z.string().min(3),
  status: BookingStatusSchema,
  deviceType: z.string().min(2),
  brand: z.string().optional().default(''),
  preferredTime: z.string().optional().default(''),
  phoneLast4: z.string().length(4),
  customerFirstName: z.string().optional(),
  hasWarranty: z.boolean().default(false),
  stage: z.number().min(1).max(4).default(1),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Customer Schema
export const CustomerSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  phone: EgyptianPhoneSchema,
  address: z.string().min(3),
  area: z.string().optional().default('أبو المطامير'),
  notes: z.string().optional().default(''),
  totalBookings: z.number().nonnegative().default(1),
  totalSpent: z.number().nonnegative().default(0),
  lastBookingDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
  deletedBy: z.string().optional()
});

// Repair Job Technical Sheet Schema
export const RepairJobSchema = z.object({
  id: z.string().min(3),
  bookingId: z.string().min(3),
  customerId: z.string().min(3),
  customerName: z.string(),
  customerPhone: z.string(),
  address: z.string(),
  applianceType: z.string(),
  brand: z.string(),
  model: z.string().optional().default(''),
  problemDescription: z.string(),
  diagnosis: z.string().min(3, 'يرجى كتابة التقرير الفني للتشخيص'),
  solution: z.string().min(3, 'يرجى كتابة خطوات الإصلاح المتبعة'),
  technicianName: z.string().min(2, 'يرجى تحديد اسم الفني المسؤول'),
  status: BookingStatusSchema,
  partsReplaced: z.array(z.string()).default([]),
  laborCost: z.number().nonnegative().default(0),
  partsCost: z.number().nonnegative().default(0),
  totalCost: z.number().nonnegative().default(0),
  warrantyDuration: z.string().default('6 شهور ضمان معتمد'),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
  deletedBy: z.string().optional()
});

// Customer Review Schema
export const ReviewSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(2, 'الاسم يجب ألا يقل عن حرفين'),
  deviceType: z.string().min(2, 'يرجى تحديد الجهاز'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'نص التقييم يجب ألا يقل عن 5 أحرف'),
  date: z.string(),
  image: z.string().optional().default(''),
  avatarLetter: z.string().default('ع'),
  verified: z.boolean().default(false),
  bookingId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  createdAt: z.string().optional()
});

// Repair Work Schema
export const WorkSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(5, 'عنوان العمل مطلوب'),
  category: z.enum(['ثلاجات', 'غسالات', 'ديب فريزر', 'تكييفات', 'بوتاجازات']),
  deviceType: z.string().min(2),
  brand: z.string().optional().default(''),
  problem: z.string().min(5),
  solution: z.string().min(5),
  date: z.string(),
  image: z.string().min(5, 'صورة العمل مطلوبة'),
  beforeImage: z.string().optional().default(''),
  partsReplaced: z.array(z.string()).default([]),
  warranty: z.string().optional().default('ضمان معتمد'),
  createdAt: z.string().optional()
});

// Settings Schema
export const SettingsSchema = z.object({
  centerName: z.string().min(2),
  centerSlogan: z.string().min(2),
  phone1: z.string().min(8),
  phone1Display: z.string().min(8),
  phone2: z.string().min(8),
  phone2Display: z.string().min(8),
  whatsappNumber: z.string().min(8),
  locationName: z.string().min(3),
  yearsExperience: z.string().min(1),
  operatingHours: z.string().min(3),
  googleMapsLink: z.string().optional().default(''),
  facebookPage: z.string().optional().default(''),
  facebookGroup: z.string().optional().default(''),
  heroBadge: z.string().optional().default(''),
  heroHeadline: z.string().optional().default(''),
  heroHeadlineHighlight: z.string().optional().default(''),
  heroSubheadline: z.string().optional().default(''),
  heroBannerImage: z.string().optional().default(''),
  warrantyDurationDefault: z.string().optional().default('6 شهور ضمان معتمد'),
  maintenancePriceStart: z.string().optional().default('الكشف مجاني عند إتمام الصيانة'),
  emergencyNotice: z.string().optional().default('')
});

// For Sale Item Schema
export const ForSaleItemSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(5, 'عنوان المعروض مطلوب'),
  category: z.enum(['ثلاجات', 'غسالات', 'ديب فريزر', 'تكييفات', 'بوتاجازات', 'أخرى']),
  brand: z.string().min(2, 'الماركة مطلوبة'),
  model: z.string().optional().default(''),
  price: z.number().nonnegative('السعر يجب أن يكون رقماً موجباً'),
  originalPrice: z.number().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).default('AVAILABLE'),
  condition: z.string().min(3, 'يرجى تحديد حالة الجهاز'),
  specs: z.array(z.string()).default([]),
  warranty: z.string().min(3, 'فترة الضمان مطلوبة'),
  image: z.string().min(5, 'صورة الجهاز مطلوبة'),
  additionalImages: z.array(z.string()).optional().default([]),
  description: z.string().min(5, 'وصف الجهاز مطلوب'),
  location: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  createdAt: z.string(),
  updatedAt: z.string().optional()
});

// Admin User Schema
export const AdminUserSchema = z.object({
  id: z.string().min(3),
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TECHNICIAN']),
  displayName: z.string().optional().default(''),
  createdAt: z.string()
});

// Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string().min(3),
  action: z.string(),
  performedBy: z.object({
    uid: z.string(),
    email: z.string(),
    role: z.string().optional()
  }),
  targetId: z.string(),
  targetCollection: z.string(),
  details: z.string(),
  timestamp: z.string(),
  oldValue: z.any().optional(),
  newValue: z.any().optional()
});

// Backup / Import Schema
export const BackupSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  data: z.object({
    bookings: z.array(BookingSchema).optional().default([]),
    customers: z.array(CustomerSchema).optional().default([]),
    repairs: z.array(RepairJobSchema).optional().default([]),
    works: z.array(WorkSchema).optional().default([]),
    reviews: z.array(ReviewSchema).optional().default([]),
    forSale: z.array(ForSaleItemSchema).optional().default([]),
    settings: SettingsSchema.optional(),
    auditLogs: z.array(AuditLogSchema).optional().default([])
  })
});
