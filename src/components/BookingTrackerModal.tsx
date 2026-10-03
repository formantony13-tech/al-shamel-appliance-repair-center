import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  Award,
  MessageSquare, 
  ArrowRight,
  Lock,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BookingTrackingRecord, BookingStatus, BookingRecord } from '../types';
import { getBookingTracking } from '../lib/dbService';
import { PHONE_NUMBER_1, DISPLAY_PHONE_1 } from '../config';

interface BookingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onViewWarrantyCertificate?: (booking: BookingRecord) => void;
}

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  onViewWarrantyCertificate,
}) => {
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [phoneLast4Input, setPhoneLast4Input] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingRecord, setTrackingRecord] = useState<BookingTrackingRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = bookingIdInput.trim().toUpperCase();
    const cleanLast4 = phoneLast4Input.trim();

    if (!cleanId) {
      onShowToast('يرجى إدخال كود الحجز (مثال: BK-2026-12345)', 'error');
      return;
    }

    if (cleanLast4.length !== 4) {
      onShowToast('يرجى إدخال آخر 4 أرقام من رقم الهاتف للتحقق من الملكية', 'error');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setTrackingRecord(null);

    try {
      const result = await getBookingTracking(cleanId, cleanLast4 || undefined);
      if (result.success && result.data) {
        setTrackingRecord(result.data);
        onShowToast('تم التحقق واسترجاع حالة الطلب بنجاح', 'success');
      } else {
        onShowToast(result.error || 'لم يتم العثور على حجز بهذا الكود', 'error');
      }
    } catch (err) {
      console.error('Tracking query error:', err);
      onShowToast('حدث خطأ أثناء الاستعلام، يرجى المحاولة لاحقاً', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'NEW':
        return {
          label: 'طلب جديد — قيد المراجعة وجدولة الموعد',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          step: 1
        };
      case 'CONTACTED':
        return {
          label: 'تم التواصل مع العميل وتأكيد تفاصيل العطل',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          step: 2
        };
      case 'SCHEDULED':
        return {
          label: 'تم حجز الزيارة المنزلية للمهندس المختص',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          step: 2
        };
      case 'IN_PROGRESS':
        return {
          label: 'جاري فحص الجهاز وإتمام الصيانة',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          step: 3
        };
      case 'WAITING_FOR_PART':
        return {
          label: 'بانتظار وصول قطعة الغيار الأصلية',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          step: 3
        };
      case 'COMPLETED':
        return {
          label: 'تمت الصيانة بنجاح وتفعيل شهادة الضمان المعتمد',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          step: 4
        };
      case 'CANCELLED':
        return {
          label: 'تم إلغاء الطلب',
          color: 'bg-red-100 text-red-800 border-red-200',
          step: 0
        };
      default:
        return {
          label: 'قيد المتابعة الفنية',
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          step: 1
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-right max-h-[90vh] overflow-y-auto">
        
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0e3a5e] to-[#123f66] text-[#ff7a00] flex items-center justify-center shadow-md">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0e3a5e]">
              متابعة حالة طلب الصيانة
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              نظام استعلام آمن ومحمي لخصوصية بياناتك
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كود الحجز الموحد <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثال: BK-2026-10294"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-2xl border-2 border-slate-200 focus:border-[#0e3a5e] focus:outline-none text-sm font-bold text-slate-800 uppercase"
                required
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                آخر 4 أرقام من رقم الموبايل (مطلوبة للخصوصية) <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                placeholder="مثال: 7455"
                value={phoneLast4Input}
                onChange={(e) => setPhoneLast4Input(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 pl-10 rounded-2xl border-2 border-slate-200 focus:border-[#0e3a5e] focus:outline-none text-sm font-mono font-bold text-slate-800 text-left tracking-widest"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-[#0e3a5e] hover:bg-[#123f66] text-white text-sm font-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? (
              <span>جاري التحقق والاستعلام...</span>
            ) : (
              <>
                <span>استعلام لحظي عن الطلب</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Tracking Result Display */}
        {trackingRecord && (
          <div className="space-y-5 animate-fadeIn">
            {/* Status Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500">مرحلة الطلب الحالية:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(trackingRecord.status).color}`}>
                  {getStatusBadge(trackingRecord.status).label}
                </span>
              </div>

              {/* Progress Steps */}
              {trackingRecord.status !== 'CANCELLED' && (
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${trackingRecord.stage >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">تم الاستلام</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${trackingRecord.stage >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {trackingRecord.stage > 2 ? '✓' : '2'}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">الموعد المحدد</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${trackingRecord.stage >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {trackingRecord.stage > 3 ? '✓' : '3'}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">الفحص والإصلاح</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${trackingRecord.stage >= 4 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {trackingRecord.stage === 4 ? '✓' : '4'}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 mt-1">اكتمال والضمان</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking Card Details */}
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-400 font-bold">كود الحجز المعتمد:</span>
                <span className="text-sm font-black font-mono text-[#0e3a5e]">{trackingRecord.id}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-400 font-bold">نوع الجهاز والماركة:</span>
                <span className="text-sm font-bold text-slate-800">
                  {trackingRecord.deviceType} {trackingRecord.brand ? `(${trackingRecord.brand})` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs text-slate-400 font-bold">موعد الزيارة المفضل:</span>
                <span className="text-xs font-bold text-amber-700">{trackingRecord.preferredTime}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-bold">شهادة الضمان المعتمد:</span>
                <span className={`text-xs font-black ${trackingRecord.hasWarranty ? 'text-emerald-600 flex items-center gap-1' : 'text-slate-500'}`}>
                  {trackingRecord.hasWarranty ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                      <span>مفعلة وسارية</span>
                    </>
                  ) : (
                    'تُفعل بعد إتمام الصيانة واستلام الجهاز'
                  )}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://wa.me/${PHONE_NUMBER_1}?text=${encodeURIComponent(`مرحباً مركز قطب للحل السريع، أستفسر عن طلبي كود (${trackingRecord.id}) لجهاز (${trackingRecord.deviceType})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>متابعة فورية عبر واتساب</span>
                </a>
                <a
                  href={`tel:+${PHONE_NUMBER_1}`}
                  className="py-3 px-4 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#ff7a00]" />
                  <span>اتصال: {DISPLAY_PHONE_1}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !trackingRecord && !isLoading && (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">لم يتم العثور على أي حجز مطابق</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">يرجى التأكد من كتابة كود الحجز بشكل صحيح، أو التواصل المباشر معنا.</p>
            <div className="mt-4 flex justify-center gap-3">
              <a
                href={`tel:+${PHONE_NUMBER_1}`}
                className="px-4 py-2 rounded-xl bg-[#0e3a5e] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#ff7a00]" />
                اتصال: {DISPLAY_PHONE_1}
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
