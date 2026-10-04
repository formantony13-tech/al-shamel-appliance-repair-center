import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  Wrench,
  Download
} from 'lucide-react';
import { BookingRecord } from '../types';
import { 
  CENTER_NAME, 
  DISPLAY_PHONE_1, 
  DISPLAY_PHONE_2, 
  LOCATION_NAME 
} from '../config';

interface WarrantyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
}

export const WarrantyCertificateModal: React.FC<WarrantyCertificateModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const issueDate = booking.createdAt 
    ? new Date(booking.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  const warrantyEndDate = new Date();
  warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 1);
  const formattedWarrantyEnd = warrantyEndDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Actions Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#123b4a] hover:bg-[#174c5d] text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-md transition-all"
            >
              <Printer className="w-4 h-4 text-[#d97706]" />
              <span>طباعة شهادة الضمان / حفظ PDF</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE CERTIFICATE DOCUMENT */}
        <div ref={printRef} className="p-6 sm:p-8 border-4 border-double border-[#123b4a]/30 rounded-2xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10 relative overflow-hidden print:border-4 print:p-8">
          
          {/* Subtle Background Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <ShieldCheck className="w-96 h-96 text-[#123b4a]" />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#123b4a]/20 pb-5">
            <div className="text-center sm:text-right">
              <span className="text-[11px] font-black text-[#d97706] uppercase tracking-widest block mb-1">
                جمهورية مصر العربية - محافظة البحيرة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123b4a]">
                {CENTER_NAME}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-1">
                المركز الهندسي المعتمد لصيانة الأجهزة المنزلية بأبو المطامير
              </p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                خدمة وصيانة: ديب فريزر • غسالات • ثلاجات • تكييفات • بوتاجازات
              </p>
            </div>

            {/* Seal / Badge */}
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-[#123b4a]/5 rounded-2xl border-2 border-[#123b4a]/20 shrink-0">
              <Award className="w-10 h-10 text-[#d97706] mb-1" />
              <span className="text-xs font-black text-[#123b4a]">شهادة ضمان معتمدة</span>
              <span className="text-[10px] font-bold text-slate-500 font-mono mt-0.5">{booking.id}</span>
            </div>
          </div>

          {/* Title Ribbon */}
          <div className="my-6 text-center">
            <div className="inline-block px-6 py-2 rounded-xl bg-gradient-to-r from-[#123b4a] to-[#174c5d] text-white shadow-md">
              <h3 className="text-base sm:text-lg font-black tracking-wide">
                إيصال صيانة وشهادة ضمان قطع غيار أصلية
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-2">
              تعتبر هذه الشهادة وثيقة ضمان رسمي سارية من تاريخ إتمام أعمال الصيانة المنزلية
            </p>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold block mb-1">اسم العميل الكريم:</span>
              <span className="text-sm font-black text-slate-800">{booking.fullName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold block mb-1">رقم الهاتف المسجل:</span>
              <span className="text-sm font-black font-mono text-[#123b4a]">{booking.phoneNumber}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold block mb-1">نوع وماركة الجهاز:</span>
              <span className="text-sm font-black text-slate-800">
                {booking.deviceType} {booking.brand ? `(${booking.brand})` : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold block mb-1">عنوان ومقر الصيانة:</span>
              <span className="text-xs font-bold text-slate-700">{booking.address}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-400 font-bold block mb-1">تاريخ إتمام الصيانة:</span>
              <span className="text-xs font-bold text-slate-700">{issueDate}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
              <span className="text-emerald-700 font-bold block mb-1">فترة سريان الضمان حتى:</span>
              <span className="text-sm font-black text-emerald-800">{formattedWarrantyEnd} (ضمان شامل)</span>
            </div>
          </div>

          {/* Fault & Repair Details */}
          <div className="space-y-3 my-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-black text-[#123b4a] block mb-1">بيان العطل الذي تم إصلاحه:</span>
              <p className="text-slate-700 font-semibold leading-relaxed">
                {booking.issueDescription}
              </p>
            </div>

            {booking.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-black text-amber-900 block mb-1">تقرير وإرشادات المهندس المختص:</span>
                <p className="text-amber-950 font-semibold leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Warranty Terms & Conditions */}
          <div className="my-5 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 font-medium leading-relaxed">
            <span className="font-black text-slate-800 block text-xs mb-1">شروط وأحكام الضمان المعتمد:</span>
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>يشمل الضمان قطع الغيار الأصلية المستبدلة ضد أي عيوب تصنيع أو تشغيل طوال فترة الضمان.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>الزيارة والكشف مجاني بالكامل في حالة تكرار نفس العطل خلال فترة سريان وثيقة الضمان.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>يُرجى الاحتفاظ بكود الحجز أو رقم الهاتف للتواصل السريع مع المركز في أي وقت.</span>
            </div>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="pt-6 border-t-2 border-[#123b4a]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-right">
              <p className="font-black text-[#123b4a]">أرقام طوارئ الدعم الفني وخدمة العملاء:</p>
              <p className="font-mono font-bold text-slate-700">{DISPLAY_PHONE_1} — {DISPLAY_PHONE_2}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{LOCATION_NAME}</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-16 border-2 border-dashed border-[#123b4a]/40 rounded-xl flex items-center justify-center bg-white">
                <div className="text-center">
                  <span className="text-[10px] font-black text-[#123b4a] block">ختم واعتماد</span>
                  <span className="text-[11px] font-black text-[#d97706]">مركز قطب للصيانة</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">توقيع المهندس المسؤول</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
