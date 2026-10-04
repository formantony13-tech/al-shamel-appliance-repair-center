import React from 'react';
import {
  TrendingUp,
  Calendar,
  Wrench,
  Users,
  Star,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  AlertCircle,
  Sparkles,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { BookingRecord, Customer, RepairJob, CustomerReview, RepairWork } from '../../types';

interface AdminOverviewTabProps {
  bookings: BookingRecord[];
  customers: Customer[];
  repairJobs: RepairJob[];
  reviews: CustomerReview[];
  works: RepairWork[];
  onNavigateTab: (tab: 'overview' | 'bookings' | 'repairs' | 'customers' | 'reviews' | 'works' | 'pricing' | 'customization' | 'admins' | 'backup') => void;
  onSelectBooking: (booking: BookingRecord) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  bookings,
  customers,
  repairJobs,
  reviews,
  works,
  onNavigateTab,
  onSelectBooking
}) => {
  const totalBookings = bookings.length;
  const newBookings = bookings.filter(b => b.status === 'NEW');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');
  const inProgressJobs = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'ASSIGNED');
  const pendingReviews = reviews.filter(r => r.status === 'PENDING');
  const totalRevenue = repairJobs.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  // Geographic Distribution
  const branchStats = {
    beheira: bookings.filter(b => b.address.includes('بحيرة') || b.address.includes('مطامير') || b.address.includes('دمنهور') || b.address.includes('دوار')).length,
    gharbia: bookings.filter(b => b.address.includes('غربية') || b.address.includes('طنطا') || b.address.includes('محلة') || b.address.includes('زيات') || b.address.includes('زفتى')).length,
    sharqia: bookings.filter(b => b.address.includes('شرقية') || b.address.includes('زقازيق') || b.address.includes('عاشر') || b.address.includes('بلبيس') || b.address.includes('فاقوس')).length,
  };
  const otherAreaCount = Math.max(0, totalBookings - (branchStats.beheira + branchStats.gharbia + branchStats.sharqia));

  // Device Breakdown
  const deviceCounts: Record<string, number> = {};
  bookings.forEach(b => {
    const key = b.deviceType || 'أخرى';
    deviceCounts[key] = (deviceCounts[key] || 0) + 1;
  });
  const topDevices = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Alert Banner */}
      {newBookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>لديك <strong className="font-black text-amber-950 underline">{newBookings.length} طلب صيانة جديد</strong> بانتظار التواصل وتحديد الموعد!</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('bookings')}
            className="px-3.5 py-1.5 bg-[#123b4a] text-white rounded-xl font-black text-xs hover:bg-[#174c5d] transition-colors cursor-pointer shrink-0"
          >
            عرض الطلبات الجديدة 📋
          </button>
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#d97706]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-500">إجمالي الحجوزات</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalBookings}</span>
            <span className="text-[11px] font-bold text-slate-400">طلب مسجل</span>
          </div>
          <div className="mt-2 text-[10px] text-blue-700 font-bold flex items-center gap-1">
            <span>{newBookings.length} جديد</span> • <span>{inProgressJobs.length} جاري العمل</span>
          </div>
        </div>

        {/* Completed Repairs */}
        <div
          onClick={() => onNavigateTab('repairs')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-500">تمت الصيانة بنجاح</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{completedJobs.length}</span>
            <span className="text-[11px] font-bold text-slate-400">جهاز تم إصلاحه</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 font-bold">
            نسبة الإنجاز: {totalBookings > 0 ? Math.round((completedJobs.length / totalBookings) * 100) : 100}%
          </div>
        </div>

        {/* Total Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-500">سجل العملاء المعتمد</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{customers.length}</span>
            <span className="text-[11px] font-bold text-slate-400">عميل نشط</span>
          </div>
          <div className="mt-2 text-[10px] text-indigo-700 font-bold">
            دليل العملاء وأرقام الهواتف
          </div>
        </div>

        {/* Portfolio & Reviews */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-slate-500">التقييمات والأعمال</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{reviews.length}</span>
            <span className="text-[11px] font-bold text-slate-400">تقييم معتمد</span>
          </div>
          <div className="mt-2 text-[10px] text-amber-700 font-bold flex items-center gap-1">
            <span>{works.length} عمل بالمعرض</span>
            {pendingReviews.length > 0 && <span className="text-red-600 font-black">({pendingReviews.length} بانتظار الاعتماد)</span>}
          </div>
        </div>
      </div>

      {/* Middle Grid: Geographic Distribution & Top Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Branches & Areas Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d97706]" />
              <span>التوزيع الجغرافي للطلبات</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">الفروع الثلاثة</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>محافظة البحيرة (دمنهور، أبو المطامير...)</span>
                <span className="font-mono text-[#123b4a]">{branchStats.beheira} طلب</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#123b4a] rounded-full"
                  style={{ width: `${totalBookings > 0 ? (branchStats.beheira / totalBookings) * 100 : 33}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>محافظة الغربية (طنطا، المحلة، كفر الزيات...)</span>
                <span className="font-mono text-[#d97706]">{branchStats.gharbia} طلب</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#d97706] rounded-full"
                  style={{ width: `${totalBookings > 0 ? (branchStats.gharbia / totalBookings) * 100 : 33}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>محافظة الشرقية (الزقازيق، العاشر، بلبيس...)</span>
                <span className="font-mono text-emerald-600">{branchStats.sharqia} طلب</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${totalBookings > 0 ? (branchStats.sharqia / totalBookings) * 100 : 33}%` }}
                />
              </div>
            </div>

            {otherAreaCount > 0 && (
              <div>
                <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>مراكز وقرى ومناطق أخرى</span>
                  <span className="font-mono text-slate-500">{otherAreaCount} طلب</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${totalBookings > 0 ? (otherAreaCount / totalBookings) * 100 : 10}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Most Repaired Appliances */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#123b4a]" />
              <span>الأجهزة الأكثر طلباً للصيانة</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">إحصائية دقيقة</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {topDevices.length > 0 ? (
              topDevices.map(([device, count], idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{device}</span>
                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800">
                    {count} حجز
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                لا توجد طلبات مسجلة بعد
              </div>
            )}
          </div>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="bg-gradient-to-br from-[#123b4a] to-[#174c5d] text-white p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-black flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>إجراءات التشغيل السريعة</span>
          </h3>

          <div className="space-y-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigateTab('bookings')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-right flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>مراجعة الطلبات والحجوزات الفورية</span>
              <span>←</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('works')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-right flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>إضافة جهاز جديد لمعرض الإنجازات</span>
              <span>←</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('customization')}
              className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-right flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>تعديل أرقام الهواتف وبيانات الفروع</span>
              <span>←</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('pricing')}
              className="w-full p-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-black text-right flex items-center justify-between transition-colors cursor-pointer shadow"
            >
              <span>جدول أسعار الصيانة الاسترشادية</span>
              <span>←</span>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Bookings Table Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d97706]" />
            <span>آخر الحجوزات الواردة</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-black text-[#123b4a] hover:underline"
          >
            عرض الكل ({bookings.length}) ←
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-2">كود الحجز</th>
                  <th className="pb-2">العميل</th>
                  <th className="pb-2">الجهاز</th>
                  <th className="pb-2">العنوان / المحافظة</th>
                  <th className="pb-2">الحالة</th>
                  <th className="pb-2">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => onSelectBooking(booking)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-mono font-bold text-[#123b4a]">{booking.id}</td>
                    <td className="py-2.5 font-bold text-slate-900">{booking.fullName}</td>
                    <td className="py-2.5 text-slate-700">{booking.deviceType}</td>
                    <td className="py-2.5 text-slate-500 max-w-[150px] truncate">{booking.address}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        booking.status === 'NEW'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('ar-EG') : 'الآن'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs font-semibold">
            لا توجد حجوزات مسجلة بعد
          </div>
        )}
      </div>
    </div>
  );
};
