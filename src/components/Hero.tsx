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
import illustrativeRefrigerator from '../assets/images/illustrative_refrigerator.webp';

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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] border border-[#b45309] shadow-lg shadow-[#d97706]/20 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] focus-visible:ring-offset-2"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-black text-white bg-[#159447] hover:bg-[#11783a] border border-[#11783a] shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">اسألنا على واتساب</span>
              </a>

              {/* Call Button 1 */}
              <a
                href={`tel:+${phone1}`}
                id="hero-call-btn-1"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-black text-[#123b4a] bg-white hover:bg-[#123b4a]/5 border border-[#123b4a]/25 shadow-sm transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#123b4a] focus-visible:ring-offset-2"
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

          {/* صورة تحريرية حقيقية، وليست من أعمال المركز أو إعلانًا عن جهاز للبيع. */}
          <div className="lg:col-span-5 relative">
            <figure className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-[#123b4a] shadow-2xl shadow-[#123b4a]/15 aspect-[4/5]">
              <img
                src={illustrativeRefrigerator}
                alt="ثلاجة منزلية مفتوحة من الداخل — صورة توضيحية وليست من أعمال المركز"
                width="1350"
                height="1791"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-center brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061923]/85 via-transparent to-[#061923]/10" aria-hidden="true" />
              <span className="absolute top-4 right-4 rounded-full border border-white/20 bg-[#123b4a]/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                صورة توضيحية
              </span>
              <figcaption className="absolute bottom-5 right-5 left-5 text-right text-white">
                <p className="text-sm font-black sm:text-base">صورة لجهاز منزلي</p>
                <p className="mt-1 text-xs font-medium leading-5 text-white/80">ليست من أعمال المركز ولا تمثل جهازًا معروضًا للبيع.</p>
              </figcaption>
            </figure>
            <div className="mx-auto mt-3 flex max-w-md flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 font-bold text-[#123b4a]">
                <MapPin className="h-4 w-4 text-[#d97706]" aria-hidden="true" />
                <span>{centerName} · {location}</span>
              </div>
              <a
                href="https://commons.wikimedia.org/wiki/File:Open_refrigerator_with_food_at_night.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-slate-300 underline-offset-2 hover:text-[#123b4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706]"
                aria-label="مصدر الصورة: W.carter على Wikimedia Commons، بترخيص CC BY-SA 4.0؛ تم تحجيمها وتحويلها إلى WebP"
              >
                الصورة: W.carter · CC BY-SA 4.0 · تم التحجيم
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
