import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ArrowRight,
  Phone,
  Flame,
  Sparkles,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { PHONE_NUMBER_1, DISPLAY_PHONE_1 } from '../config';

interface TroubleshootingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIssueForBooking: (device: string, issue: string) => void;
}

interface FaultItem {
  id: string;
  symptom: string;
  causes: string[];
  immediateAction: string;
  severity: 'high' | 'medium' | 'normal';
}

interface CategoryGuide {
  category: string;
  iconText: string;
  faults: FaultItem[];
}

const GUIDES: CategoryGuide[] = [
  {
    category: 'ديب فريزر (صندوق وأدراج)',
    iconText: '❄️',
    faults: [
      {
        id: 'df-1',
        symptom: 'الديب فريزر لا يجمد والأطعمة تذوب',
        causes: ['تسريب شحنة غاز الفريون', 'تلف مروحة التبريد الداخلية', 'عطل في الثرموستات أو حساس الحرارة'],
        immediateAction: 'افصل الكهرباء عن الجهاز وتجنب فتح الباب للمحافظة على البرودة المتبقية، واطلب الفحص الفوري.',
        severity: 'high'
      },
      {
        id: 'df-2',
        symptom: 'الموتور (الضاغط) يعمل باستمرار ولا يفصل مع سخونة شديدة',
        causes: ['تلف كاوتش الباب وتسريب الهواء الخارجي', 'سدد في الفلتر أو الكابيلري', 'عطل في مفتاح الثرموستات'],
        immediateAction: 'تأكد من إحكام غلق الباب ونظافة المكثف الخلفي، وتجنب وضع أطعمة ساخنة.',
        severity: 'medium'
      },
      {
        id: 'df-3',
        symptom: 'تراكم ثلج كثيف في أدراج النوفروست',
        causes: ['تلف السخان (الدفروست)', 'عطل في الفيوز الحراري أو التايمر', 'انسداد مجرى صرف المياه'],
        immediateAction: 'فصل الجهاز لمدة ساعتين لإذابة الثلج وطلب فحص دورة إذابة الثلج الإلكترونية.',
        severity: 'normal'
      },
      {
        id: 'df-4',
        symptom: 'صدأ وتآكل وبرومة في قاعدة أو باب الفريزر',
        causes: ['تساقط مياه الصرف على المعدن', 'الرطوبة الزائدة في الأرضية'],
        immediateAction: 'يتوفر لدينا قسم خاص بالسمكرة والدوكو والمعالجة الكيميائية ضد الصدأ والبرومة بأعلى جودة.',
        severity: 'medium'
      }
    ]
  },
  {
    category: 'غسالات أوتوماتيك وفوق أوتوماتيك',
    iconText: '🧺',
    faults: [
      {
        id: 'wm-1',
        symptom: 'صوت عالي جداً واهتزاز شديد أثناء مرحلة العصر (التجفيف)',
        causes: ['تلف رولمان البلي (Bearing)', 'كسر أو تآكل صليبة الحلة الداخلية', 'تلف المساعدين (امتصاص الصدمات)'],
        immediateAction: 'أوقف مرحلة العصر فوراً لعدم كسر الحلة الخارجية أو تمزيق الكاوتش واطلب الصيانة.',
        severity: 'high'
      },
      {
        id: 'wm-2',
        symptom: 'الغسالة لا تطرد المياه وتتوقف في نصف البرنامج',
        causes: ['انسداد فلتر الطرد (شوائب، عملات، خيوط)', 'تلف طلمبة (مضخة) الطرد', 'انسداد خرطوم الصرف'],
        immediateAction: 'قم بفتح الفلتر السفلي وتنظيفه بحذر، إذا استمرت المشكلة تكون الطلمبة بحاجة لتغيير أصلي.',
        severity: 'medium'
      },
      {
        id: 'wm-3',
        symptom: 'تآكل وبرومة في البودي الخارجي وقاعدة الغسالة',
        causes: ['تسريب بسيط من كاوتش الباب أو خراطيم المياه الداخلية'],
        immediateAction: 'نقدم خدمة تجديد شامل (سمكرة + دهان فرن دوكو مقاوم للصدأ) ترجع الغسالة زيرو.',
        severity: 'normal'
      }
    ]
  },
  {
    category: 'ثلاجات نوفروست وديفروست',
    iconText: '🧊',
    faults: [
      {
        id: 'rf-1',
        symptom: 'الفريزر يجمد بشكل طبيعي ولكن كابينة الثلاجة السفلية لا تبرد',
        causes: ['عطل في مروحة توزيع الهواء النوفروست', 'انسداد ممرات الهواء بالثلج', 'تلف بوابة الدامبر (Damper)'],
        immediateAction: 'عدم تكديس الأطعمة أمام فتحات التهوية، وفحص نظام التبريد بالمركز.',
        severity: 'medium'
      },
      {
        id: 'rf-2',
        symptom: 'تسريب مياه تحت أدراج الخضروات أو على الأرضية',
        causes: ['انسداد خرطوم صرف مياه إذابة الثلج', 'امتلاء أو انزلاق طبق التبخير فوق الموتور'],
        immediateAction: 'تسليك مجرى الصرف بماء دافئ، والتأكد من استواء وضع الثلاجة.',
        severity: 'normal'
      }
    ]
  },
  {
    category: 'تكييفات وبوتاجازات',
    iconText: '⚡',
    faults: [
      {
        id: 'ac-1',
        symptom: 'التكييف يخرج هواء عادي بدون برودة',
        causes: ['نقص شحنة الفريون بسبب تسريب', 'انسداد الفلاتر بالأتربة', 'تلف كابستور تشغيل الكباس'],
        immediateAction: 'تنظيف الفلاتر بالماء، والتواصل معنا لفحص ضغط الفريون وإصلاح التسريب.',
        severity: 'high'
      },
      {
        id: 'st-1',
        symptom: 'نار البوتاجاز ضعيفة أو تهب هباب أسود على الأواني',
        causes: ['انسداد الفونيات بالدهون', 'عدم ضبط ضغط منظم الغاز أو الهواء'],
        immediateAction: 'تنظيف عيون البوتاجاز بإبرة تسليك دقيقة وتجنب استخدام أدوات حادة تكسر الفونية.',
        severity: 'normal'
      }
    ]
  }
];

