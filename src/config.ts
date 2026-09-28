// ==========================================
// إعدادات الموقع وبيانات الاتصال - مركز قطب للحل السريع
// مستمدة من المصدر الموحد (INITIAL_SETTINGS)
// ==========================================
import { INITIAL_SETTINGS } from './data/initialData';

export interface SiteConfig {
  phoneNumber1: string;
  displayPhone1: string;
  phoneNumber2: string;
  displayPhone2: string;
  phoneNumber: string;
  displayPhone: string;
  centerName: string;
  centerSlogan: string;
  yearsExperience: string;
  ownerName: string;
  locationName: string;
  googleMapsLink: string;
  facebookPage: string;
  facebookGroup: string;
}

export const PHONE_NUMBER_1: string = INITIAL_SETTINGS.phone1; // رقم الواتساب والاتصال الأساسي
export const DISPLAY_PHONE_1: string = INITIAL_SETTINGS.phone1Display; // رقم الهاتف الأساسي للظهور

export const PHONE_NUMBER_2: string = INITIAL_SETTINGS.phone2; // رقم الاتصال والواتساب الثاني
export const DISPLAY_PHONE_2: string = INITIAL_SETTINGS.phone2Display; // رقم الهاتف الثاني للظهور

// للتوافق مع المكونات
export const PHONE_NUMBER: string = PHONE_NUMBER_1;
export const DISPLAY_PHONE: string = DISPLAY_PHONE_1;

export const CENTER_NAME: string = INITIAL_SETTINGS.centerName;
export const CENTER_SLOGAN: string = INITIAL_SETTINGS.centerSlogan;
export const YEARS_EXPERIENCE: string = INITIAL_SETTINGS.yearsExperience;
export const OWNER_NAME: string = "مركز قطب";
export const LOCATION_NAME: string = INITIAL_SETTINGS.locationName;
export const BRANCHES_LIST: { id: string; name: string; areas: string }[] = [
  { id: 'beheira', name: 'محافظة البحيرة', areas: 'دمنهور، أبو المطامير، كفر الدوار، حوش عيسى، إيتاي البارود، كوم حمادة، الدلنجات، رشيد، أبو حمص، المحمودية، وادي النطرون وكافة القرى' },
  { id: 'gharbia', name: 'محافظة الغربية', areas: 'طنطا، المحلة الكبرى، زفتى، كفر الزيات، سمنود، السنطة، بسيون، قطور وكافة القرى والمراكز' },
  { id: 'sharqia', name: 'محافظة الشرقية', areas: 'الزقازيق، العاشر من رمضان، بلبيس، فاقوس، منيا القمح، أبو حماد، ههيا، الحسينية، ديرب نجم، كفر صقر وكافة القرى' }
];
export const GOOGLE_MAPS_LINK: string = INITIAL_SETTINGS.googleMapsLink || "https://maps.app.goo.gl/oKTLj5erUH9ox3Kt5";

export const FACEBOOK_PAGE: string = INITIAL_SETTINGS.facebookPage || "https://www.facebook.com/share/19Jhvhxgr5/";
export const FACEBOOK_GROUP: string = INITIAL_SETTINGS.facebookGroup || "https://www.facebook.com/share/g/189yB2ww3f/";

// للتوافق القديم
export const FACEBOOK_PAGE_1: string = FACEBOOK_PAGE;
export const FACEBOOK_PAGE_2: string = FACEBOOK_GROUP;

// Single Source of Truth for Super Admin / Owner Privileges
// سياسة المالك الوحيدة: لا تعتمد صلاحية الإدارة على متغيرات بيئة أو قائمة بريد قابلة للتوسعة.
// يجب أن يتطابق البريد حرفياً (مع تجاهل حالة الأحرف والمسافات) مع حساب المالك.
export const MASTER_ADMIN_EMAIL = 'mohamed0102666sobhy@eng.com';
export const MASTER_ADMIN_EMAILS = [MASTER_ADMIN_EMAIL];

export function isMasterAdminEmail(email?: string | null): boolean {
  return Boolean(email && email.trim().toLowerCase() === MASTER_ADMIN_EMAIL);
}

export const SITE_CONFIG: SiteConfig = {
  phoneNumber1: PHONE_NUMBER_1,
  displayPhone1: DISPLAY_PHONE_1,
  phoneNumber2: PHONE_NUMBER_2,
  displayPhone2: DISPLAY_PHONE_2,
  phoneNumber: PHONE_NUMBER,
  displayPhone: DISPLAY_PHONE,
  centerName: CENTER_NAME,
  centerSlogan: CENTER_SLOGAN,
  yearsExperience: YEARS_EXPERIENCE,
  ownerName: OWNER_NAME,
  locationName: LOCATION_NAME,
  googleMapsLink: GOOGLE_MAPS_LINK,
  facebookPage: FACEBOOK_PAGE,
  facebookGroup: FACEBOOK_GROUP,
};
