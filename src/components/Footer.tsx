import React from 'react';
import { 
  Wrench, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Facebook, 
  ShieldCheck, 
  Award,
  ChevronLeft,
} from 'lucide-react';
import { 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_2, 
  DISPLAY_PHONE_2, 
  CENTER_NAME, 
  CENTER_SLOGAN, 
  YEARS_EXPERIENCE, 
  normalizeYearsExperience,
  LOCATION_NAME, 
  FACEBOOK_PAGE_1, 
  FACEBOOK_PAGE_2 
} from '../config';
import { AppSystemSettings } from '../types';
import { safePublicCopy, safeRegionCopy } from '../lib/publicCopy';

interface FooterProps {
  settings?: AppSystemSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
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

  return (
    <footer id="footer" className="bg-[#123b4a] text-white pt-16 pb-12 border-t border-white/10 relative overflow-hidden text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d97706] text-white flex items-center justify-center shadow-lg shadow-[#d97706]/20 font-black">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">{centerName}</h3>
                <span className="text-xs text-[#d97706] font-bold">محافظة البحيرة</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
              {centerSlogan} خبرة {yearsExp} سنة في صيانة الأجهزة المنزلية بمحافظة البحيرة.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                ضمان مكتوب حسب نوع الإصلاح
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                نوضح نوع القطعة قبل التركيب
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#d97706] uppercase tracking-wider">
              خدمات الصيانة المنزلية
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-semibold">
              <li>
                <a href="#services" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>صيانة الديب فريزر (صندوق وأدراج)</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>صيانة الثلاجات النوفروست والديفروست</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>صيانة الغسالات الأوتوماتيك وفوق أوتوماتيك</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>سمكرة ودوكو وعلاج بارومة الأجهزة</span>
                </a>
              </li>
              <li>
                <a href="#for-sale-section" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5 font-bold text-amber-400">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>أجهزة للبيع</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#d97706] transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>صيانة التكييفات والبوتاجازات</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#d97706] uppercase tracking-wider">
              أرقام التواصل والورشة
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold">الخط الأساسي:</span>
                <a href={`tel:+${phone1}`} className="font-mono font-black text-white hover:text-[#d97706] text-sm block" dir="ltr">
                  {phone1Display}
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold">الخط الثاني:</span>
                <a href={`tel:+${phone2}`} className="font-mono font-black text-white hover:text-emerald-400 text-sm block" dir="ltr">
                  {phone2Display}
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-bold">الموقع:</span>
                <p className="font-semibold text-slate-200">{location}</p>
              </div>
            </div>
          </div>

          {/* Column 4: Social & Admin */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-[#d97706] uppercase tracking-wider">
              تابع المركز
            </h4>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                تابع أعمال الصيانة والنصائح على صفحات المركز.
            </p>

            <div className="flex flex-col gap-2">
              <a
                href={fb1}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white text-xs font-bold transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>صفحة المركز على فيسبوك</span>
              </a>

              <a
                href={fb2}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white text-xs font-bold transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>مجموعة الصيانة</span>
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
          <div>
            <p>© {new Date().getFullYear()} {centerName} — جميع الحقوق محفوظة. محافظة البحيرة.</p>
            <p className="text-[11px] text-slate-400 font-normal mt-1">Developed by Eng. Sobhy</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-white transition-colors">الرئيسية</a>
            <span>•</span>
            <a href="#services" className="hover:text-white transition-colors">الخدمات</a>
            <span>•</span>
            <a href="#works" className="hover:text-white transition-colors">معرض الأعمال</a>
            <span>•</span>
            <a href="#for-sale-section" className="hover:text-white transition-colors">أجهزة للبيع</a>
            <span>•</span>
            <a href="#booking" className="hover:text-white transition-colors">حجز صيانة</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
