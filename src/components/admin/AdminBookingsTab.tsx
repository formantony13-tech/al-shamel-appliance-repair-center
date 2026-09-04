import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  ExternalLink,
  Award,
  Image as ImageIcon,
  MessageSquare,
  Wrench,
  X,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../types';

interface AdminBookingsTabProps {
  bookings: BookingRecord[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onOpenCreateRepairJob: (booking: BookingRecord) => void;
  onViewWarrantyCertificate?: (booking: BookingRecord) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onOpenCreateRepairJob,
  onViewWarrantyCertificate,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phoneNumber.includes(searchQuery) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.deviceType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-800">طلب جديد 🆕</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-yellow-100 text-yellow-800">تم التواصل 📞</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-800">موعد محدد 📅</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-100 text-indigo-800">تم إسناد الفني 👷</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-orange-100 text-orange-800">قيد الصيانة ⚙️</span>;
      case 'WAITING_FOR_PART':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-100 text-amber-900">بانتظار قطع الغيار ⏳</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800">تمت الصيانة بنجاح ✅</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 text-red-800">ملغي ❌</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const handleWhatsAppCustomer = (booking: BookingRecord) => {
    const rawPhone = booking.phoneNumber.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('0') ? `2${rawPhone}` : rawPhone.startsWith('2') ? rawPhone : `20${rawPhone}`;
    const msg = `مرحباً بك أستاذ ${booking.fullName} معك مركز قطب للحل السريع لصيانة الأجهزة المنزلية بخصوص طلب الصيانة كود (${booking.id}) لجهاز (${booking.deviceType}). هل الموعد مناسب لتواجد الفني؟`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="بحث بالاسم، كود الحجز، الهاتف، أو الجهاز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#0e3a5e] outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
          >
            <option value="ALL">جميع الحالات ({bookings.length})</option>
            <option value="NEW">طلبات جديدة</option>
            <option value="CONTACTED">تم التواصل</option>
            <option value="SCHEDULED">موعد محدد</option>
            <option value="ASSIGNED">تم إسناد الفني</option>
            <option value="IN_PROGRESS">قيد الصيانة</option>
            <option value="WAITING_FOR_PART">بانتظار قطع الغيار</option>
            <option value="COMPLETED">تمت الصيانة</option>
            <option value="CANCELLED">ملغي</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0e3a5e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black text-[#0e3a5e] bg-[#0e3a5e]/5 px-2 py-1 rounded-md">
                  {b.id}
                </span>
                {getStatusBadge(b.status)}
              </div>

              <h4 className="text-sm font-black text-slate-900 mb-1">{b.fullName}</h4>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{b.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{b.address}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Wrench className="w-3.5 h-3.5 text-[#ff7a00] shrink-0" />
                  <span>{b.deviceType} {b.brand ? `(${b.brand})` : ''}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700 font-medium mb-3 line-clamp-2">
                <strong>العطل:</strong> {b.issueDescription}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => setSelectedBooking(b)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                التفاصيل 👁️
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleWhatsAppCustomer(b)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="مراسلة واتساب"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCreateRepairJob(b)}
                  className="p-1.5 rounded-lg text-[#0e3a5e] hover:bg-blue-50 transition-colors cursor-pointer"
                  title="تحويل لأمر صيانة فني"
                >
                  <Wrench className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteBooking(b.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="حذف الحجز"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
          لا توجد طلبات صيانة تطابق شروط البحث الحالية
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED BOOKING */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-right border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">كود الحجز:</span>
                <span className="font-mono text-sm font-black text-[#0e3a5e] mr-1">{selectedBooking.id}</span>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">اسم العميل:</span>
                <span className="font-black text-slate-900">{selectedBooking.fullName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">رقم الهاتف:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0e3a5e]">{selectedBooking.phoneNumber}</span>
                  <a 
                    href={`tel:${selectedBooking.phoneNumber}`}
                    className="p-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                    title="اتصال هاتفياً"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">العنوان بالتفصيل:</span>
                <span className="font-semibold text-slate-800">{selectedBooking.address}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">الجهاز / الموديل:</span>
                <span className="font-black text-slate-900">{selectedBooking.deviceType} {selectedBooking.brand ? `(${selectedBooking.brand})` : ''}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">الموعد المفضل:</span>
                <span className="font-semibold text-slate-700">{selectedBooking.preferredTime || 'في خلال 24 ساعة'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-700 block">وصف العطل المبلغ عنه:</span>
                <p className="text-slate-600 font-medium leading-relaxed">{selectedBooking.issueDescription}</p>
              </div>

              {selectedBooking.imageUrl && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 block">صورة الجهاز المرفقة:</span>
                  <img
                    src={selectedBooking.imageUrl}
                    alt="صورة العطل"
                    className="w-full h-44 object-cover rounded-xl border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Status Change Selector */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 mb-1">تحديث حالة الطلب مباشرة:</label>
                <select
                  value={selectedBooking.status}
                  onChange={async (e) => {
                    const newSt = e.target.value as BookingStatus;
                    await onUpdateStatus(selectedBooking.id, newSt);
                    setSelectedBooking(prev => prev ? { ...prev, status: newSt } : null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-xs text-slate-800 bg-white"
                >
                  <option value="NEW">طلب جديد (NEW)</option>
                  <option value="CONTACTED">تم التواصل هاتفياً (CONTACTED)</option>
                  <option value="SCHEDULED">موعد محدد للزيارة (SCHEDULED)</option>
                  <option value="ASSIGNED">تم إسناد الفني (ASSIGNED)</option>
                  <option value="IN_PROGRESS">قيد الصيانة الميدانية (IN_PROGRESS)</option>
                  <option value="WAITING_FOR_PART">بانتظار قطع الغيار (WAITING_FOR_PART)</option>
                  <option value="COMPLETED">تمت الصيانة بنجاح (COMPLETED)</option>
                  <option value="CANCELLED">ملغي (CANCELLED)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => handleWhatsAppCustomer(selectedBooking)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>مراسلة واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenCreateRepairJob(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  className="p-2.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Wrench className="w-4 h-4" />
                  <span>فتح أمر صيانة فني</span>
                </button>
              </div>

              {onViewWarrantyCertificate && selectedBooking.status === 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => {
                    onViewWarrantyCertificate(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow mt-2"
                >
                  <Award className="w-4 h-4" />
                  <span>طباعة شهادة الضمان المعتمدة 🖨️</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
