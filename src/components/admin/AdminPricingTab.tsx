import React from 'react';
import { AlertCircle, DollarSign } from 'lucide-react';

export const AdminPricingTab: React.FC = () => {
  return (
    <section className="space-y-5" aria-labelledby="admin-pricing-heading">
      <header className="rounded-2xl bg-[#123b4a] p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#f4a62a]">
            <DollarSign className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="admin-pricing-heading" className="text-lg font-bold">إدارة الأسعار والضمان</h2>
            <p className="mt-1 text-sm text-slate-200">حالة الربط الحالية</p>
          </div>
        </div>
      </header>

      <div role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-right">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-amber-950">جدول الأسعار غير مرتبط بالحفظ أو بقاعدة البيانات</h3>
            <p className="mt-2 text-sm leading-7 text-amber-900">
              أُخفيت القيم القديمة لأنها كانت ثابتة داخل الشيفرة، وغير قابلة للتعديل من لوحة الإدارة، ولم يمكن التحقق من أنها الأسعار والضمانات المعمول بها حاليًا. لا تستخدمها لإعطاء سعر أو وعد للعميل.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm">
        <h3 className="font-bold text-slate-900">ما المطلوب لتفعيل هذا القسم؟</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          ربط قائمة الأسعار بقاعدة البيانات وإضافة شاشة إنشاء وتعديل وحذف، مع تحديد السعر والمدة والضمان لكل خدمة بعد اعتماد المركز لها. هذه الوظائف غير متاحة في النسخة الحالية، لذلك لا يظهر هنا جدول تجريبي على أنه بيانات حقيقية.
        </p>
      </div>
    </section>
  );
};
