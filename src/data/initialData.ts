import { RepairWork, CustomerReview, AppSystemSettings, ApplianceForSale } from '../types';
import realAlaskaFreezer from '../assets/images/real_alaska_freezer_1788256277335.webp';

export const INITIAL_SETTINGS: AppSystemSettings = {
  centerName: 'مركز قطب للحل السريع',
  centerSlogan: 'نشرح لك العطل والتكلفة والضمان قبل ما نبدأ.',
  phone1: '201026663706',
  phone1Display: '01026663706',
  phone2: '201010965540',
  phone2Display: '01010965540',
  whatsappNumber: '201026663706',
  locationName: 'محافظة البحيرة',
  yearsExperience: '30',
  operatingHours: 'الزيارات المنزلية يوميًا 8 ص–11 م • تواصل معنا لمعرفة الموعد المتاح',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Beheira+Governorate%2C+Egypt',
  facebookPage: 'https://www.facebook.com/share/19Jhvhxgr5/',
  facebookGroup: 'https://www.facebook.com/share/g/189yB2ww3f/',
  heroBadge: 'صيانة منزلية في محافظة البحيرة • خبرة 30 سنة',
  heroHeadline: 'جهازك عطلان؟ نبدأ بفحص واضح',
  heroHeadlineHighlight: 'ونشرح لك الحل والتكلفة قبل الإصلاح',
  heroSubheadline: 'صيانة ثلاجات وغسالات وديب فريزر وأجهزة منزلية داخل محافظة البحيرة. تواصل معنا لمعرفة التغطية والموعد المتاح.',
  heroBannerImage: realAlaskaFreezer,
  warrantyDurationDefault: 'تفاصيل الضمان حسب نوع الإصلاح والقطعة',
  maintenancePriceStart: 'الكشف مجاني عند إتمام الصيانة',
  emergencyNotice: 'الزيارات المنزلية يوميًا من 8 صباحًا إلى 11 مساءً، بعد التأكد من التغطية والموعد المتاح'
};


// لا تُعرض أعمال تجريبية كأنها حالات عملاء حقيقية.
export const INITIAL_WORKS: RepairWork[] = [];
export const INITIAL_PRODUCTS_FOR_SALE: ApplianceForSale[] = [];

// لا نضع آراء تجريبية أو أسماء افتراضية هنا. الآراء المنشورة تأتي من قاعدة البيانات بعد مراجعتها.
export const INITIAL_REVIEWS: CustomerReview[] = [];