export const TroubleshootingGuideModal: React.FC<TroubleshootingGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectIssueForBooking,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [expandedFaultId, setExpandedFaultId] = useState<string | null>(GUIDES[0].faults[0].id);

  if (!isOpen) return null;

  const currentCategory = GUIDES[activeCategoryIndex];

  const handleBookThisFault = (fault: FaultItem) => {
    onSelectIssueForBooking(
      currentCategory.category,
      `عطل: ${fault.symptom} - الإجراء المطلوب: فحص وإصلاح`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#123b4a] to-[#174c5d] text-[#d97706] flex items-center justify-center shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#123b4a]">
              دليل تشخيص وفحص الأعطال السريع
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              تعرف على سبب عطل جهازك وإجراءات الأمان الفورية قبل طلب الزيارة المنزلية
            </p>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {GUIDES.map((guide, idx) => (
            <button
              key={guide.category}
              onClick={() => {
                setActiveCategoryIndex(idx);
                setExpandedFaultId(guide.faults[0]?.id || null);
              }}
              className={`p-3 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-1.5 border text-center ${
                activeCategoryIndex === idx
                  ? 'bg-[#123b4a] text-white border-[#123b4a] shadow-md shadow-[#123b4a]/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">{guide.iconText}</span>
              <span className="line-clamp-1">{guide.category.split(' ')[0]} {guide.category.split(' ')[1] || ''}</span>
            </button>
          ))}
        </div>

        {/* Faults Accordion List */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-black text-slate-400 block mb-2">
            الأعطال الشائعة في قسم: {currentCategory.category}
          </span>

          {currentCategory.faults.map((fault) => {
            const isExpanded = expandedFaultId === fault.id;

            return (
              <div
                key={fault.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-[#123b4a] bg-slate-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaultId(isExpanded ? null : fault.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-right"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      fault.severity === 'high' ? 'bg-red-500 animate-pulse' :
                      fault.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      {fault.symptom}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-[#123b4a]' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 space-y-3 animate-fadeIn text-xs">
                    <div>
                      <span className="font-black text-[#123b4a] block mb-1">الأسباب الهندسية المحتملة للعطل:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 font-semibold pr-1">
                        {fault.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80">
                      <div className="flex items-center gap-1.5 text-amber-800 font-black mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>نصيحة المهندس وإجراء السلامة الفوري:</span>
                      </div>
                      <p className="text-amber-950 font-semibold leading-relaxed">
                        {fault.immediateAction}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleBookThisFault(fault)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#123b4a] hover:bg-[#174c5d] text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>احجز فني صيانة لهذا العطل فوراً</span>
                      </button>

                      <a
                        href={`tel:+${PHONE_NUMBER_1}`}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#123b4a]" />
                        <span>استشارة هاتفية سريعة</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Call Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#123b4a] to-[#174c5d] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="text-center sm:text-right">
            <span className="font-black text-[#d97706] block text-sm">لديك حالة طوارئ خاصة أو عطل غير مذكور؟</span>
            <span className="text-slate-200 font-semibold">تواصل مباشرة مع المهندس المناوب بأبو المطامير على مدار الساعة</span>
          </div>
          <a
            href={`tel:+${PHONE_NUMBER_1}`}
            className="px-4 py-2 rounded-xl bg-[#d97706] hover:bg-[#e06c00] text-white font-black text-xs shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>اتصل الآن: {DISPLAY_PHONE_1}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
