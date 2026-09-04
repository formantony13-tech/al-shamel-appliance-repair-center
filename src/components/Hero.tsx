import React from 'react';
import { Phone, MessageSquare, Clock, ShieldCheck, CheckCircle2, Star, Sparkles, Award, Wrench, AlertCircle } from 'lucide-react';
import { 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_2, 
  PHONE_NUMBER_2, 
  CENTER_NAME, 
  CENTER_SLOGAN, 
  YEARS_EXPERIENCE, 
  LOCATION_NAME 
} from '../config';
import { AppSystemSettings } from '../types';
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
  const phone2 = settings?.phone2 || PHONE_NUMBER_2;
  const phone2Display = settings?.phone2Display || DISPLAY_PHONE_2;
  const yearsExp = settings?.yearsExperience || YEARS_EXPERIENCE;
  const location = settings?.locationName || LOCATION_NAME;
  const heroBadge = settings?.heroBadge || `مركز قطب • خبرة أكثر من ${yearsExp} سنة | فروع البحيرة • الغربية • الشرقية`;
  const heroHeadline = settings?.heroHeadline || 'مهما كانت المشكلة في الأجهزة المنزلية صعبة.. إحنا هنحلها لك فوراً! ⚙️';
  const heroHeadlineHighlight = settings?.heroHeadlineHighlight || 'الثلاجة، الغسالة، أو الديب فريزر';
  const heroSubheadline = settings?.heroSubheadline || 'في خلال 24 ساعة بيكون عندك أسطول صيانة وفني محترف يصلح لك العطل أينما كنت في محافظات البحيرة، الغربية، والشرقية مع قطع غيار أصلية 100% وضمان معتمد.';
  const heroBannerImage = settings?.heroBannerImage || realAlaskaFreezer;

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-slate-50 to-[#eef4f9] pt-8 pb-16 lg:pt-12 lg:pb-20">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#ff7a00]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#0e3a5e]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Hero Content (Right in RTL) */}
          <div className="lg:col-span-7 text-right">
            
            {/* Top Badge: Experience & Speed */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e3a5e]/10 text-[#0e3a5e] text-xs sm:text-sm font-black mb-4 border border-[#0e3a5e]/15">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#ff7a00] animate-ping"></span>
              <span>{heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-black text-[#0e3a5e] leading-[1.25] tracking-tight">
              {heroHeadlineHighlight ? (
                <>
                  مهما كانت المشكلة في
                  <br />
                  <span className="text-[#ff7a00] inline-block mt-1">{heroHeadlineHighlight}</span>
                  <br />
                  صعبة.. إحنا هنحلها لك فوراً! ⚙️
                </>
              ) : (
                heroHeadline
              )}
            </h1>

            {/* Slogan & Value Prop */}
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl">
              {heroSubheadline}
            </p>

            {/* Fast Problem Ticker Grid */}
            <div className="mt-5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black text-[#0e3a5e] mb-2.5">
                <AlertCircle className="w-4 h-4 text-[#ff7a00]" />
                <span>أشهر الأعطال التي نقوم بحلها بنفس اليوم:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-blue-500">❄️</span>
                  <span>الديب فريزر فصل أو ما عادش بيجمد</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-emerald-500">💦</span>
                  <span>الثلاجة بتجمع ثلج ومش بتبرد أو بتنزل ميه</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-amber-500">🔊</span>
                  <span>الغسالة بتعصر بصوت مزعج أو مش بتطرد ميه</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-rose-500">🛠️</span>
                  <span>علاج وسمكرة البرومة والدوكو للأجهزة</span>
                </div>
              </div>
            </div>

            {/* 3 Core Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff7a00] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">سرعة الاستجابة</h4>
                  <p className="text-xs sm:text-sm font-black text-[#0e3a5e]">زيارة خلال 24 ساعة</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0e3a5e] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">قطع أصلية</h4>
                  <p className="text-xs sm:text-sm font-black text-[#0e3a5e]">أصلية 100% + ضمان</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500">خبرة هندسية</h4>
                  <p className="text-xs sm:text-sm font-black text-[#0e3a5e]">+{yearsExp} سنة خبرة</p>
                </div>
              </div>
            </div>

            {/* 2 Primary Call To Action Buttons + Both Phones */}
            <div className="mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${phone1}?text=مرحباً، أود حجز مهندس صيانة من ${encodeURIComponent(centerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm sm:text-base font-black text-white bg-[#25D366] hover:bg-[#20ba59] shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition-all transform active:scale-95"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">واتساب 24 ساعة</span>
              </a>

              {/* Call Button 1 */}
              <a
                href={`tel:+${phone1}`}
                id="hero-call-btn-1"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm sm:text-base font-black text-white bg-[#0e3a5e] hover:bg-[#123f66] shadow-lg shadow-[#0e3a5e]/20 hover:shadow-xl transition-all transform active:scale-95"
              >
                <Phone className="w-5 h-5 text-[#ff7a00] shrink-0" />
                <span className="font-mono whitespace-nowrap" dir="ltr">{phone1Display}</span>
              </a>

              {/* Call Button 2 */}
              <a
                href={`tel:+${phone2}`}
                id="hero-call-btn-2"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#0e3a5e] hover:text-[#0e3a5e] transition-colors"
                title="خط الاتصال الثاني"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>الخط الثاني:</span>
                <span className="font-mono whitespace-nowrap" dir="ltr">{phone2Display}</span>
              </a>

              {/* Instant Booking Form Button */}
              <button
                type="button"
                onClick={onOpenBooking}
                id="hero-book-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-[#ff7a00] bg-orange-50 border border-orange-200 hover:bg-[#ff7a00] hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">طلب حجز زيارة فورية</span>
              </button>
            </div>

            {/* Location & Trust note */}
            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>صيانة فورية ومضمونة تصنع الفرق • {location}</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a5e]/95 via-[#0e3a5e]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#ff7a00] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a5e]/95 via-[#0e3a5e]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#ff7a00] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a5e]/95 via-[#0e3a5e]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#ff7a00] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a5e]/95 via-[#0e3a5e]/30 to-transparent flex flex-col justify-end p-3.5 sm:p-4 text-white">
                  <span className="text-[10px] sm:text-xs font-black text-[#ff7a00] bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md w-fit mb-1">
                    غسالات وبوتاجازات
                  </span>
                  <h3 className="text-xs sm:text-sm font-black leading-snug">طلمبات طرد • جيربوكس • قطع أصلية</h3>
                </div>
              </div>
            </div>

            {/* Floating Rating Badge */}
            <div className="absolute -bottom-4 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-200/80 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0e3a5e] text-white flex items-center justify-center font-black text-lg shadow-sm">
                4.9
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[#ff7a00]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ff7a00]" />
                  ))}
                </div>
                <p className="text-xs font-black text-[#0e3a5e] mt-1">{centerName}</p>
                <p className="text-[10px] text-slate-500 font-bold">خبرة +{yearsExp} سنة بأبو المطامير</p>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div className="mt-14 lg:mt-18 pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-sm">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0e3a5e]">+{yearsExp} سنة</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">خبرة فنية متوارثة</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-sm">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#ff7a00]">100%</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">قطع غيار أصلية ومضمونة</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-sm">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600">خلال 24 س</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">وصول المهندس لمنزلك</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100 shadow-sm">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0e3a5e]">24 ساعة</div>
              <div className="text-xs sm:text-sm font-bold text-slate-600 mt-1">خدمة واستقبال واتساب</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
