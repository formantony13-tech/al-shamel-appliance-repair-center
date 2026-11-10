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
  onOpenService?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, onOpenService }) => {
  const services = [
    {
      id: 'refrigerators',
      title: 'صيانة ثلاجات نوفروست وديفروست',
      category: 'ثلاجات',
      icon: Wind,
      color: 'from-blue-600 to-[#123b4a]',
      accentBg: 'bg-blue-50 text-blue-600',
      badge: 'فحص وإصلاح حسب الحالة',
      description: 'لو الثلاجة مش بتبرد أو بتكوّن تلج أو بتنزل مياه، بنفحص سبب العطل ونوضح لك خيارات الإصلاح قبل ما نبدأ.',
      commonProblems: [
        'ضعف التبريد أو تراكم الثلج في جزء من الثلاجة',
        'مياه أسفل الجهاز أو صوت غير معتاد من الموتور',
        'فحص تسريب التبريد ومجرى تصريف المياه',
        'إصلاح الهيكل أو تغيير الجوان عند الحاجة'
      ],
      brands: ['Sharp', 'Toshiba', 'Kiriazi', 'Beko', 'Samsung', 'LG', 'Zanussi']
    },
    {
      id: 'deep-freezers',
      title: 'صيانة ديب فريزر (صندوق ورأسي أدراج)',
      category: 'ديب فريزر',
      icon: Zap,
      color: 'from-cyan-600 to-[#123b4a]',
      accentBg: 'bg-cyan-50 text-cyan-600',
      badge: 'للأجهزة الأفقية والرأسية',
      description: 'نفحص الديب فريزر ومكونات التبريد والكهرباء، ونشرح العطل والقطع المطلوبة قبل تنفيذ الإصلاح.',
      commonProblems: [
        'الجهاز لا يجمّد أو يفصل أثناء التشغيل',
        'اختلاف التجميد بين الأدراج أو أجزاء الجهاز',
        'فحص الموتور ودائرة التبريد عند ضعف الأداء',
        'فحص الكارتة والحساسات والمروحة حسب العطل'
      ],
      brands: ['Kiriazi', 'Beko', 'Toshiba', 'Alaska', 'Fresh', 'White Whale', 'Passap']
    },
    {
      id: 'washing-machines',
      title: 'صيانة غسالات أوتوماتيك وفوق أوتوماتيك',
      category: 'غسالات',
      icon: Disc,
      color: 'from-emerald-600 to-[#123b4a]',
      accentBg: 'bg-emerald-50 text-emerald-600',
      badge: 'فحص ميكانيكا وكهرباء',
      description: 'بنحدد سبب العطل في الغسالة، ونوضح لك القطع المطلوبة وتكلفتها قبل أي تغيير أو إصلاح.',
      commonProblems: [
        'اهتزاز أو صوت مرتفع أثناء العصر',
        'المياه لا تُصرف أو البرنامج يتوقف قبل نهايته',
        'تسريب مياه من أسفل الغسالة أو حول الباب',
        'فحص الطلمبة أو الرولمان بلي أو المساعدين حسب الحالة'
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
      badge: 'تجديد الهيكل حسب الحالة',
      description: 'نعالج الصدأ وتآكل الهيكل في الأجهزة القابلة للإصلاح، ونوضح نطاق الشغل والضمان قبل البدء.',
      commonProblems: [
        'تآكل الصاج السفلي وقواعد الغسالة أو الثلاجة بسبب الصدأ',
        'تحديد الأجزاء التي تحتاج إلى إصلاح أو تغيير',
        'تجديد الهيكل والدهان بما يناسب حالة الجهاز',
        'استعدال الأبواب وتغيير المفصلات وتثبيت القواعد بدقة'
      ],
      brands: ['تجديد شامل لجميع الماركات العالمية والمحلية']
    },
    {
      id: 'air-conditioners',
      title: 'صيانة وغسيل وشحن فريون تكييفات',
      category: 'تكييفات',
      icon: Wind,
      color: 'from-sky-600 to-[#123b4a]',
      accentBg: 'bg-sky-50 text-sky-600',
      badge: 'تنظيف وصيانة',
      description: 'نقدم تنظيفًا وفحصًا لأعطال التكييف، ونحدد الحاجة إلى إصلاح أو شحن بعد الكشف على الجهاز.',
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
      badge: 'فحص فني قبل الإصلاح',
      description: 'فحص أعطال الإشعال والشعلات والسخانات. ما نبدأش في إصلاح متعلق بالغاز قبل تقييم الحالة وإجراءات الأمان.',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-wider mb-3">
            خدمات الصيانة المنزلية
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123b4a] leading-tight">
            صيانة أجهزة منزلية في محافظة البحيرة
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
            بنوضح لك التشخيص والتكلفة والضمان قبل الإصلاح، وننسق الزيارة بعد التأكد من تغطية منطقتك.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="services-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                id={`service-card-${service.id}`}
                type="button"
                onClick={() => onOpenService?.(service.id)}
                className="service-card group relative rounded-2xl bg-slate-50 border border-slate-200/90 p-4 md:p-5 hover:bg-white hover:border-[#d97706]/40 hover:shadow-lg transition-all duration-200 text-right"
                aria-label={`فتح تفاصيل ${service.title}`}
              >
                <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${service.accentBg} shadow-sm transition-transform group-hover:scale-105 md:h-14 md:w-14`}>
                  <Icon className="h-6 w-6 md:h-7 md:w-7" />
                </span>
                <span className="mt-3 block text-center text-sm font-black leading-snug text-[#123b4a] group-hover:text-[#d97706] md:text-base">
                  {service.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#123b4a] via-[#174c5d] to-[#123b4a] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-right">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/20 text-[#d97706] text-xs font-black mb-2">
              للحجز أو الاستفسار
            </div>
            <h3 className="text-lg sm:text-2xl font-black">مش عارف تبدأ منين؟ احكيلنا إيه اللي حصل للجهاز.</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
              اتصل بينا أو ابعت طلب صيانة، وهنوضحلك الخطوة المناسبة وننسق موعدًا حسب منطقتك.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:+${PHONE_NUMBER_1}`}
              className="px-6 py-3.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>اتصل بنا الآن</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
