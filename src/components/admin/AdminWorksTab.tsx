import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Eye, 
  Layers
} from 'lucide-react';
import { RepairWork, ApplianceCategory } from '../../types';
import { 
  createRepairWork, 
  updateRepairWork, 
  deleteRepairWork 
} from '../../lib/dbService';
import { compressAndUploadImage } from '../../lib/imageUtils';

interface AdminWorksTabProps {
  works: RepairWork[];
  onWorksChange?: (updatedWorks: RepairWork[]) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminWorksTab: React.FC<AdminWorksTabProps> = ({
  works,
  onWorksChange,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<RepairWork | null>(null);
  const [previewWork, setPreviewWork] = useState<RepairWork | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'ثلاجات' as ApplianceCategory,
    deviceType: '',
    brand: '',
    problem: '',
    solution: '',
    partsReplacedText: '',
    image: '',
    beforeImage: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingBeforeImage, setUploadingBeforeImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddModal = () => {
    setEditingWork(null);
    setFormData({
      title: '',
      category: 'ثلاجات',
      deviceType: '',
      brand: '',
      problem: '',
      solution: '',
      partsReplacedText: '',
      image: '',
      beforeImage: '',
      date: new Date().toISOString().split('T')[0]
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (work: RepairWork) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      category: work.category,
      deviceType: work.deviceType || work.category,
      brand: work.brand || '',
      problem: work.problem,
      solution: work.solution,
      partsReplacedText: (work.partsReplaced || []).join('\n'),
      image: work.image,
      beforeImage: work.beforeImage || '',
      date: work.date || new Date().toISOString().split('T')[0]
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Upload main image to الرفع والضغط الآمن
  const handleMainImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMainImage(true);
      setFormError(null);
      const result = await compressAndUploadImage(file, 'works', `work_main_${Date.now()}`);
      setFormData(prev => ({ ...prev, image: result.url }));
      onShowToast('تم رفع وحفظ صورة العمل بنجاح على الرفع والضغط الآمن', 'success');
    } catch (err: any) {
      console.error('Work image upload error:', err);
      setFormError(err?.message || 'فشل رفع الصورة السحابية');
      onShowToast('فشل تجهيز الصورة', 'error');
    } finally {
      setUploadingMainImage(false);
    }
  };

  // Upload before image to الرفع والضغط الآمن
  const handleBeforeImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBeforeImage(true);
      setFormError(null);
      const result = await compressAndUploadImage(file, 'works', `work_before_${Date.now()}`);
      setFormData(prev => ({ ...prev, beforeImage: result.url }));
      onShowToast('تم رفع وحفظ صورة قبل الصيانة على الرفع والضغط الآمن', 'success');
    } catch (err: any) {
      console.error('Work before-image upload error:', err);
      setFormError(err?.message || 'فشل رفع صورة قبل الصيانة');
      onShowToast('فشل تجهيز الصورة', 'error');
    } finally {
      setUploadingBeforeImage(false);
    }
  };

  const handleSaveWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('يرجى إدخال عنوان أو وصف العمل');
      return;
    }
    if (!formData.problem.trim()) {
      setFormError('يرجى وصف المشكلة التي كان يعاني منها الجهاز');
      return;
    }
    if (!formData.solution.trim()) {
      setFormError('يرجى كتابة خطوات الحل والإصلاح الفني');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('يرجى رفع الصورة الأساسية للعمل أو إدخال رابط معتمد');
      return;
    }

