import React from 'react';
import { 
  Wrench, 
  Flame, 
  Wind, 
  Sparkles, 
  Disc, 
  Zap, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Hammer,
  ShieldCheck
} from 'lucide-react';
import { CENTER_NAME, PHONE_NUMBER_1, DISPLAY_PHONE_1 } from '../config';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'refrigerators',
      title: 'صيانة ثلاجات نوفروست وديفروست',
      category: 'ثلاجات',
      icon: Wind,
      color: 'from-blue-600 to-[#0e3a5e]',
      accentBg: 'bg-blue-50 text-blue-600',
      badge: 'خدمة سريعة في بيتك',
      description: 'حلول جذرية لجميع مشاكل التبريد وتسريب الفريون وتراكم الثلج لكافة الماركات (شارب، توشيبا، كريازي، بيكو، سامسونج، إل جي، زانوسي).',
      commonProblems: [
        'الثلاجة بتجمع ثلج ومش بتبرد في الكابينة السفلية أو بتنزل ميه 💦',
        'الثلاجة فصلت بدون سبب أو الموتور سخن وبيعمل تكة ولا يقوم',
        'تسريب فريون وضعف التبريد أو تسليك مسار الصرف الساخن',
        'علاج وتجديد البرومة والسمكرة وتغيير الجوانات الأصلية'
      ],
      brands: ['Sharp', 'Toshiba', 'Kiriazi', 'Beko', 'Samsung', 'LG', 'Zanussi']
    },
    {
      id: 'deep-freezers',
      title: 'صيانة ديب فريزر (صندوق ورأسي أدراج)',
      category: 'ديب فريزر',
      icon: Zap,
      color: 'from-cyan-600 to-[#0e3a5e]',
      accentBg: 'bg-cyan-50 text-cyan-600',
      badge: 'تجميد فوري مضمون',
      description: 'فحص وإصلاح مواتير وكارتات الديب فريزر الصندوق والأدراج، شحن فريون عالي النقاوة، وضبط التجميد الفائق حتى -24 درجة.',
      commonProblems: [
        'الديب فريزر فصل لوحده أو ما عادش بيجمد الأطعمة 🔧',
        'تجميد الأدراج العلوية فقط وتوقف التبريد في الأدراج السفلية',
        'تغيير كمبروسر دانفوس وسيكوب أصلي مع ضمان سنة كاملة',
        'صيانة كارتة الديجيتال وحساسات التبريد ومروحة النوفروست'
      ],
      brands: ['Kiriazi', 'Beko', 'Toshiba', 'Alaska', 'Fresh', 'White Whale', 'Passap']
    },
    {
      id: 'washing-machines',
      title: 'صيانة غسالات أوتوماتيك وفوق أوتوماتيك',
      category: 'غسالات',
      icon: Disc,
      color: 'from-emerald-600 to-[#0e3a5e]',
      accentBg: 'bg-emerald-50 text-emerald-600',
      badge: 'قطع غيار أصلية 100%',
      description: 'صيانة فورية شاملة للميكانيكا والكهرباء والكارتات وتغيير رولمان البلي الأصلي في المنزل دون نقل الغسالة.',
      commonProblems: [
        'الغسالة بتعصر بصوت مزعج عالي جداً أو بتهتز بقوة 🔧',
        'الغسالة مش بتطرد ميه أو بتعلق في مرحلة الشطف والعصر',
        'الغسالة بتسرب ميه من الأسفل أو من جوان الباب ⚒️',
        'تغيير رولمان بلي ياباني أصلي، طلمبة طرد، ومساعدين اتزان'
      ],
      brands: ['LG', 'Samsung', 'Zanussi', 'Toshiba', 'Beko', 'Fresh', 'Unionaire']
    },
    {
      id: 'baroma-renovation',
      title: 'علاج وسمكرة البرومة ودوكو الأجهزة',
      category: 'غسالات',
      icon: Hammer,
      color: 'from-amber-600 to-orange-600',
      accentBg: 'bg-amber-50 text-amber-600',
      badge: 'إعادة الجهاز كالجديد',
      description: 'تجديد هياكل وشاسيهات الغسالات والثلاجات والديب فريزر المتآكلة بسبب الصدأ والمياه مع ضمان سنتين ضد عودة البرومة.',
      commonProblems: [
        'تآكل الصاج السفلي وقواعد الغسالة أو الثلاجة بسبب الصدأ',
        'قص الأجزاء المصابة وتركيب صاج مجلفن معالج ضد الرطوبة',
        'دهان دوكو فرن مطابق للون المصنع الأصلي مع عزل كامل',
        'استعدال الأبواب وتغيير المفصلات وتثبيت القواعد بدقة'
      ],
      brands: ['تجديد شامل لجميع الماركات العالمية والمحلية']
    },
    {
      id: 'air-conditioners',
      title: 'صيانة وغسيل وشحن فريون تكييفات',
      category: 'تكييفات',
      icon: Wind,
      color: 'from-sky-600 to-[#0e3a5e]',
      accentBg: 'bg-sky-50 text-sky-600',
      badge: 'تبريد أقصى كفاءة',
      description: 'غسيل كيميائي للوحدات الداخلية والخارجية، كشف تسريب الفريون، شحن فريون أصلي، وإصلاح كارتات ومراوح التبريد.',
      commonProblems: [
        'خروج هواء دافئ وضعف شديد في قوة التبريد',
        'تسقيط مياه من الوحدة الداخلية داخل الغرفة',
        'صوت عالي أو رجة في الوحدة الخارجية أثناء العمل',
        'شحن فريون R410a و R22 هندي بيور عالي الكفاءة'
      ],
      brands: ['Carrier', 'Sharp', 'Midea', 'LG', 'Unionaire', 'Gree', 'Fresh']
    },
    {
      id: 'cookers-heaters',
      title: 'صيانة بوتاجازات وسخانات وأفران',
      category: 'بوتاجازات',
      icon: Flame,
      color: 'from-orange-600 to-amber-600',
      accentBg: 'bg-orange-50 text-orange-600',
      badge: 'أمان وسلامة 100%',
      description: 'ضبط وتغيير فونيات الغاز الطبيعي والأنبوبة، تسليك المحابس بشحم حراري، وصيانة شمعات الإشعال الذاتي وحساسات أمان الفرن.',
      commonProblems: [
        'نار الشعلات ضعيفة أو تهبب الأواني بلون أسود',
        'نار الفرن تنطفئ بمجرد ترك المفتاح أو تسريب غاز',
        'عطل أزرار وشمعات الإشعال الذاتي ولمبة الفرن',
        'سخان الغاز لا يشتعل عند فتح المياه أو يقطر مياه من الرداخ'
      ],
      brands: ['Universal', 'Fresh', 'Kiriazi', 'Olympic', 'Zanussi', 'Glem Gas']
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff7a00]/10 text-[#ff7a00] text-xs font-black uppercase tracking-wider mb-3">
            خدمات مركز قطب للحل السريع
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0e3a5e] leading-tight">
            صيانة شاملة لجميع الأجهزة بقطع غيار أصلية 100%
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
            مهندسون وفنيون على أعلى مستوى من الكفاءة والأمانة يصلونك لباب منزلك خلال 24 ساعة بمحافظات البحيرة، الغربية، والشرقية
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative rounded-3xl bg-slate-50 border border-slate-200/90 p-6 hover:bg-white hover:border-[#ff7a00]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl ${service.accentBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-black text-[#0e3a5e] bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg sm:text-xl font-black text-[#0e3a5e] group-hover:text-[#ff7a00] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                    {service.description}
                  </p>

                  {/* Common Problems Box */}
                  <div className="mt-5 pt-4 border-t border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#ff7a00]" />
                      أشهر المشاكل التي نحلها فوراً:
                    </h4>
                    <ul className="space-y-2">
                      {service.commonProblems.map((problem, idx) => (
                        <li key={idx} className="text-xs text-slate-700 font-bold flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Brands supported */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.brands.map((brand) => (
                      <span key={brand} className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.category)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black text-[#0e3a5e] bg-white group-hover:bg-[#0e3a5e] group-hover:text-white border border-slate-200 group-hover:border-[#0e3a5e] shadow-sm transition-all"
                  >
                    <span>طلب مهندس صيانة لهذا الجهاز</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e3a5e] via-[#123f66] to-[#0e3a5e] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] text-xs font-black mb-2">
              خدمة واتساب وهاتف 24 ساعة
            </div>
            <h3 className="text-lg sm:text-2xl font-black">مهما كانت مشكلة جهازك صعبة.. مع {CENTER_NAME} الحل مضمون!</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
              تحدث مباشرة مع فريق الصيانة لشرح المشكلة وتحديد موعد زيارة الفني في نفس اليوم
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:+${PHONE_NUMBER_1}`}
              className="px-6 py-3.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>اتصل بنا الآن</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
