import React from 'react';
import { Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2, Award, Wrench, AlertCircle, Snowflake, Droplets, Volume2, Hammer, MapPin, CalendarDays } from 'lucide-react';
import { 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_1, 
  CENTER_NAME, 
  CENTER_SLOGAN, 
  YEARS_EXPERIENCE, 
  LOCATION_NAME,
  normalizeYearsExperience
} from '../config';
import { AppSystemSettings } from '../types';
import { safePublicCopy, safeRegionCopy } from '../lib/publicCopy';
import realAlaskaFreezer from '../assets/images/real_alaska_freezer_1788256277335.webp';
import silverWasherRepair from '../assets/images/silver_washer_repair_1788256297679.webp';
import samsungWasherAfter from '../assets/images/samsung_washer_after_1788256332451.webp';
import fridgeRestoredAfter from '../assets/images/fridge_restored_after_1788256368740.webp';

interface HeroProps {
  onOpenBooking: () => void;
  settings?: AppSystemSettings;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, settings }) => {
  const centerName = settings?.centerName || CENTER_NAME;
  const phone1 = settings?.phone1 || PHONE_NUMBER_1;
  const phone1Display = settings?.phone1Display || DISPLAY_PHONE_1;
  const yearsExp = normalizeYearsExperience(settings?.yearsExperience || YEARS_EXPERIENCE);
  const location = safeRegionCopy(settings?.locationName, LOCATION_NAME);
  const heroBadge = safePublicCopy(settings?.heroBadge, `صيانة منزلية في محافظة البحيرة • خبرة ${yearsExp} سنة`);
  const heroHeadline = safePublicCopy(settings?.heroHeadline, 'جهازك عطلان؟ نبدأ بفحص واضح');
  const heroHeadlineHighlight = safePublicCopy(settings?.heroHeadlineHighlight, 'ونشرح لك الحل والتكلفة قبل الإصلاح');
  const heroSubheadline = safePublicCopy(settings?.heroSubheadline, 'صيانة ثلاجات وغسالات وديب فريزر وأجهزة منزلية داخل محافظة البحيرة. تواصل معنا لمعرفة الموعد المتاح.');

  return (
    <section id="hero" className="relative overflow-hidden bg-[#f8fafc] pt-8 pb-16 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Hero Content (Right in RTL) */}
          <div className="lg:col-span-7 text-right">
            
            {/* Top Badge: Experience & Speed */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#123b4a]/10 text-[#123b4a] text-xs sm:text-sm font-black mb-4 border border-[#123b4a]/15">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#d97706]"></span>
              <span>{heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-black text-[#123b4a] leading-[1.25] tracking-tight">
              {heroHeadline}
              {heroHeadlineHighlight && <><br /><span className="text-[#d97706] inline-block mt-1">{heroHeadlineHighlight}</span></>}
            </h1>

            {/* Slogan & Value Prop */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl">
              {heroSubheadline}
            </p>

            {/* Fast Problem Ticker Grid */}
            <div className="mt-5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-[#123b4a] mb-2.5">
                <AlertCircle className="w-4 h-4 text-[#d97706]" />
                <span>أعطال بنساعدك في فحصها:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Snowflake className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                  <span>الديب فريزر فصل أو ما عادش بيجمد</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Droplets className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  <span>الثلاجة بتجمع ثلج ومش بتبرد أو بتنزل ميه</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Volume2 className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  <span>الغسالة بتعصر بصوت مزعج أو مش بتطرد ميه</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Hammer className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                  <span>علاج وسمكرة البرومة والدوكو للأجهزة</span>
                </div>
              </div>
            </div>

            {/* 3 Core Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#d97706] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">تنسيق الزيارة</h4>
                  <p className="text-xs sm:text-sm font-black text-[#123b4a]">موعد حسب منطقتك</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123b4a] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">تفاصيل الإصلاح</h4>
                  <p className="text-xs sm:text-sm font-black text-[#123b4a]">القطعة والضمان قبل التركيب</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">خبرة المركز</h4>
                  <p className="text-xs sm:text-sm font-black text-[#123b4a]">{yearsExp} سنة في الصيانة</p>
                </div>
              </div>
            </div>

            {/* Primary Call To Action Buttons + One Phone */}
            <div className="mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Primary booking action */}
              <button
                type="button"
                onClick={onOpenBooking}
                id="hero-book-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-[#123b4a] hover:bg-[#174c5d] border border-[#123b4a] transition-colors active:scale-[0.98]"
              >
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">اطلب زيارة</span>
              </button>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${phone1}?text=${encodeURIComponent(`السلام عليكم، عايز أستفسر عن صيانة جهاز منزلي لدى ${centerName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 transition-colors active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">اسألنا على واتساب</span>
              </a>

              {/* Call Button 1 */}
              <a
                href={`tel:+${phone1}`}
                id="hero-call-btn-1"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-[#123b4a] bg-white hover:bg-slate-50 border border-slate-300 transition-colors active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 text-[#d97706] shrink-0" />
                <span className="font-mono whitespace-nowrap" dir="ltr">{phone1Display}</span>
              </a>

            </div>

            {/* Location & Trust note */}
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>المواعيد تتأكد بعد التواصل • {location}</span>
            </div>
          </div>

          {/* Image Showcase Grid with REAL APPLIANCE PHOTOS (Left in RTL) */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              
              {/* Card 1: Deep Freezer / Chest Freezer Repair */}
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[4/5] transform hover:-translate-y-1 transition-all">
                <img
                  src={realAlaskaFreezer}
                  alt="صيانة ديب فريزر ألاسكا رأسي وأفقي"
                  width="720"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123b4a]/95 via-[#123b4a]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#d97706] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
                    ديب فريزر ألاسكا وكريازي
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-snug">شحن فريون وتغيير مواتير دانفوس</h3>
                </div>
              </div>

              {/* Card 2: Refrigerator Repair & Restoration */}
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[4/5] mt-6 transform hover:-translate-y-1 transition-all">
                <img
                  src={fridgeRestoredAfter}
                  alt="تجديد ثلاجة بابين دوكو فرن وبارومة"
                  width="720"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123b4a]/95 via-[#123b4a]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#d97706] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
                    ثلاجات نوفروست وبابين
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-snug">تجديد دوكو وعلاج بارومة وشحن</h3>
                </div>
              </div>

              {/* Card 3: Washing Machine Repair & Baroma */}
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[4/5] -mt-6 transform hover:-translate-y-1 transition-all">
                <img
                  src={samsungWasherAfter}
                  alt="تجديد وصيانة غسالة سامسونج داياموند أوتوماتيك"
                  width="720"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123b4a]/95 via-[#123b4a]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#d97706] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
                    غسالات سامسونج وزانوسي
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-snug">صوت العصر • رولمان بلي • شاسيه</h3>
                </div>
              </div>

              {/* Card 4: Silver Washer & Appliances */}
              <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[4/5] transform hover:-translate-y-1 transition-all">
                <img
                  src={silverWasherRepair}
                  alt="صيانة غسالات أمامية وفوق أوتوماتيك"
                  width="720"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123b4a]/95 via-[#123b4a]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#d97706] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
                    غسالات وبوتاجازات
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-snug">طلمبات طرد • جيربوكس • فحص وإصلاح</h3>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-4 bg-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-slate-200/80 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#123b4a] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#d97706]" />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-[#123b4a]">{centerName}</p>
                <p className="text-[10px] text-slate-500 font-bold">{location}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
