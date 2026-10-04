import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Filter, Search, ShieldCheck } from 'lucide-react';
import { CustomerReview } from '../../types';

interface AdminReviewsTabProps {
  reviews: CustomerReview[];
  onApproveReview: (reviewId: string) => Promise<void>;
  onRejectReview: (reviewId: string) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  onApproveReview,
  onRejectReview,
  onDeleteReview,
  onShowToast
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredReviews = reviews.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.comment.toLowerCase().includes(search.toLowerCase()) ||
                          r.deviceType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="بحث في آراء العملاء..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#123b4a] outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'ALL' ? 'bg-white shadow text-[#123b4a]' : 'text-slate-600'}`}
            >
              الكل ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'PENDING' ? 'bg-amber-500 text-white shadow' : 'text-slate-600'}`}
            >
              بانتظار الاعتماد ({reviews.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'APPROVED' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
            >
              المعتمدة ({reviews.filter(r => r.status === 'APPROVED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#123b4a] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#123b4a] text-white flex items-center justify-center font-black text-xs">
                    {r.avatarLetter || r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{r.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{r.date}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  r.status === 'PENDING' ? 'bg-amber-100 text-amber-900 animate-pulse' :
                  'bg-red-100 text-red-800'
                }`}>
                  {r.status === 'APPROVED' ? 'معتمد ومنشور ✅' : r.status === 'PENDING' ? 'بانتظار الموافقة ⏳' : 'مرفوض ❌'}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < r.rating ? 'text-[#d97706] fill-[#d97706]' : 'text-slate-200'}`}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-500 mr-1.5">({r.deviceType})</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl mb-3">
                "{r.comment}"
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {r.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => onApproveReview(r.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>اعتماد ونشر</span>
                  </button>
                )}

                {r.status !== 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => onRejectReview(r.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>إخفاء</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDeleteReview(r.id)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                title="حذف نهائي"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
          لا توجد تقييمات تطابق التصفية الحالية
        </div>
      )}
    </div>
  );
};
