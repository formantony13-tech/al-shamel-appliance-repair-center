import React from 'react';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Facebook, 
  ExternalLink, 
  Navigation,
  CheckCircle2,
  Users,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_2, 
  DISPLAY_PHONE_2, 
  FACEBOOK_PAGE_1, 
  FACEBOOK_PAGE_2, 
  GOOGLE_MAPS_LINK,
  CENTER_NAME,
  CENTER_SLOGAN,
  YEARS_EXPERIENCE,
  LOCATION_NAME
  ,normalizeYearsExperience
} from '../config';
import { AppSystemSettings } from '../types';
import { safePublicCopy, safeRegionCopy } from '../lib/publicCopy';

interface ContactSectionProps {
  settings?: AppSystemSettings;
  onOpenArea?: (areaId: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, onOpenArea }) => {
  const centerName = settings?.centerName || CENTER_NAME;
  const centerSlogan = safePublicCopy(settings?.centerSlogan || CENTER_SLOGAN, 'نشرح لك العطل والتكلفة والضمان قبل ما نبدأ.');
  const phone1 = settings?.phone1 || PHONE_NUMBER_1;
  const phone1Display = settings?.phone1Display || DISPLAY_PHONE_1;
  const phone2 = settings?.phone2 || PHONE_NUMBER_2;
  const phone2Display = settings?.phone2Display || DISPLAY_PHONE_2;
  const yearsExp = normalizeYearsExperience(settings?.yearsExperience || YEARS_EXPERIENCE);
  const location = safeRegionCopy(settings?.locationName, LOCATION_NAME);
  const fb1 = settings?.facebookPage1 || FACEBOOK_PAGE_1;
  const fb2 = settings?.facebookPage2 || FACEBOOK_PAGE_2;
  const mapsLink = GOOGLE_MAPS_LINK;

  return (
    <section id="contact" className="py-16 lg:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123b4a]/10 text-[#123b4a] text-xs font-black uppercase tracking-wider mb-3">
            تواصل معنا
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123b4a] leading-tight">
            اسأل عن خدمة منطقتك واحجز موعدًا مناسبًا
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
            {centerSlogan} الزيارات المنزلية يوميًا من 8 صباحًا إلى 11 مساءً. تواصل معنا لمعرفة موعد الزيارة المناسب لمنطقتك.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Card 1: Direct Call */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-[#123b4a]/40 transition-all flex flex-col justify-between text-right">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#123b4a] flex items-center justify-center mb-5 shadow-sm">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-[#123b4a]">أرقام الاتصال الهاتفي المباشر</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                اتصل بينا واسأل عن نوع العطل والموعد المتاح في منطقتك.
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-mono text-sm sm:text-base font-black text-[#123b4a] text-center" dir="ltr">
                  <span className="text-xs font-bold text-slate-500 block mb-0.5 font-sans">الرقم الأساسي:</span>
                  {phone1Display}
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 font-mono text-sm sm:text-base font-black text-emerald-800 text-center" dir="ltr">
                  <span className="text-xs font-bold text-slate-500 block mb-0.5 font-sans">الرقم الثاني:</span>
                  {phone2Display}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <a
                href={`tel:+${phone1}`}
                className="py-3 rounded-xl bg-[#123b4a] hover:bg-[#174c5d] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                <span>اتصل 1</span>
              </a>
              <a
                href={`tel:+${phone2}`}
                className="py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span>اتصل 2</span>
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-[#25D366]/40 transition-all flex flex-col justify-between text-right">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center mb-5 shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-[#123b4a]">محادثة واستشارة واتساب</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                ابعت صورة أو وصف للعطل، وهنرد عليك بخطوة المتابعة المناسبة.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 font-black text-xs text-emerald-800 text-center">
                ساعات الزيارة: يوميًا من 8 صباحًا إلى 11 مساءً
              </div>
            </div>
            <a
              href={`https://wa.me/${phone1}?text=${encodeURIComponent(`السلام عليكم، عايز أستفسر عن صيانة جهاز منزلي لدى ${centerName}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>تواصل عبر واتساب الآن</span>
            </a>
          </div>

          {/* Card 3: Facebook Page & Group */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between text-right">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center mb-5 shadow-sm">
                <Facebook className="w-7 h-7" />
              </div>
                  <h3 className="text-lg font-black text-[#123b4a]">تابعنا على فيسبوك</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                انضم لصفحتنا وجروبنا لمتابعة منشورات الصيانة وفيديوهات الإصلاح العملية.
              </p>
              <div className="mt-4 space-y-2">
                <a
                  href={fb1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-black text-slate-700 hover:text-[#1877F2] border border-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    صفحة المركز الرسمية
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href={fb2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-black text-slate-700 hover:text-[#1877F2] border border-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    جروب فيسبوك للصيانة
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
            <a
              href={fb1}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Facebook className="w-4 h-4" />
              <span>متابعة صفحتنا على فيسبوك</span>
            </a>
          </div>

        </div>

        {onOpenArea && (
          <div className="mb-12 rounded-3xl border border-[#123b4a]/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-[#123b4a]">نطاق الخدمة</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">تفاصيل الزيارات داخل محافظة البحيرة</p>
              </div>
              <MapPin className="h-5 w-5 text-[#d97706]" />
            </div>
            <div className="grid gap-2 sm:grid-cols-1">
              {[
                { id: 'beheira', label: 'عرض تفاصيل الخدمة في محافظة البحيرة' },
              ].map((area) => (
                <button key={area.id} type="button" onClick={() => onOpenArea(area.id)} className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-black text-[#123b4a] ring-1 ring-slate-200 transition hover:bg-[#123b4a] hover:text-white">
                  {area.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map and Working Hours Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map Column */}
          <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2 text-right">
                <MapPin className="w-5 h-5 text-[#d97706]" />
                <div>
                  <h4 className="text-sm font-black text-[#123b4a]">نطاق التغطية والخدمة</h4>
                  <p className="text-xs text-slate-500 font-semibold">{location}</p>
                </div>
              </div>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-[#123b4a] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#d97706]" />
                <span>فتح في خرائط جوجل</span>
              </a>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] w-full bg-slate-100 relative">
              <iframe
                title={`محافظة البحيرة — نطاق خدمة ${centerName}`}
                src="https://www.google.com/maps?q=Beheira+Governorate%2C+Egypt&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Working Hours & Info */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between text-right">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#123b4a]">مواعيد العمل واستقبال البلاغات</h4>
                <p className="text-xs text-slate-500 font-semibold">الزيارات حسب التغطية والمواعيد المتاحة</p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-bold text-slate-700">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-black text-[#123b4a]">طوال أيام الأسبوع:</span>
                  <span className="font-mono">8:00 ص - 11:00 م</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                  <span className="font-black flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    للاستفسار عبر الهاتف أو واتساب:
                  </span>
                  <span className="font-black">تواصل معنا</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 block mb-1">المركز:</span>
                <p className="text-sm font-black text-[#123b4a]">{centerName}</p>
                <p className="text-xs text-slate-600 font-bold mt-0.5 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#d97706]" />
                  خبرة أكثر من {yearsExp} سنة في مجال الصيانة
                </p>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={`tel:+${phone1}`}
                className="w-full py-3 rounded-xl bg-[#123b4a] hover:bg-[#174c5d] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#d97706]" />
                <span>اتصل للاستفسار</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
