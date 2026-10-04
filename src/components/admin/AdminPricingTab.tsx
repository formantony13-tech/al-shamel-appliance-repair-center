import React from 'react';
import { DollarSign, Wrench, ShieldCheck, CheckCircle2, Clock, Sparkles, HelpCircle } from 'lucide-react';

interface PricingItem {
  category: string;
  serviceName: string;
  estimatedPrice: string;
  duration: string;
  warranty: string;
  notes: string;
}

const DEFAULT_PRICING_TABLE: PricingItem[] = [
  {
    category: 'غسالات أوتوماتيك وفوق أوتوماتيك',
    serviceName: 'تغيير طقم رولمان بلي + أولسيه أصلي ياباني NACHI',
    estimatedPrice: 'تبدأ من 450 ج.م + قطع الغيار',
    duration: '45 - 90 دقيقة منزلية',
    warranty: 'ضمان 6 أشهر معتمد',
    notes: 'معالجة الصوت المرتفع والخشونة أثناء العصر'
  },
  {
    category: 'غسالات أوتوماتيك وفوق أوتوماتيك',
    serviceName: 'تغيير طلمبة طرد المياه الإيطالية الأصلية',
    estimatedPrice: 'تبدأ من 350 ج.م شاملة المصنعية',
    duration: '30 دقيقة',
    warranty: 'ضمان 6 أشهر',
    notes: 'حل مشكلة عدم تصريف المياه أو رسائل الخطأ E02/OE'
  },
  {
    category: 'غسالات أوتوماتيك وفوق أوتوماتيك',
    serviceName: 'إصلاح وبرمجة كارتة التحكم الإلكترونية (Main Board)',
    estimatedPrice: 'تبدأ من 400 ج.م',
    duration: '24 ساعة',
    warranty: 'ضمان 3 أشهر',
    notes: 'إصلاح دوائر الباور وتغيير الترياكات والريليهات'
  },
  {
    category: 'ثلاجات وديب فريزر',
    serviceName: 'شحن فريون أصلي (R134a / R600a) مع تغيير الفلتر وعمل فاكيوم',
    estimatedPrice: 'تبدأ من 650 ج.م',
    duration: '60 - 90 دقيقة',
    warranty: 'ضمان 6 أشهر',
    notes: 'ضغط النيتروجين لكشف التنفيس والتأكد من إحكام الدائرة'
  },
  {
    category: 'ثلاجات وديب فريزر',
    serviceName: 'تغيير موتور / كمبروسر جديد أصلي (Danfoss / Cubigel / LG)',
    estimatedPrice: 'حسب القدرة وحجم الجهاز (عرض سعر فوري)',
    duration: 'زيارة فورية',
    warranty: 'ضمان 12 شهراً',
    notes: 'شامل بلف الخدمة والفلتر والشحن بالجرام'
  },
  {
    category: 'سمكرة ودوكو وعلاج بارومة',
    serviceName: 'علاج بارومة الشاسيه وتجديد الصاج ودهان دوكو فرن',
    estimatedPrice: 'تبدأ من 800 ج.م حسب حالة الجهاز',
    duration: '24 - 48 ساعة بورشة المركز',
    warranty: 'ضمان سنة ضد عودة الصدأ',
    notes: 'قص الأجزاء المصابة، تركيب صاج مجلفن، عزل مائي، ودهان فرن حراري'
  },
  {
    category: 'تكييفات وبوتاجازات',
    serviceName: 'صيانة دورية وغسيل تكييف بالكيماويات وفحص الفريون',
    estimatedPrice: 'تبدأ من 250 ج.م للجهاز',
    duration: '45 دقيقة',
    warranty: 'ضمان نظافة وكفاءة تبريد',
    notes: 'تنظيف الفلاتر والكويل والبلور الداخلي وتسليك حوض الصرف'
  }
];

export const AdminPricingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#123b4a] to-[#174c5d] text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d97706] font-black text-xs mb-1">
            <DollarSign className="w-4 h-4" />
            <span>الدليل الاسترشادي للأسعار المعتمدة</span>
          </div>
          <h3 className="text-lg font-black">جدول تكلفة ومصنعيات الصيانة وقطع الغيار</h3>
          <p className="text-xs text-slate-200 mt-1">
            أسعار موحدة وشفافة لجميع الفروع بمحافظات البحيرة، الغربية، والشرقية مع تقديم فاتورة وضمان كتابي معتمد.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>معاينة وكشف مجاني عند إتمام الصيانة</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_PRICING_TABLE.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#d97706]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                <span className="text-xs font-black text-[#123b4a] font-mono">
                  {item.estimatedPrice}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 mb-2 leading-snug">
                {item.serviceName}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span><strong>الوقت التقريبي:</strong> {item.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>فترة الضمان:</strong> {item.warranty}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  {item.notes}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-bold border-t border-slate-100 pt-2">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>قطع غيار أصلية 100%</span>
              </span>
              <span>مركز قطب</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
