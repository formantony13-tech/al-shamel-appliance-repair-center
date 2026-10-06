import React from 'react';
import { Award, Clock, ShieldCheck, Wrench } from 'lucide-react';
import { CENTER_NAME, YEARS_EXPERIENCE, normalizeYearsExperience } from '../config';
import { AppSystemSettings } from '../types';

interface WhyUsSectionProps {
  settings?: AppSystemSettings;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ settings }) => {
  const centerName = settings?.centerName || CENTER_NAME;
  const yearsExp = normalizeYearsExperience(settings?.yearsExperience || YEARS_EXPERIENCE);
  const points = [
    { icon: Award, title: `خبرة +${yearsExp} سنة`, text: 'تشخيص عملي وإصلاح واضح قبل التنفيذ', color: 'bg-amber-50 text-amber-600' },
    { icon: Clock, title: 'زيارة خلال 24 ساعة', text: 'تنسيق موعد مناسب في نطاق خدمتنا', color: 'bg-blue-50 text-[#123b4a]' },
    { icon: ShieldCheck, title: 'ضمان مكتوب', text: '3 أشهر على الإصلاح و6 أشهر على القطع حسب الحالة', color: 'bg-emerald-50 text-emerald-600' },
    { icon: Wrench, title: 'خدمة منزلية', text: 'إصلاح الجهاز في مكانك حسب الحالة', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <section id="why-us" className="bg-slate-50 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-black text-[#d97706]">لماذا {centerName}؟</span>
            <h2 className="mt-1 text-xl font-black text-[#123b4a] sm:text-2xl">ثقة واضحة قبل طلب الزيارة</h2>
          </div>
          <p className="max-w-md text-xs font-semibold leading-6 text-slate-500">نحافظ على وقتك ونوضح نوع الإصلاح والضمان قبل البدء.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
              <h3 className="text-sm font-black text-[#123b4a]">{title}</h3>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