    const parts = formData.partsReplacedText
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        deviceType: formData.deviceType.trim() || formData.category,
        brand: formData.brand.trim() || undefined,
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        partsReplaced: parts,
        image: formData.image.trim(),
        beforeImage: formData.beforeImage.trim() || undefined,
        date: formData.date
      };

      if (editingWork) {
        await updateRepairWork(editingWork.id, payload);
        const updated = works.map(w => w.id === editingWork.id ? { ...w, ...payload } : w);
        if (onWorksChange) onWorksChange(updated);
        onShowToast('تم تحديث بيانات العمل بنجاح في المعرض', 'success');
      } else {
        const created = await createRepairWork(payload);
        if (onWorksChange) onWorksChange([created, ...works]);
        onShowToast('تم إضافة وتوثيق العمل بنجاح في المعرض السحابي', 'success');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save work:', err);
      setFormError(err?.message || 'حدث خطأ أثناء حفظ العمل');
      onShowToast('فشل حفظ العمل في المعرض', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWork = async (workId: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف العمل "${title}" نهائياً من المعرض؟`)) {
      return;
    }

    try {
      await deleteRepairWork(workId);
      if (onWorksChange) onWorksChange(works.filter(w => w.id !== workId));
      onShowToast('تم حذف العمل من المعرض بنجاح', 'info');
    } catch (err) {
      console.error('Failed to delete work:', err);
      onShowToast('فشل حذف العمل', 'error');
    }
  };

  // Filtered works list
  const filteredWorks = works.filter(w => {
    const matchSearch = 
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.solution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || w.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0e3a5e]/10 text-[#0e3a5e]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                إدارة معرض الأعمال والإنجازات الحقيقية
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                توثيق صور الصيانة الواقعية وقطع الغيار ورفعها مباشرة على الرفع والضغط الآمن
              </p>
            </div>
          </div>

          <button
            id="admin-add-work-btn"
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#0e3a5e]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ff7a00]" />
            <span>إضافة عمل جديد للمعرض</span>
          </button>
        </div>

        {/* Real Photography & Cloud Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black block text-amber-900">توثيق الصور السحابي المباشر (الرفع والضغط الآمن):</span>
            <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
              جميع الصور المرفوعة تخزن سحابياً بروابط CDN دائمة ومضغوطة تلقائياً. الصور الواقعية لأعمال الصيانة (صور المحابس، الكباسات، الدوائر الكهربائية، وقطع الغيار) تزيد من ثقة العملاء وتثبت احترافية مركز قطب.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث في أعمال الصيانة بالعنوان أو وصف العطل أو طريقة الإصلاح..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">جميع الأقسام ({works.length})</option>
            <option value="ثلاجات">ثلاجات</option>
            <option value="غسالات">غسالات</option>
            <option value="ديب فريزر">ديب فريزر</option>
            <option value="بوتاجازات">بوتاجازات</option>
            <option value="تكييفات">تكييفات</option>
          </select>
        </div>
      </div>

      {/* Grid of works */}
      {filteredWorks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="text-sm font-black text-slate-800">لا توجد أعمال مطابقة لخيارات البحث</h4>
          <p className="text-xs text-slate-500">يمكنك إضافة عمل جديد أو تغيير كلمات وتصنيفات البحث</p>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-[#0e3a5e] text-white font-bold text-xs hover:bg-[#123f66] transition-colors"
          >
            إضافة عمل للمعرض الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map(work => (
            <div
              key={work.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
            >
              <div>
                {/* Image Section */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={work.image}
                    alt={work.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#0e3a5e]/90 text-white text-xs font-black backdrop-blur-md shadow-md">
                    {work.category}
                  </span>
                  {work.beforeImage && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-amber-500/90 text-white text-[10px] font-black backdrop-blur-md flex items-center gap-1 shadow-md">
                      <Layers className="w-3 h-3" />
                      <span>قبل / بعد</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                    {work.title}
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950 font-medium">
                      <strong className="block text-[11px] text-rose-800 font-bold mb-0.5">المشكلة والعطل:</strong>
                      <p className="line-clamp-2">{work.problem}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 font-medium">
                      <strong className="block text-[11px] text-emerald-800 font-bold mb-0.5">الحل وخطوات الصيانة:</strong>
                      <p className="line-clamp-2">{work.solution}</p>
                    </div>
                  </div>

                  {work.partsReplaced && work.partsReplaced.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">قطع الغيار المستبدلة:</span>
                      <div className="flex flex-wrap gap-1">
                        {work.partsReplaced.slice(0, 3).map((p, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50 mt-2">
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{work.date}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewWork(work)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                    title="معاينة التفاصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(work)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteWork(work.id, work.title)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black transition-colors cursor-pointer"
                    title="حذف من المعرض"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT WORK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 text-right animate-fade-in">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#0e3a5e]/10 text-[#0e3a5e]">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingWork ? 'تعديل عمل في المعرض' : 'إضافة وتوثيق عمل صيانة جديد'}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    يتم رفع الصور وتخزينها سحابياً عبر الرفع والضغط الآمن
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveWork} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block font-black text-slate-700 mb-1.5">
                    عنوان العمل والإنجاز <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: إصلاح ثلاجة شارب 16 قدم - استبدال كمبروسر وشحن فريون أصلي"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">القسم والتصنيف</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ApplianceCategory })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  >
                    <option value="ثلاجات">ثلاجات</option>
                    <option value="غسالات">غسالات</option>
                    <option value="ديب فريزر">ديب فريزر</option>
                    <option value="بوتاجازات">بوتاجازات</option>
                    <option value="تكييفات">تكييفات</option>
                  </select>
                </div>

                {/* Device Type / Model Details */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">نوع الجهاز والموديل</label>
                  <input
                    type="text"
                    placeholder="مثال: ثلاجة 18 قدم نوفروست"
                    value={formData.deviceType}
                    onChange={e => setFormData({ ...formData, deviceType: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">الماركة / الشركة المصنعة</label>
                  <input
                    type="text"
                    placeholder="مثال: توشيبا العربي / إل جي / كريازي"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">تاريخ الإنجاز</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Problem */}
                <div className="sm:col-span-2">
                  <label className="block font-black text-slate-700 mb-1.5">
                    المشكلة والعطل المشخص <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="ما المشكلة التي كان يعاني منها الجهاز؟ مثال: صوت عالي بالكمبروسر مع توقف كامل للتبريد في الكابينة"
                    value={formData.problem}
                    onChange={e => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Solution */}
                <div className="sm:col-span-2">
                  <label className="block font-black text-slate-700 mb-1.5">
                    خطوات الحل والإصلاح الفني <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="كيف تم حل المشكلة؟ مثال: تغيير الكمبروسر بآخر أصلي، تنظيف الدائرة بالنيتروجين، تغيير فلتر الدراير، والشحن بميزان رقمي"
                    value={formData.solution}
                    onChange={e => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Parts Replaced */}
                <div className="sm:col-span-2">
                  <label className="block font-black text-slate-700 mb-1.5">
                    قطع الغيار المستبدلة (سطر لكل قطعة)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="موتور دانفوس ألماني أصلي&#10;فلتر دراير نحاس إيطالي&#10;شحن فريون R134a"
                    value={formData.partsReplacedText}
                    onChange={e => setFormData({ ...formData, partsReplacedText: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* MAIN IMAGE UPLOAD (FIREBASE STORAGE) */}
                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#0e3a5e]" />
                      <span>الصورة الأساسية للعمل (الرفع والضغط الآمن) <span className="text-rose-500">*</span></span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-500">رفع وضغط تلقائي</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-300 p-2">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-[9px]">لا توجد صورة</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        ref={mainFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleMainImageFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        disabled={uploadingMainImage}
                        onClick={() => mainFileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {uploadingMainImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#0e3a5e] border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري رفع الصورة إلى الرفع والضغط الآمن...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#0e3a5e]" />
                            <span>اختر الصورة الأساسية للرفع السحابي</span>
                          </>
                        )}
                      </button>

                      <input
                        type="text"
                        placeholder="أو الصق رابط الصورة مباشرة..."
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* OPTIONAL BEFORE IMAGE */}
                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>صورة الجهاز قبل الصيانة (اختياري - لمقارنة قبل وبعد)</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {formData.beforeImage ? (
                        <img
                          src={formData.beforeImage}
                          alt="before preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-300 p-2">
                          <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-[9px]">اختياري</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        ref={beforeFileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleBeforeImageFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        disabled={uploadingBeforeImage}
                        onClick={() => beforeFileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {uploadingBeforeImage ? (
                          <span>جاري رفع صورة قبل الصيانة...</span>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber-600" />
                            <span>رفع صورة قبل الصيانة (الرفع والضغط الآمن)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingMainImage || uploadingBeforeImage}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs shadow-lg shadow-[#0e3a5e]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#ff7a00]" />
                  <span>{saving ? 'جاري الحفظ في Firestore...' : editingWork ? 'حفظ التعديلات' : 'نشر العمل في المعرض'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW WORK */}
      {previewWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 my-8 text-right">
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={previewWork.image}
                alt={previewWork.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewWork(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-bold text-[#0e3a5e] bg-[#0e3a5e]/10 px-2.5 py-1 rounded-lg">
                {previewWork.category} • {previewWork.date}
              </span>
              <h3 className="text-base font-black text-slate-900">{previewWork.title}</h3>
              <div className="space-y-2 text-xs">
                <p className="bg-rose-50 p-2.5 rounded-xl text-rose-950 font-medium">
                  <strong>المشكلة: </strong>{previewWork.problem}
                </p>
                <p className="bg-emerald-50 p-2.5 rounded-xl text-emerald-950 font-medium">
                  <strong>طريقة الإصلاح: </strong>{previewWork.solution}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setPreviewWork(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
