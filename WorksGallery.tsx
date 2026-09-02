import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  Upload, 
  X, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Camera,
  MessageSquare
} from 'lucide-react';
import { RepairWork, ApplianceCategory } from '../types';
import { CENTER_NAME, PHONE_NUMBER_1, DISPLAY_PHONE_1, PHONE_NUMBER_2, DISPLAY_PHONE_2 } from '../config';
import { processImageUpload } from '../lib/imageUtils';

interface WorksGalleryProps {
  works: RepairWork[];
  onAddWork: (work: Omit<RepairWork, 'id'>) => void;
  onDeleteWork: (id: string) => void;
  isAdmin: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// Fallback image if user URL or external link fails
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80';

export const WorksGallery: React.FC<WorksGalleryProps> = ({
  works,
  onAddWork,
  onDeleteWork,
  isAdmin,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ApplianceCategory>('الكل');
  const [activeModalWork, setActiveModalWork] = useState<RepairWork | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showBeforeTab, setShowBeforeTab] = useState(false);

  // Form states for Add Work modal
  const [formData, setFormData] = useState({
    title: '',
    category: 'غسالات' as 'غسالات' | 'ثلاجات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات',
    deviceType: '',
    brand: '',
    problem: '',
    solution: '',
    image: '',
    beforeImage: '',
    partsReplaced: '',
    warranty: 'ضمان معتمد من مركز قطب'
  });

  const [dragActive, setDragActive] = useState(false);

  // Categories list including 'ديب فريزر'
  const categories: ApplianceCategory[] = ['الكل', 'غسالات', 'ثلاجات', 'ديب فريزر', 'تكييفات', 'بوتاجازات'];

  // Filtered works
  const filteredWorks = selectedCategory === 'الكل'
    ? works
    : works.filter((w) => w.category === selectedCategory);

  // Handle Image Upload with processImageUpload
  const handleImageFile = async (file: File, field: 'image' | 'beforeImage') => {
    if (!file) return;
    try {
      const processed = await processImageUpload(file, 1000, 1000, 0.85);
      setFormData((prev) => ({ ...prev, [field]: processed.dataUrl }));
      onShowToast('تم تحسين وحفظ الصورة بنجاح', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'تعذر معالجة الصورة، يرجى اختيار ملف صالح', 'error');
    }
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], 'image');
    }
  };

  // Submit new work
  const handleSubmitNewWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      onShowToast('يرجى كتابة عنوان مختصر لعملية الصيانة', 'error');
      return;
    }
    if (!formData.problem.trim()) {
      onShowToast('يرجى كتابة وصف العطل الذي تم حله', 'error');
      return;
    }
    if (!formData.solution.trim()) {
      onShowToast('يرجى كتابة خطوات الحل وقطع الغيار', 'error');
      return;
    }

    // Default realistic image if user didn't upload
    const finalImage = formData.image || DEFAULT_FALLBACK_IMAGE;

    const partsArray = formData.partsReplaced
      ? formData.partsReplaced.split(',').map((p) => p.trim()).filter(Boolean)
      : ['قطع غيار أصلية معتمدة'];

    const newWorkObj = {
      title: formData.title.trim(),
      category: formData.category,
      deviceType: formData.deviceType.trim() || formData.category,
      brand: formData.brand.trim() || 'أصلي',
      problem: formData.problem.trim(),
      solution: formData.solution.trim(),
      date: new Date().toISOString().split('T')[0],
      image: finalImage,
      beforeImage: formData.beforeImage || undefined,
      partsReplaced: partsArray,
      warranty: formData.warranty || 'ضمان معتمد'
    };

    onAddWork(newWorkObj);
    setIsAddModalOpen(false);
    
    // Reset form
    setFormData({
      title: '',
      category: 'غسالات',
      deviceType: '',
      brand: '',
      problem: '',
      solution: '',
      image: '',
      beforeImage: '',
      partsReplaced: '',
      warranty: 'ضمان معتمد من مركز قطب'
    });
  };

  return (
    <section id="works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Action Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7a00]/10 text-[#ff7a00] text-xs font-black uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              أعمالنا الحقيقية على أرض الواقع
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0e3a5e] leading-tight">
              معرض عمليات صيانة {CENTER_NAME}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-semibold max-w-2xl leading-relaxed">
              شاهد صور حقيقية لعمليات صيانة الثلاجات، الديب فريزر، الغسالات، وعلاج البرومة لأهالي أبو المطامير
            </p>
          </div>

          {/* Add Work Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              id="add-work-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0e3a5e] hover:bg-[#123f66] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#ff7a00]" />
              <span>📷 إضافة وتنزيل صورة عمل صيانة جديد</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`tab-work-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0e3a5e] text-white shadow-md shadow-[#0e3a5e]/20 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} ({cat === 'الكل' ? works.length : works.filter((w) => w.category === cat).length})
            </button>
          ))}
        </div>

        {/* Works Grid */}
        {filteredWorks.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">لا توجد أعمال مضافة في هذا القسم حالياً</h3>
            <p className="text-xs text-slate-500 mt-1">يمكنك إضافة أول عمل من خلال زر "إضافة عمل صيانة جديد"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                id={`work-item-${work.id}`}
                className="group relative rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#ff7a00]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Work Image Banner */}
                <div 
                  className="relative aspect-[16/11] overflow-hidden cursor-pointer bg-slate-200"
                  onClick={() => {
                    setActiveModalWork(work);
                    setShowBeforeTab(false);
                  }}
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback image on error
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-black bg-[#0e3a5e]/90 text-white backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm">
                      {work.category}
                    </span>
                    {work.brand && (
                      <span className="text-[10px] font-bold bg-black/60 text-[#ff7a00] backdrop-blur-sm px-2 py-1 rounded-xl">
                        {work.brand}
                      </span>
                    )}
                  </div>

                  {/* Before badge if available */}
                  {work.beforeImage && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold bg-emerald-600/90 text-white backdrop-blur-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        قبل وبعد
                      </span>
                    </div>
                  )}

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 right-3 left-3 text-white text-right">
                    <span className="text-[11px] text-[#ff7a00] font-bold block mb-0.5">
                      {work.deviceType}
                    </span>
                    <h3 className="text-sm font-black leading-snug line-clamp-1 group-hover:text-[#ff7a00] transition-colors">
                      {work.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Problem */}
                    <div>
                      <span className="text-[11px] font-black text-rose-600 flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        العطل قبل الصيانة:
                      </span>
                      <p className="text-xs text-slate-700 font-semibold line-clamp-2 leading-relaxed">
                        {work.problem}
                      </p>
                    </div>

                    {/* Solution */}
                    <div>
                      <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1 mb-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        طريقة الإصلاح والحل:
                      </span>
                      <p className="text-xs text-slate-700 font-semibold line-clamp-2 leading-relaxed">
                        {work.solution}
                      </p>
                    </div>
                  </div>

                  {/* Footer of Card */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {work.date}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Delete button (Admin Mode) */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العمل؟')) {
                              onDeleteWork(work.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="حذف هذا العمل (وضع الإدارة)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalWork(work);
                          setShowBeforeTab(false);
                        }}
                        className="inline-flex items-center gap-1 text-[#ff7a00] hover:text-[#0e3a5e] font-black transition-colors"
                      >
                        <span>عرض التفاصيل</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LIGHTBOX MODAL (Details View) */}
        {activeModalWork && (
          <div 
            id="work-lightbox-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={() => setActiveModalWork(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setActiveModalWork(null)}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black bg-[#0e3a5e] text-white px-3 py-1 rounded-lg">
                  {activeModalWork.category}
                </span>
                {activeModalWork.brand && (
                  <span className="text-xs font-bold bg-[#ff7a00]/10 text-[#ff7a00] px-2.5 py-1 rounded-lg">
                    {activeModalWork.brand}
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 mr-auto">
                  {activeModalWork.date}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#0e3a5e] leading-snug">
                {activeModalWork.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
                نوع الجهاز: {activeModalWork.deviceType}
              </p>

              {/* Image with Before/After Toggle if Available */}
              <div className="mt-5 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative aspect-[16/9]">
                <img
                  src={showBeforeTab && activeModalWork.beforeImage ? activeModalWork.beforeImage : activeModalWork.image}
                  alt={activeModalWork.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                  }}
                />

                {/* Before/After Toggle Buttons */}
                {activeModalWork.beforeImage && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setShowBeforeTab(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        !showBeforeTab ? 'bg-[#ff7a00] text-white' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      بعد الصيانة والتجديد
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBeforeTab(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        showBeforeTab ? 'bg-rose-600 text-white' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      قبل الصيانة (العطل والبرومة)
                    </button>
                  </div>
                )}
              </div>

              {/* Details Sections */}
              <div className="mt-6 space-y-4 text-right">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <h4 className="text-xs font-black text-rose-700 flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    تشخيص العطل والمشكلة:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                    {activeModalWork.problem}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <h4 className="text-xs font-black text-emerald-700 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle className="w-4 h-4" />
                    خطوات الصيانة والحل المنفذ:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                    {activeModalWork.solution}
                  </p>
                </div>

                {/* Replaced Parts */}
                {activeModalWork.partsReplaced && activeModalWork.partsReplaced.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-600 mb-2 flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-[#0e3a5e]" />
                      قطع الغيار الأصلية المستخدمة:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalWork.partsReplaced.map((part, i) => (
                        <span key={i} className="text-xs font-bold bg-slate-100 text-[#0e3a5e] px-3 py-1 rounded-xl border border-slate-200">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct WhatsApp Call regarding this repair */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{activeModalWork.warranty || 'ضمان معتمد'}</span>
                  </div>

                  <a
                    href={`https://wa.me/${PHONE_NUMBER_1}?text=${encodeURIComponent(`مرحباً، أود صيانة جهاز مثل: ${activeModalWork.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-black hover:bg-[#20ba59] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>اطلب صيانة مماثلة</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ADD NEW WORK MODAL */}
        {isAddModalOpen && (
          <div 
            id="add-work-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-right mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#ff7a00] mb-1">
                  <PlusCircle className="w-4 h-4" />
                  معرض الأعمال
                </div>
                <h3 className="text-xl font-black text-[#0e3a5e]">إضافة عملية صيانة جديدة للمعرض</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  سيتم حفظ العمل في المتصفح وعرضه فوراً للعملاء
                </p>
              </div>

              <form onSubmit={handleSubmitNewWork} className="space-y-4 text-right">
                {/* Category & Device Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      القسم <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                    >
                      <option value="ديب فريزر">ديب فريزر (صندوق وأدراج)</option>
                      <option value="ثلاجات">ثلاجات نوفروست</option>
                      <option value="غسالات">غسالات أوتوماتيك</option>
                      <option value="تكييفات">تكييفات وتبريد</option>
                      <option value="بوتاجازات">بوتاجازات وسخانات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      الماركة والنوع
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: كريازي 6 درج / LG انفرتر"
                      value={formData.deviceType}
                      onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    عنوان العملية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شحن فريون وتغيير موتور دانفوس لديب فريزر كريازي"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                  />
                </div>

                {/* Problem */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    شرح العطل والمشكلة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="الديب فريزر فصل تبريد / الغسالة بتعصر بصوت عالي..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                  />
                </div>

                {/* Solution */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    طريقة الإصلاح والحل <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="تم علاج التسريب وشحن فريون وتغيير الفلتر..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                  />
                </div>

                {/* Parts Replaced */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    قطع الغيار المستبدلة (افصل بينها بفاصلة)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كمبروسر دانفوس 1/4، فلتر دراير، بلف شحن"
                    value={formData.partsReplaced}
                    onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#0e3a5e]"
                  />
                </div>

                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    صورة الجهاز بعد الصيانة (اسحب الصورة أو اختر من جهازك)
                  </label>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-[#ff7a00] bg-[#ff7a00]/5'
                        : 'border-slate-300 hover:border-[#0e3a5e] bg-slate-50'
                    }`}
                  >
                    {formData.image ? (
                      <div className="relative aspect-[16/8] rounded-xl overflow-hidden group">
                        <img
                          src={formData.image}
                          alt="معاينة الصورة"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            تغيير الصورة
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                        <Upload className="w-8 h-8 text-[#ff7a00] mb-2" />
                        <span className="text-xs font-bold text-slate-700">
                          اضغط هنا لاختيار صورة حقيقية للجهاز أو اسحبها إلى هنا
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-1">
                          يدعم صور الكاميرا والموبايل والكمبيوتر (JPG, PNG, WebP)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile(e.target.files[0], 'image');
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
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
                    className="px-6 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black shadow-md transition-all active:scale-95"
                  >
                    حفظ ونشر العمل فوراً
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
