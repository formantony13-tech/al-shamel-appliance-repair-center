import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Filter, 
  ShieldCheck, 
  Tag, 
  DollarSign, 
  Package, 
  Eye, 
  Clock, 
  Upload, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  ArrowUpDown, 
  RefreshCw, 
  Layers, 
  Star, 
  LayoutGrid, 
  List, 
  Check, 
  Truck, 
  MapPin, 
  Percent,
  ChevronRight,
  Share2
} from 'lucide-react';
import { ApplianceForSale, ForSaleCategory, ForSaleStatus } from '../../types';
import { 
  fetchAllForSaleItems, 
  createForSaleItem, 
  updateForSaleItem, 
  deleteForSaleItem 
} from '../../lib/dbService';
import { compressAndUploadImage } from '../../lib/imageUtils';
import { PHONE_NUMBER_1, DISPLAY_PHONE_1 } from '../../config';

interface ForSaleManagerProps {
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
  onItemsChange?: (items: ApplianceForSale[]) => void;
}

export const ForSaleManager: React.FC<ForSaleManagerProps> = ({
  onShowToast,
  onItemsChange
}) => {
  const [items, setItems] = useState<ApplianceForSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('الكل');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'discount_desc'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApplianceForSale | null>(null);
  const [previewItem, setPreviewItem] = useState<ApplianceForSale | null>(null);
  const [previewActiveImgIdx, setPreviewActiveImgIdx] = useState(0);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ApplianceForSale | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'ثلاجات' as 'ثلاجات' | 'غسالات' | 'ديب فريزر' | 'تكييفات' | 'بوتاجازات' | 'أخرى',
    brand: '',
    model: '',
    price: '',
    originalPrice: '',
    status: 'AVAILABLE' as ForSaleStatus,
    condition: 'مجددة بحالة الزيرو (Refurbished)',
    specsText: '',
    warranty: 'ضمان 6 شهور شامل ومعتمد من مركز قطب',
    image: '',
    additionalImages: [] as string[],
    description: '',
    location: 'فرع أبو المطامير / متاح التوصيل والمعاينة المنزلية بالبحيرة والإسكندرية',
    featured: false
  });

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllForSaleItems();
      setItems(data);
      if (onItemsChange) onItemsChange(data);
    } catch (err) {
      console.error('Failed to load for-sale items:', err);
      notify('فشل تحميل بيانات الأجهزة المعروضة للبيع', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'ثلاجات',
      brand: '',
      model: '',
      price: '',
      originalPrice: '',
      status: 'AVAILABLE',
      condition: 'مجددة بحالة الزيرو (Refurbished)',
      specsText: 'سعة ممتازة وموفرة لاستهلاك الكهرباء\nشحن فريون أصلي وفحص تبريد وتجميد 48 ساعة\nموتور بحالة الفابريكا مع ضمان مركز قطب\nصاج ودهان أصلي خالي من الصدمات والبارومة',
      warranty: 'ضمان 6 شهور شامل ومعتمد من مركز قطب',
      image: '',
      additionalImages: [],
      description: '',
      location: 'فرع أبو المطامير / متاح التوصيل والمعاينة المنزلية بالبحيرة والإسكندرية',
      featured: false
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ApplianceForSale) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      brand: item.brand,
      model: item.model || '',
      price: item.price.toString(),
      originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
      status: item.status,
      condition: item.condition || 'مجددة بحالة الزيرو',
      specsText: (item.specs || []).join('\n'),
      warranty: item.warranty || 'ضمان 6 شهور شامل ومعتمد',
      image: item.image,
      additionalImages: item.additionalImages || [],
      description: item.description || '',
      location: item.location || 'فرع أبو المطامير / متاح التوصيل للمنازل بالبحيرة والإسكندرية',
      featured: Boolean(item.featured)
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  // Duplicate / Clone existing item for quick creation
  const handleDuplicateItem = (item: ApplianceForSale) => {
    setEditingItem(null);
    setFormData({
      title: `${item.title} (نسخة جديدة)`,
      category: item.category,
      brand: item.brand,
      model: item.model || '',
      price: item.price.toString(),
      originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
      status: 'AVAILABLE',
      condition: item.condition,
      specsText: (item.specs || []).join('\n'),
      warranty: item.warranty,
      image: item.image,
      additionalImages: item.additionalImages || [],
      description: item.description,
      location: item.location || '',
      featured: false
    });
    setErrorMsg(null);
    setIsModalOpen(true);
    notify('تم استنساخ بيانات الجهاز، يمكنك تعديلها وحفظها كجهاز جديد', 'info');
  };

  // Main Image Upload with الرفع والضغط الآمن & Compression
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMainImage(true);
      setErrorMsg(null);
      const result = await compressAndUploadImage(file, 'for_sale', `item_main_${Date.now()}`);
      setFormData(prev => ({ ...prev, image: result.url }));
      notify('تم رفع الصورة الأساسية وتخزينها سحابياً بنجاح', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMsg(err?.message || 'فشل رفع الصورة الأساسية إلى الرفع والضغط الآمن');
      notify('فشل رفع الصورة الأساسية', 'error');
    } finally {
      setUploadingMainImage(false);
    }
  };

  // Gallery Additional Image Upload
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryImage(true);
      setErrorMsg(null);
      const result = await compressAndUploadImage(file, 'for_sale', `item_gallery_${Date.now()}`);
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, result.url]
      }));
      notify('تمت إضافة الصورة الإضافية إلى المعرض السحابي', 'success');
    } catch (err: any) {
      console.error('Gallery image upload failed:', err);
      setErrorMsg(err?.message || 'فشل رفع الصورة الإضافية');
      notify('فشل رفع الصورة الإضافية', 'error');
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Save (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title.trim()) {
      setErrorMsg('يرجى كتابة عنوان جذاب للجهاز');
      return;
    }
    if (!formData.brand.trim()) {
      setErrorMsg('يرجى تحديد الماركة أو الشركة المصنعة');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('يرجى إدخال سعر بيع صحيح وأكبر من الصفر');
      return;
    }
    if (!formData.image.trim()) {
      setErrorMsg('يرجى رفع الصورة الأساسية للجهاز أو إدخال رابط معتمد');
      return;
    }

    const origPriceNum = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
    const specsList = formData.specsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        model: formData.model.trim() || undefined,
        price: priceNum,
        originalPrice: origPriceNum && origPriceNum > priceNum ? origPriceNum : undefined,
        status: formData.status,
        condition: formData.condition.trim(),
        specs: specsList,
        warranty: formData.warranty.trim(),
        image: formData.image.trim(),
        additionalImages: formData.additionalImages.filter(Boolean),
        description: formData.description.trim(),
        location: formData.location.trim() || undefined,
        featured: formData.featured
      };

      if (editingItem) {
        await updateForSaleItem(editingItem.id, payload);
        const updatedList = items.map(it => it.id === editingItem.id ? { ...it, ...payload, updatedAt: new Date().toISOString() } : it);
        setItems(updatedList);
        if (onItemsChange) onItemsChange(updatedList);
        notify('تم تحديث بيانات الجهاز المعروض للبيع بنجاح', 'success');
      } else {
        const created = await createForSaleItem(payload);
        const newList = [created, ...items];
        setItems(newList);
        if (onItemsChange) onItemsChange(newList);
        notify('تمت إضافة الجهاز ونشره في قسم المعروضات للبيع بنجاح', 'success');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save item:', err);
      setErrorMsg(err?.message || 'حدث خطأ أثناء حفظ بيانات الجهاز');
      notify('فشل حفظ الجهاز في قاعدة البيانات', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Quick Status Switch
  const handleQuickStatusChange = async (itemId: string, newStatus: ForSaleStatus) => {
    try {
      await updateForSaleItem(itemId, { status: newStatus });
      const updated = items.map(it => it.id === itemId ? { ...it, status: newStatus } : it);
      setItems(updated);
      if (onItemsChange) onItemsChange(updated);
      notify(`تم تغيير حالة الجهاز إلى: ${getStatusLabel(newStatus)}`, 'success');
    } catch (err) {
      console.error('Failed to update status:', err);
      notify('فشل تحديث حالة الجهاز', 'error');
    }
  };

  // Quick Featured Toggle
  const handleQuickToggleFeatured = async (itemId: string, currentVal?: boolean) => {
    const nextVal = !currentVal;
    try {
      await updateForSaleItem(itemId, { featured: nextVal });
      const updated = items.map(it => it.id === itemId ? { ...it, featured: nextVal } : it);
      setItems(updated);
      if (onItemsChange) onItemsChange(updated);
      notify(nextVal ? 'تم تمييز الجهاز وتثبيته في واجهة المعروضات' : 'تم إلغاء التمييز', 'info');
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      notify('فشل تعديل التمييز', 'error');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      await deleteForSaleItem(deleteConfirmItem.id);
      const remaining = items.filter(it => it.id !== deleteConfirmItem.id);
      setItems(remaining);
      if (onItemsChange) onItemsChange(remaining);
      notify(`تم حذف الجهاز "${deleteConfirmItem.title}" نهائياً من المعروضات`, 'info');
      setDeleteConfirmItem(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      notify('فشل حذف الجهاز', 'error');
    }
  };

  // Helper Labels & Badges
  const getStatusBadge = (status: ForSaleStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>متاح للبيع</span>
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>محجوز للعميل</span>
          </span>
        );
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>تم البيع</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusLabel = (status: ForSaleStatus) => {
    if (status === 'AVAILABLE') return 'متاح للبيع';
    if (status === 'RESERVED') return 'محجوز';
    return 'تم البيع';
  };

  // Generate WhatsApp inquiry link for admin quick share
  const generateWhatsAppLink = (item: ApplianceForSale) => {
    const text = `السلام عليكم ورحمة الله، أود الاستفسار عن الجهاز المعروض للبيع لدى مركز قطب:%0A*${item.title}*%0Aالماركة: ${item.brand}%0Aالسعر: ${item.price.toLocaleString()} ج.م%0Aالضمان: ${item.warranty}%0Aكود الجهاز: ${item.id}`;
    return `https://wa.me/20${PHONE_NUMBER_1.replace(/^0+/, '')}?text=${text}`;
  };

  // Filtered & Sorted items
  const filteredItems = items
    .filter(it => {
      const matchSearch = 
        it.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (it.model && it.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (it.description && it.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (it.specs && it.specs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchCategory = filterCategory === 'الكل' || it.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || it.status === filterStatus;
      const matchFeatured = !onlyFeatured || Boolean(it.featured);

      return matchSearch && matchCategory && matchStatus && matchFeatured;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'discount_desc') {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      }
      if (sortBy === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Analytics Metrics
  const totalCount = items.length;
  const availableCount = items.filter(i => i.status === 'AVAILABLE').length;
  const reservedCount = items.filter(i => i.status === 'RESERVED').length;
  const soldCount = items.filter(i => i.status === 'SOLD').length;
  const totalValue = items
    .filter(i => i.status === 'AVAILABLE')
    .reduce((sum, i) => sum + (i.price || 0), 0);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0e3a5e] to-[#123f66] text-white shadow-md shadow-[#0e3a5e]/20">
              <ShoppingBag className="w-7 h-7 text-[#ff7a00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  إدارة الأجهزة المعروضة للبيع (Marketplace)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black">
                  CRUD سحابي
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                إضافة وتعديل وحذف الأجهزة المجددة بالضمان، وتوثيق مواصفاتها وصورها السحابية بـ Firebase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              id="admin-refresh-for-sale-btn"
              type="button"
              onClick={loadData}
              disabled={loading}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="تحديث البيانات من السحابة"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              id="admin-add-for-sale-item-btn"
              type="button"
              onClick={handleOpenAddModal}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#0e3a5e]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#ff7a00]" />
              <span>إضافة جهاز جديد للبيع</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span>إجمالي المعروضات</span>
            </span>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono">{totalCount} جهاز</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>متاح وجاهز للشراء</span>
            </span>
            <div className="text-xl font-black text-emerald-700 mt-2 font-mono">{availableCount} جهاز</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>محجوز مع العملاء</span>
            </span>
            <div className="text-xl font-black text-amber-700 mt-2 font-mono">{reservedCount} جهاز</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>تم بيعها وتسليمها</span>
            </span>
            <div className="text-xl font-black text-slate-700 mt-2 font-mono">{soldCount} جهاز</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#0e3a5e]/5 border border-[#0e3a5e]/15 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#0e3a5e] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#ff7a00]" />
              <span>قيمة المخزون المتاح</span>
            </span>
            <div className="text-lg font-black text-[#0e3a5e] mt-2 font-mono">
              {totalValue.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم الجهاز، الماركة (توشيبا، كريازي، إل جي...)، الموديل، المواصفات..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'الكل' },
              { id: 'AVAILABLE', label: 'المتاح' },
              { id: 'RESERVED', label: 'المحجوز' },
              { id: 'SOLD', label: 'المباع' }
            ].map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-xs"
              >
                <option value="date_desc">الأحدث إضافة أولاً</option>
                <option value="date_asc">الأقدم أولاً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="discount_desc">أعلى نسبة خصم</option>
              </select>
            </div>

            {/* Featured toggle filter */}
            <button
              type="button"
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyFeatured
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-black'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="عرض الأجهزة المميزة فقط"
            >
              <Star className={`w-3.5 h-3.5 ${onlyFeatured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">مميز فقط</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
                title="عرض شبكي (كروت)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
                title="عرض جدول تفصيلي"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">الأقسام:</span>
          {['الكل', 'ثلاجات', 'غسالات', 'ديب فريزر', 'تكييفات', 'بوتاجازات', 'أخرى'].map(cat => {
            const isSelected = filterCategory === cat;
            const count = cat === 'الكل' 
              ? items.length 
              : items.filter(i => i.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0e3a5e] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ITEMS LISTING (GRID OR TABLE) */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#0e3a5e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-black text-slate-700">جاري تحميل الأجهزة من قاعدة البيانات السحابية...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="text-base font-black text-slate-800">لا توجد أجهزة مطابقة لشروط البحث والتصفية</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            يمكنك تغيير كلمات البحث أو اختيار قسم آخر، أو إضافة جهاز جديد للبيع وتوثيق مواصفاته.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-2.5 rounded-xl bg-[#0e3a5e] text-white font-bold text-xs hover:bg-[#123f66] transition-colors cursor-pointer"
          >
            إضافة جهاز جديد الآن
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const hasDiscount = item.originalPrice && item.originalPrice > item.price;
            const discountPercent = hasDiscount 
              ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
              >
                <div>
                  {/* Image Section */}
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Category pill */}
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#0e3a5e]/90 text-white text-xs font-black backdrop-blur-md shadow-md">
                      {item.category}
                    </span>

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 shadow-md">
                      {getStatusBadge(item.status)}
                    </div>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-black shadow-md flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        <span>خصم {discountPercent}%</span>
                      </span>
                    )}

                    {/* Featured star */}
                    {item.featured && (
                      <span className="absolute bottom-3 left-3 p-1.5 rounded-xl bg-amber-500 text-white shadow-md" title="جهاز مميز">
                        <Star className="w-3.5 h-3.5 fill-white" />
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.brand} {item.model ? `• ${item.model}` : ''}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {item.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    {/* Price Block */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-black text-[#0e3a5e] font-mono">
                          {item.price.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
                        </div>
                        {hasDiscount && (
                          <div className="text-[11px] text-slate-400 line-through font-mono">
                            {item.originalPrice!.toLocaleString()} ج.م
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{item.warranty || 'ضمان معتمد'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Specs snippets */}
                    {item.specs && item.specs.length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600 pt-1">
                        {item.specs.slice(0, 2).map((sp, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] font-medium line-clamp-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] shrink-0 mt-1.5"></span>
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
                  {/* Inline Quick Status Selector */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400">تغيير الحالة:</span>
                    <select
                      value={item.status}
                      onChange={e => handleQuickStatusChange(item.id, e.target.value as ForSaleStatus)}
                      className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-hidden cursor-pointer"
                    >
                      <option value="AVAILABLE">🟢 متاح للبيع</option>
                      <option value="RESERVED">🟡 محجوز</option>
                      <option value="SOLD">⚪ تم البيع</option>
                    </select>
                  </div>

                  {/* Buttons Toolbar */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewItem(item);
                          setPreviewActiveImgIdx(0);
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                        title="معاينة تفاصيل الجهاز"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickToggleFeatured(item.id, item.featured)}
                        className={`p-2 rounded-xl border transition-colors ${
                          item.featured
                            ? 'bg-amber-100 border-amber-200 text-amber-700'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-white border-transparent hover:border-slate-200'
                        }`}
                        title={item.featured ? 'إلغاء التمييز' : 'تمييز في الواجهة'}
                      >
                        <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateItem(item)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                        title="استنساخ كجهاز جديد"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <a
                        href={generateWhatsAppLink(item)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                        title="مشاركة رابط استفسار واتساب"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmItem(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black transition-colors cursor-pointer"
                        title="حذف الجهاز نهائياً"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                <tr>
                  <th className="p-4">الجهاز</th>
                  <th className="p-4">القسم والماركة</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الضمان</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-black text-slate-900 line-clamp-1">{item.title}</div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      <div>{item.category}</div>
                      <span className="text-[10px] text-slate-400">{item.brand}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-[#0e3a5e] font-mono">{item.price.toLocaleString()} ج.م</div>
                      {item.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through font-mono">{item.originalPrice.toLocaleString()} ج.م</div>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">
                      {item.warranty}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewItem(item);
                            setPreviewActiveImgIdx(0);
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                          title="معاينة"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD / EDIT FOR SALE APPLIANCE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 text-right">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#0e3a5e]/10 text-[#0e3a5e]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingItem ? 'تعديل بيانات الجهاز المعروض للبيع' : 'إضافة جهاز جديد لقسم المعروضات'}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    يتم تخزين الصور سحابياً ومزامنة البيانات مباشرة مع Firestore
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

            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-black text-slate-700 mb-1.5">
                    عنوان الجهاز والوصف الرئيسي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ثلاجة شارب 18 قدم نوفروست ديجيتال بالكرتونة بحالة الفابريكا"
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
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  >
                    <option value="ثلاجات">ثلاجات</option>
                    <option value="غسالات">غسالات</option>
                    <option value="ديب فريزر">ديب فريزر</option>
                    <option value="تكييفات">تكييفات</option>
                    <option value="بوتاجازات">بوتاجازات</option>
                    <option value="أخرى">أجهزة أخرى</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">
                    الماركة / الشركة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: توشيبا، شارب، كريازي، زانوسي"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">الموديل أو السعة</label>
                  <input
                    type="text"
                    placeholder="مثال: SJ-58C / 18 قدم / 7 كيلو"
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">
                    سعر البيع النهائي (ج.م) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 8500"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-black text-[#0e3a5e]"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">السعر الأصلي / قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="مثال: 10500"
                    value={formData.originalPrice}
                    onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold text-slate-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">حالة التوفر</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as ForSaleStatus })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  >
                    <option value="AVAILABLE">🟢 متاح وجاهز للبيع</option>
                    <option value="RESERVED">🟡 محجوز مؤقتاً</option>
                    <option value="SOLD">⚪ تم البيع والتسليم</option>
                  </select>
                </div>

                {/* Condition */}
                <div className="sm:col-span-2">
                  <label className="block font-black text-slate-700 mb-1.5">حالة الجهاز الفعلية</label>
                  <input
                    type="text"
                    placeholder="مثال: مجددة بحالة الزيرو (Refurbished) / استعمال خفيف كسر زيرو"
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className="block font-black text-slate-700 mb-1.5">مدة وشهادة الضمان</label>
                  <input
                    type="text"
                    placeholder="مثال: ضمان 6 شهور شامل ومعتمد"
                    value={formData.warranty}
                    onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Location / Delivery */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-black text-slate-700 mb-1.5">مكان المعاينة والتوصيل</label>
                  <input
                    type="text"
                    placeholder="فرع أبو المطامير / متاح التوصيل للمنازل بالبحيرة والإسكندرية"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Specifications */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-black text-slate-700 mb-1.5">
                    المواصفات الفنية والمميزات (سطر لكل ميزة)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="شحن فريون أصلي وفحص كامل للدائرة&#10;موتور أصلي بحالة الفابريكا&#10;سعة ممتازة وموفرة في الكهرباء"
                    value={formData.specsText}
                    onChange={e => setFormData({ ...formData, specsText: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Full Description */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-black text-slate-700 mb-1.5">تفاصيل إضافية / تقرير الفحص الفني</label>
                  <textarea
                    rows={2}
                    placeholder="تم فحص وتجربة الجهاز لمدة 48 ساعة متواصلة في ورشة المركز للتأكد من كفاءة التبريد والعزل الحراري..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0e3a5e] focus:outline-hidden font-semibold"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="form-featured-checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-[#0e3a5e] rounded border-slate-300 focus:ring-[#0e3a5e]"
                  />
                  <label htmlFor="form-featured-checkbox" className="font-bold text-slate-800 text-xs cursor-pointer flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>تمييز هذا الجهاز وتثبيته في صدارة قسم الأجهزة المعروضة للبيع</span>
                  </label>
                </div>

                {/* 1. PRIMARY IMAGE UPLOAD (FIREBASE STORAGE) */}
                <div className="sm:col-span-2 lg:col-span-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#0e3a5e]" />
                      <span>الصورة الأساسية للجهاز (الرفع والضغط الآمن) <span className="text-rose-500">*</span></span>
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
                        onChange={handleMainImageUpload}
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
                            <span>جاري الرفع السحابي إلى الرفع والضغط الآمن...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#0e3a5e]" />
                            <span>اختر الصورة الأساسية للرفع من جهازك</span>
                          </>
                        )}
                      </button>

                      <input
                        type="text"
                        placeholder="أو الصق رابط الصورة مباشرة (URL)..."
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ADDITIONAL GALLERY IMAGES */}
                <div className="sm:col-span-2 lg:col-span-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-800 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>صور إضافية للمعرض (لزوايا أخرى، الفريزر، الموتور، الصاج)</span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-500">
                      {formData.additionalImages.length} صور مضافة
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    {formData.additionalImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden group">
                        <img
                          src={imgUrl}
                          alt={`gallery ${idx}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 left-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                          title="حذف الصورة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      disabled={uploadingGalleryImage}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0e3a5e] bg-white text-slate-500 hover:text-[#0e3a5e] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {uploadingGalleryImage ? (
                        <div className="w-4 h-4 border-2 border-[#0e3a5e] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span className="text-[10px] font-bold">إضافة صورة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingMainImage || uploadingGalleryImage}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs shadow-lg shadow-[#0e3a5e]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#ff7a00]" />
                  <span>{saving ? 'جاري الحفظ في السحابة...' : editingItem ? 'حفظ التعديلات' : 'نشر الجهاز في المعروضات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: PREVIEW ITEM (CUSTOMER VIEW) */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 text-right">
            
            {/* Image Gallery */}
            <div className="relative aspect-16/10 bg-slate-950">
              {(() => {
                const allImgs = [previewItem.image, ...(previewItem.additionalImages || [])];
                const currentImg = allImgs[previewActiveImgIdx] || previewItem.image;
                return (
                  <img
                    src={currentImg}
                    alt={previewItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                );
              })()}

              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute top-4 right-4">
                {getStatusBadge(previewItem.status)}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {previewItem.additionalImages && previewItem.additionalImages.length > 0 && (
              <div className="p-3 bg-slate-900 flex items-center gap-2 overflow-x-auto">
                {[previewItem.image, ...previewItem.additionalImages].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewActiveImgIdx(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      previewActiveImgIdx === i ? 'border-[#ff7a00] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0e3a5e] bg-[#0e3a5e]/10 px-3 py-1 rounded-xl">
                  {previewItem.category} • {previewItem.brand}
                </span>
                <span className="font-mono text-slate-400 font-bold">{previewItem.id}</span>
              </div>

              <h3 className="text-base font-black text-slate-900 leading-snug">{previewItem.title}</h3>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-0.5">السعر المطلوب:</span>
                  <div className="text-2xl font-black text-[#0e3a5e] font-mono">
                    {previewItem.price.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{previewItem.warranty}</span>
                  </div>
                  {previewItem.condition && (
                    <div className="text-[10px] font-bold text-slate-500">{previewItem.condition}</div>
                  )}
                </div>
              </div>

              {previewItem.specs && previewItem.specs.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-black text-slate-800 block">المواصفات والفحص الفني:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {previewItem.specs.map((sp, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewItem.description && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  <span className="font-black block text-slate-900 mb-1">ملاحظات الفحص:</span>
                  <p>{previewItem.description}</p>
                </div>
              )}

              {previewItem.location && (
                <div className="flex items-center gap-2 text-slate-600 font-semibold text-[11px]">
                  <Truck className="w-4 h-4 text-[#ff7a00]" />
                  <span>{previewItem.location}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={generateWhatsAppLink(previewItem)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>اختبار رابط استفسار الواتساب للعملاء</span>
                </a>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE CONFIRMATION */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">تأكيد حذف الجهاز من المعروضات</h3>
              <p className="text-xs text-slate-500 font-semibold">
                هل أنت متأكد من حذف الجهاز <strong className="text-slate-800">"{deleteConfirmItem.title}"</strong> نهائياً من قاعدة بيانات Firestore؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors"
              >
                نعم، احذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ForSaleManager;
