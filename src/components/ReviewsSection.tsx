import React, { useState } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  X, 
  Image as ImageIcon, 
  Quote,
  Sparkles,
  ShieldCheck,
  ZoomIn,
  Camera,
  AlertCircle
} from 'lucide-react';
import { CustomerReview } from '../types';
import { processImageUpload } from '../lib/imageUtils';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'avatarLetter'>) => void;
  onDeleteReview: (id: string) => void;
  isAdmin: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
  onDeleteReview,
  isAdmin,
  onShowToast,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('ديب فريزر كريازي');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Calculate average rating
  const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : '5.0';
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  // Handle Photo upload for review
  const handleReviewPhoto = async (file: File) => {
    if (!file) return;
    try {
      const processed = await processImageUpload(file, 800, 800, 0.85);
      setReviewImage(processed.dataUrl);
      onShowToast('تم تحسين وإرفاق صورة الجهاز مع التقييم', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'تعذر معالجة الصورة، يرجى اختيار ملف صورة صالح', 'error');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      onShowToast('يرجى إدخال اسمك الكريم (حرفين على الأقل)', 'error');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      onShowToast('يرجى كتابة رأيك وتقييمك لتجربة الصيانة (5 أحرف على الأقل)', 'error');
      return;
    }

    const todayStr = new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date());

    onAddReview({
      name: name.trim(),
      deviceType,
      rating,
      comment: comment.trim(),
      date: `${todayStr} - أبو المطامير`,
      image: reviewImage || undefined
    });

    setIsAddModalOpen(false);
    setName('');
    setComment('');
    setReviewImage('');
    setRating(5);
    onShowToast('شكراً لمشاركتنا رأيك! تم استلام تقييمك وسيظهر بعد مراجعة المشرف.', 'success');
  };

  // Avatar color generator based on name
  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-blue-600',
      'bg-[#123b4a]',
      'bg-[#d97706]',
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-cyan-600'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Summary Block */}
        <div className="rounded-3xl bg-gradient-to-br from-[#123b4a] to-[#174c5d] text-white p-8 sm:p-10 shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Rating summary */}
            <div className="lg:col-span-8 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d97706] text-xs font-black mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                آراء وتقييمات العملاء الحقيقية
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                ماذا يقول أهالي أبو المطامير عن خدماتنا؟
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-semibold max-w-xl">
                تجارب وآراء عملاء المركز مع صور لأعمال صيانة منشورة حسب المتاح.
              </p>

              {/* Big Stars and Count */}
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">{avgRating}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-[#d97706]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#d97706]" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-300 font-bold mt-1">
                      تقييم عام ممتاز ({reviews.length} تقييم موثق)
                    </span>
                  </div>
                </div>

                <div className="h-10 w-px bg-white/20 hidden sm:block"></div>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4" />
                  <span>آراء عملاء المركز وتفاصيل الخدمة والضمان حسب الحالة</span>
                </div>
              </div>
            </div>

            {/* Add Review CTA in Banner */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                type="button"
                id="add-review-top-btn"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-sm shadow-lg shadow-[#d97706]/30 transition-all transform active:scale-95"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span>✍️ اكتب رأيك وأرفق صورة جهازك</span>
              </button>
            </div>

          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review) => {
            const avatarBg = getAvatarBg(review.name);
            return (
              <div
                key={review.id}
                id={`review-item-${review.id}`}
                className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                {/* Delete button for Admin Mode */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الرأي؟')) {
                        onDeleteReview(review.id);
                      }
                    }}
                    className="absolute top-4 left-4 p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="حذف الرأي (وضع الإدارة)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div>
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-11 h-11 rounded-2xl ${avatarBg} text-white font-black text-lg flex items-center justify-center shadow-sm`}>
                        {review.avatarLetter || review.name.charAt(0)}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-extrabold text-[#123b4a] leading-none">
                            {review.name}
                          </h4>
                          {review.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="عميل موثق" />
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-[#d97706] block mt-1">
                          صيانة: {review.deviceType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stars Rating */}
                  <div className="flex items-center gap-1 text-[#d97706] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-[#d97706]' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed relative">
                    <Quote className="w-6 h-6 text-slate-200 absolute -top-2 -right-2 -z-0 opacity-60" />
                    <span className="relative z-10">{review.comment}</span>
                  </p>

                  {/* Optional Repair Photo with Fallback */}
                  {review.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 relative group/img aspect-[16/9] bg-slate-100">
                      <img
                        src={review.image}
                        alt={`صورة جهاز ${review.name}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => setZoomImage(review.image || null)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer transition-opacity"
                        onClick={() => setZoomImage(review.image || null)}
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>تكبير صورة الجهاز</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Date */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>{review.date}</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    تمت الصيانة بنجاح
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {reviews.length > 6 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAllReviews((current) => !current)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-[#123b4a]/20 bg-white text-[#123b4a] hover:bg-[#123b4a] hover:text-white text-xs font-black transition-colors"
            >
              {showAllReviews ? 'عرض عدد أقل' : `عرض كل التقييمات (${reviews.length})`}
            </button>
          </div>
        )}

        {/* Bottom CTA button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#123b4a] border-2 border-slate-200 hover:border-[#d97706] font-black text-sm shadow-sm transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#d97706]" />
            <span>شاركنا تجربتك ورأيك مع صورة لجهازك</span>
          </button>
        </div>

        {/* ADD REVIEW MODAL */}
        {isAddModalOpen && (
          <div 
            id="add-review-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-right mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#d97706] mb-1">
                  <Star className="w-4 h-4 fill-[#d97706]" />
                  تقييم الخدمة
                </div>
                <h3 className="text-xl font-black text-[#123b4a]">أضف رأيك وتجربتك معنا</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  رأيك يهمنا ويساعد أهالي أبو المطامير في التعرف على جودة خدماتنا
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-right">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    الاسم بالكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمود"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#123b4a]"
                  />
                </div>

                {/* Device Repaired */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    نوع الجهاز الذي تمت صيانة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#123b4a]"
                  >
                    <option value="ديب فريزر صندوق أفقي">ديب فريزر صندوق أفقي</option>
                    <option value="ديب فريزر رأسي أدراج">ديب فريزر رأسي أدراج</option>
                    <option value="ثلاجة نوفروست">ثلاجة نوفروست</option>
                    <option value="غسالة أوتوماتيك">غسالة أوتوماتيك</option>
                    <option value="غسالة فوق أوتوماتيك">غسالة فوق أوتوماتيك</option>
                    <option value="سمكرة ودوكو برومة">سمكرة وعلاج برومة الغسالة/الثلاجة</option>
                    <option value="تكييف سبليت">تكييف سبليت</option>
                    <option value="بوتاجاز 5 شعلة">بوتاجاز أو سخان</option>
                  </select>
                </div>

                {/* Clickable 1-5 Star Rating */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    التقييم العام <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                          aria-label={`${star} نجوم`}
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'fill-[#d97706] text-[#d97706]'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-600 mr-2">
                      {rating === 5 && 'ممتاز جداً ⭐⭐⭐⭐⭐'}
                      {rating === 4 && 'جيد جداً ⭐⭐⭐⭐'}
                      {rating === 3 && 'جيد ⭐⭐⭐'}
                      {rating === 2 && 'مقبول ⭐⭐'}
                      {rating === 1 && 'ضعيف ⭐'}
                    </span>
                  </div>
                </div>

                {/* Comment Text */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    رأيك في الخدمة والتعامل وسرعة الإصلاح <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اكتب تفاصيل تجربتك مع الفني وسرعة الوصول ودقة الإصلاح وقطع الغيار..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#123b4a]"
                  />
                </div>

                {/* Optional Photo Upload */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    صورة الجهاز بعد الصيانة (اختياري)
                  </label>
                  
                  {reviewImage ? (
                    <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-slate-200">
                      <img src={reviewImage} alt="صورة التقييم" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage('')}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-600 text-white text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#123b4a] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Upload className="w-6 h-6 text-[#d97706] mb-1" />
                      <span className="text-xs font-bold text-slate-600">اختر صورة لجهازك من الهاتف أو الكمبيوتر</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleReviewPhoto(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-black shadow-md transition-all active:scale-95"
                  >
                    نشر التقييم فوراً
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* IMAGE ZOOM MODAL */}
        {zoomImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setZoomImage(null)}
          >
            <div className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-6 h-6" />
              </button>
              <img src={zoomImage} alt="تكبير الصورة" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
