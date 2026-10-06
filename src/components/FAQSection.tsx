import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'هل الكشف مجاني؟',
    answer: 'الكشف يكون مجانياً عند تنفيذ الصيانة، أما في حالة عدم تنفيذ الإصلاح فتُحدد التكلفة قبل بدء الزيارة حسب المنطقة ونوع الجهاز.'
  },
  {
    question: 'ما الماركات التي تقومون بصيانتها؟',
    answer: 'نخدم معظم الماركات العالمية والمحلية في الثلاجات والديب فريزر والغسالات والتكييفات والبوتاجازات والسخانات، ويتم تأكيد إمكانية الإصلاح بعد وصف العطل.'
  },
  {
    question: 'هل توفرون قطع غيار أصلية؟',
    answer: 'نعم، يتم توضيح نوع القطعة وتكلفتها قبل التركيب، وتُذكر تفاصيل الضمان في إيصال الصيانة حسب نوع الإصلاح والقطعة المستبدلة.'
  },
  {
    question: 'كيف يتم الدفع؟',
    answer: 'يتم الاتفاق على التكلفة وطريقة الدفع قبل تنفيذ الإصلاح، ويمكن تأكيد التفاصيل مع المهندس عند تنسيق موعد الزيارة.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 text-right sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#d97706]">
              <HelpCircle className="h-4 w-4" />
              أسئلة قبل الحجز
            </span>
            <h2 className="mt-1 text-xl font-black text-[#123b4a] sm:text-2xl">إجابات واضحة قبل زيارة الفني</h2>
          </div>
          <p className="max-w-md text-xs font-semibold leading-5 text-slate-500">نوضح نطاق الخدمة والتكلفة والضمان قبل بدء الإصلاح.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-right text-sm font-black text-[#123b4a]"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-[#d97706] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="border-t border-slate-200 px-4 pb-4 pt-3 text-xs font-semibold leading-6 text-slate-600">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
