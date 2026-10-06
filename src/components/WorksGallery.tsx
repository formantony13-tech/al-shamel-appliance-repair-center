import React, { useState } from 'react';
import { 
  ExternalLink, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  X, 
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Camera,
  MessageSquare
} from 'lucide-react';
import { RepairWork, ApplianceCategory } from '../types';
import { CENTER_NAME, PHONE_NUMBER_1 } from '../config';

interface WorksGalleryProps {
  works: RepairWork[];
  onAddWork?: (work: Omit<RepairWork, 'id'>) => void;
  onDeleteWork?: (id: string) => void;
  isAdmin?: boolean;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// Fallback image if user URL or external link fails
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=80';

export const WorksGallery: React.FC<WorksGalleryProps> = ({
  works,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ApplianceCategory>('الكل');
  const [activeModalWork, setActiveModalWork] = useState<RepairWork | null>(null);
  const [showBeforeTab, setShowBeforeTab] = useState(false);
  const [showAllWorks, setShowAllWorks] = useState(false);

  // Categories list including 'ديب فريزر'
  const categories: ApplianceCategory[] = ['الكل', 'غسالات', 'ثلاجات', 'ديب فريزر', 'تكييفات', 'بوتاجازات'];

  // Filtered works
  const filteredWorks = selectedCategory === 'الكل'
    ? works
    : works.filter((w) => w.category === selectedCategory);
  const visibleWorks = selectedCategory === 'الكل' && !showAllWorks
    ? filteredWorks.slice(0, 3)
    : filteredWorks;

  return (
    <section id="works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              أعمالنا الحقيقية على أرض الواقع
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#123b4a] leading-tight">
              معرض عمليات صيانة {CENTER_NAME}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-semibold max-w-2xl leading-relaxed">
              شاهد صور حقيقية لعمليات صيانة الثلاجات، الديب فريزر، الغسالات، وعلاج البرومة لأهالي أبو المطامير
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`tab-work-${cat}`}
              onClick={() => {
                setSelectedCategory(cat);
                setShowAllWorks(false);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#123b4a] text-white shadow-md shadow-[#123b4a]/20 scale-105'
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
            {visibleWorks.map((work) => (
              <div
                key={work.id}
                id={`work-item-${work.id}`}
                className="group relative rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#d97706]/40 transition-all duration-300 flex flex-col justify-between"
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
                    <span className="text-[11px] font-black bg-[#123b4a]/90 text-white backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm">
                      {work.category}
                    </span>
                    {work.brand && (
                      <span className="text-[10px] font-bold bg-black/60 text-[#d97706] backdrop-blur-sm px-2 py-1 rounded-xl">
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
                    <span className="text-[11px] text-[#d97706] font-bold block mb-0.5">
                      {work.deviceType}
                    </span>
                    <h3 className="text-sm font-black leading-snug line-clamp-1 group-hover:text-[#d97706] transition-colors">
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
                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalWork(work);
                          setShowBeforeTab(false);
                        }}
                        className="inline-flex items-center gap-1 text-[#d97706] hover:text-[#123b4a] font-black transition-colors"
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

        {selectedCategory === 'الكل' && filteredWorks.length > 3 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAllWorks((current) => !current)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-[#123b4a]/20 bg-[#123b4a]/5 text-[#123b4a] hover:bg-[#123b4a] hover:text-white text-xs font-black transition-colors"
            >
              {showAllWorks ? 'عرض عدد أقل' : `عرض كل الأعمال (${filteredWorks.length})`}
            </button>
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
                <span className="text-xs font-black bg-[#123b4a] text-white px-3 py-1 rounded-lg">
                  {activeModalWork.category}
                </span>
                {activeModalWork.brand && (
                  <span className="text-xs font-bold bg-[#d97706]/10 text-[#d97706] px-2.5 py-1 rounded-lg">
                    {activeModalWork.brand}
                  </span>
                )}
                <span className="text-xs font-bold text-slate-400 mr-auto">
                  {activeModalWork.date}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#123b4a] leading-snug">
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
                        !showBeforeTab ? 'bg-[#d97706] text-white' : 'text-white/80 hover:text-white'
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
                      <Wrench className="w-3.5 h-3.5 text-[#123b4a]" />
                      قطع الغيار الأصلية المستخدمة:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalWork.partsReplaced.map((part, i) => (
                        <span key={i} className="text-xs font-bold bg-slate-100 text-[#123b4a] px-3 py-1 rounded-xl border border-slate-200">
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

      </div>
    </section>
  );
};
