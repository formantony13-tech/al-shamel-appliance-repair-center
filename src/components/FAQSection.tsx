import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'رسوم الكشف كام؟',
    answer: 'لو وافقت على الإصلاح، الكشف مجاني. ولو قررت ما تكملش، بنقولك تكلفة الزيارة حسب منطقتك ونوع الجهاز قبل ما نحدد الموعد.'
  },
  {
    question: 'بتصلّحوا أي ماركات؟',
    answer: 'بنستقبل معظم الماركات المحلية والعالمية في الثلاجات والديب فريزر والغسالات والتكييفات والبوتاجازات. ابعتلنا اسم الماركة ووصف العطل، ونأكدلك إمكانية الخدمة.'
  },
  {
    question: 'هل القطعة والضمان بيتوضحوا قبل الإصلاح؟',
    answer: 'أيوه، بنوضح القطعة المطلوبة وتكلفتها قبل التركيب. وتفاصيل الضمان بتتكتب في إيصال الصيانة حسب نوع الإصلاح والقطعة.'
  },
  {
    question: 'إمتى بيتأكد موعد الزيارة؟',
    answer: 'بعد ما تبعت طلبك، بنتواصل معاك لتأكيد الموعد حسب منطقتك والمواعيد المتاحة. اختيارك لوقت مفضل في النموذج طلب للموعد، مش تأكيد نهائي لوحده.'
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
              قبل ما تحجز
            </span>
            <h2 className="mt-1 text-xl font-black text-[#123b4a] sm:text-2xl">إجابات على أسئلتكم</h2>
          </div>
          <p className="max-w-md text-xs font-semibold leading-5 text-slate-500">لو ما لقيتش إجابة سؤالك، اتصل بينا وهنوضحلك التفاصيل قبل الزيارة.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-right text-sm font-black text-[#123b4a]"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-[#d97706] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p id={answerId} className="border-t border-slate-200 px-4 pb-4 pt-3 text-xs font-semibold leading-6 text-slate-600">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
