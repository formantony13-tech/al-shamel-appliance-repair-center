import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  FileText, 
  Home, 
  BadgeDollarSign, 
  Headphones, 
  CheckCircle2, 
  Award,
  Sparkles,
  Clock,
  Wrench
} from 'lucide-react';
import { CENTER_NAME, YEARS_EXPERIENCE } from '../config';
import { AppSystemSettings } from '../types';

interface WhyUsSectionProps {
  settings?: AppSystemSettings;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ settings }) => {
  const centerName = settings?.centerName || CENTER_NAME;
  const yearsExp = settings?.yearsExperience || YEARS_EXPERIENCE;

  const points = [
    {
      icon: Award,
      title: `خبرة أكثر من ${yearsExp} سنة في الصيانة`,
      desc: `تاريخ عريق وخبرة متوارثة تمتد لأكثر من ${yearsExp} عاماً في تشخيص وإصلاح أصعب أعطال الثلاجات، الغسالات، والديب فريزر.`,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: Clock,
      title: 'مهندس عندك خلال 24 ساعة',
      desc: 'في خلال 24 ساعة بيكون عندك مهندس وفني متخصص بيصلح لك العطل في منزلك أينما كنت بمحافظات البحيرة، الغربية، والشرقية والمراكز المجاورة.',
      color: 'bg-blue-50 text-[#123b4a]'
    },
    {
      icon: ShieldCheck,
      title: 'قطع غيار أصلية 100%',
      desc: 'نوفر قطع غيار أصلية مستوردة بالكامل (مواتير دانفوس، رولمان بلي ياباني، كارتات ديجيتال أصلية) مع الضمان.',
      color: 'bg-orange-50 text-[#d97706]'
    },
    {
      icon: FileText,
      title: 'ضمان معتمد على الصيانة',
      desc: 'صيانة مضمونة تصنع الفرق! نسلمك شهادة ضمان معتمدة على كافة قطع الغيار المستبدلة والخدمة المقدمة.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Wrench,
      title: 'علاج البرومة والسمكرة والدوكو',
      desc: 'قسم خاص لسمكرة وتجديد صاج الأجهزة ومعالجة الصدأ والبرومة وعزلها بدهان دوكو فرن مطابق للمصنع.',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      icon: Headphones,
      title: 'خدمة واتساب وهاتف 24 ساعة',
      desc: 'متاحون على مدار الساعة لاستقبال اتصالاتكم ورسائلكم وتقديم الاستشارات الفنية وحجز المواعيد الفورية.',
      color: 'bg-cyan-50 text-cyan-600'
    }
  ];

  return (
    <section id="why-us" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#123b4a]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#123b4a]/10 text-[#123b4a] text-xs font-black uppercase tracking-wider mb-3">
            لماذا {centerName}؟
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123b4a] leading-tight">
            صيانة مضمونة تصنع الفرق بفروعنا في البحيرة، الغربية، والشرقية
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
            مهندسون محترفون على أعلى جودة وأمانة تامة لحل أصعب الأعطال في مكانك
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[#d97706]/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${point.color} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-[#123b4a] leading-snug">
                  {point.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Center Guarantee Card */}
        <div className="mt-14 rounded-3xl bg-white border-2 border-[#123b4a]/10 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-right">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#123b4a] to-[#174c5d] flex items-center justify-center text-white shrink-0 shadow-md">
                <Award className="w-9 h-9 text-[#d97706]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#d97706] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  شعارنا وعهدنا معكم
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#123b4a]">
                  {CENTER_NAME} - ثقة وخبرة أكثر من {YEARS_EXPERIENCE} سنة
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-2xl leading-relaxed">
                  "مهما كانت المشكلة في الثلاجة، الغسالة، أو الديب فريزر صعبة.. إحنا بنحلها لك بأعلى جودة وبأقل تكلفة، مع تعهدنا بقطع الغيار الأصلية وضمان الصيانة."
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-2xl text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                فروعنا: البحيرة • الغربية • الشرقية
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
