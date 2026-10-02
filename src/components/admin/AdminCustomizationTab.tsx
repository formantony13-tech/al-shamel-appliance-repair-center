import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Globe, 
  Phone, 
  Palette, 
  MapPin, 
  AlertCircle, 
  Save, 
  Upload, 
  RotateCcw 
} from 'lucide-react';
import { AppSystemSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../lib/dbService';
import { processImageUpload } from '../../lib/imageUtils';

interface AdminCustomizationTabProps {
  settings?: AppSystemSettings;
  onSaveSettings: (settings: AppSystemSettings) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminCustomizationTab: React.FC<AdminCustomizationTabProps> = ({
  settings,
  onSaveSettings,
  onShowToast
}) => {
  const [form, setForm] = useState<AppSystemSettings>(settings || DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHeroImg, setIsUploadingHeroImg] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(form);
      onShowToast('تم حفظ ونشر الإعدادات السحابية بنجاح!', 'success');
    } catch {
      onShowToast('حدث خطأ أثناء حفظ الإعدادات', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroBannerUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingHeroImg(true);
    try {
      const processed = await processImageUpload(file, 1600, 900, 0.85);
      setForm(prev => ({ ...prev, heroBannerImage: processed.dataUrl }));
      onShowToast('تم تحسين ورفع صورة الواجهة بنجاح', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'فشل معالجة الصورة', 'error');
    } finally {
      setIsUploadingHeroImg(false);
    }
  };

  const handleResetDefaultHeroImage = () => {
    setForm(prev => ({ ...prev, heroBannerImage: DEFAULT_SETTINGS.heroBannerImage }));
    onShowToast('تم استعادة الصورة الافتراضية للواجهة', 'info');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#ff7a00]" />
            <span>تخصيص محتوى الموقع بالكامل (الصور، الأرقام، العناوين، والإعدادات)</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            يمكنك تعديل أي معلومة أو رقم أو صورة في الموقع ونشرها فوراً على السحابة
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs shadow-lg shadow-[#0e3a5e]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#ff7a00]" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات فوراً'}</span>
          </button>
        </div>
      </div>

      {/* Grid 1: Basic Identity & Headline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-[#0e3a5e]" />
          <span>1. الهوية الأساسية والعناوين الرئيسية</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">اسم المركز / الورشة</label>
            <input
              type="text"
              required
              value={form.centerName}
              onChange={(e) => setForm({ ...form, centerName: e.target.value })}
              placeholder="مثال: مركز قطب للحل السريع"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">الشعار اللفظي (Slogan)</label>
            <input
              type="text"
              required
              value={form.centerSlogan}
              onChange={(e) => setForm({ ...form, centerSlogan: e.target.value })}
              placeholder="مثال: صيانة منزلية فورية بقطع غيار أصلية وضمان معتمد"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">سنوات الخبرة</label>
            <input
              type="number"
              required
              min={1}
              max={60}
              value={form.yearsExperience}
              onChange={(e) => setForm({ ...form, yearsExperience: String(parseInt(e.target.value, 10) || 20) })}
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">مواعيد وساعات العمل الرسمية</label>
            <input
              type="text"
              required
              value={form.operatingHours}
              onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
              placeholder="مثال: يومياً من 8 صباحاً حتى 11 مساءً (طوارئ 24 ساعة)"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">عنوان الواجهة الرئيسي (Hero Headline)</label>
            <textarea
              rows={2}
              value={form.heroHeadline || ''}
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              placeholder="مركز قطب للحل السريع — صيانة منزلية متخصصة"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">الوصف التوضيحي بالواجهة (Hero Subheadline)</label>
            <textarea
              rows={2}
              value={form.heroSubheadline || ''}
              onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
              placeholder="نصلك فوراً أينما كنت في أبو المطامير وقرى البحيرة..."
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Grid 2: Phone Numbers & WhatsApp */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>2. أرقام الهواتف والتواصل عبر واتساب (الرقمين الأساسيين)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Phone 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                الخط الأساسي الأول (مكالمات + واتساب)
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">الرقم الدولي (واتساب والاتصال - بدون أصفار أو مسافات)</label>
              <input
                type="text"
                required
                value={form.phone1}
                onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                placeholder="مثال: 201021469149"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0e3a5e] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">صيغة عرض الرقم في الموقع للزوار</label>
              <input
                type="text"
                required
                value={form.phone1Display}
                onChange={(e) => setForm({ ...form, phone1Display: e.target.value })}
                placeholder="مثال: 01021469149"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0e3a5e] font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Phone 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                الخط الثاني البديل (مكالمات + واتساب)
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">الرقم الدولي الثاني (واتساب والاتصال)</label>
              <input
                type="text"
                required
                value={form.phone2}
                onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                placeholder="مثال: 201111664188"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0e3a5e] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">صيغة عرض الرقم الثاني في الموقع</label>
              <input
                type="text"
                required
                value={form.phone2Display}
                onChange={(e) => setForm({ ...form, phone2Display: e.target.value })}
                placeholder="مثال: 01111664188"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0e3a5e] font-mono text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid 3: Hero Banner & Images Customization */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette className="w-4 h-4 text-[#ff7a00]" />
          <span>3. صورة الواجهة الرئيسية (Hero Banner Image)</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
          {/* Live Preview */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">معاينة الصورة الحالية</label>
            <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-inner group">
              <img
                src={form.heroBannerImage || DEFAULT_SETTINGS.heroBannerImage}
                alt="Hero Banner Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-white">صورة واجهة الموقع</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefaultHeroImage}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الصورة الافتراضية الأصلية</span>
            </button>
          </div>

          {/* Upload Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">رفع صورة جديدة من جهازك مباشرة</label>
              <div className="border-2 border-dashed border-slate-300 hover:border-[#0e3a5e] rounded-2xl p-4 text-center bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-[#0e3a5e] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 mb-1">
                  {isUploadingHeroImg ? 'جاري معالجة ورفع الصورة...' : 'اضغط لاختيار صورة من جهازك'}
                </p>
                <p className="text-[10px] text-slate-400">يدعم صيغ JPG، PNG، WEBP (يتم التحسين تلقائياً)</p>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingHeroImg}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleHeroBannerUpload(file);
                  }}
                  className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#0e3a5e] file:text-white hover:file:bg-[#123f66] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">أو أدخل رابط صورة مباشر (Image URL)</label>
              <input
                type="url"
                value={form.heroBannerImage || ''}
                onChange={(e) => setForm({ ...form, heroBannerImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0e3a5e] font-mono text-left text-xs"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid 4: Location, Social & Emergency Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Location & Maps */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>4. العنوان وخرائط جوجل</span>
          </h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1">العنوان المعروض للعملاء</label>
            <input
              type="text"
              required
              value={form.locationName}
              onChange={(e) => setForm({ ...form, locationName: e.target.value })}
              placeholder="مثال: أبو المطامير - بجوار مسجد الرحمة - محافظة البحيرة"
              className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">رابط موقع الورشة على Google Maps</label>
            <input
              type="url"
              value={form.googleMapsLink || ''}
              onChange={(e) => setForm({ ...form, googleMapsLink: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-mono text-left"
              dir="ltr"
            />
          </div>
        </div>

        {/* Social & Emergency Alert */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>5. صفحات التواصل وشريط التنبيهات</span>
          </h4>

          <div>
            <label className="font-bold text-slate-700 block mb-1">رابط صفحة فيسبوك الأولى</label>
            <input
              type="url"
              value={form.facebookPage1}
              onChange={(e) => setForm({ ...form, facebookPage1: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">رابط صفحة فيسبوك الثانية</label>
            <input
              type="url"
              value={form.facebookPage2}
              onChange={(e) => setForm({ ...form, facebookPage2: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e] font-mono text-left"
              dir="ltr"
            />
          </div>

          {/* Emergency Bar Toggle */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">تفعيل شريط التنبيهات أعلى الموقع</span>
              <input
                type="checkbox"
                id="emergencyAlertToggle"
                checked={form.emergencyAlertEnabled || false}
                onChange={(e) => setForm({ ...form, emergencyAlertEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#0e3a5e] focus:ring-[#0e3a5e] cursor-pointer"
              />
            </div>
            {form.emergencyAlertEnabled && (
              <input
                type="text"
                value={form.emergencyAlertText || ''}
                onChange={(e) => setForm({ ...form, emergencyAlertText: e.target.value })}
                placeholder="مثال: خصم 20% لفترة محدودة على صيانة الديب فريزر والثلاجات!"
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50 outline-none font-semibold text-amber-900"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Save Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
        <span className="text-xs text-slate-500 font-semibold">
          جميع التغييرات تُحفظ في Firestore سحابياً ويتم تطبيقها مباشرة على الموقع فوراً.
        </span>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات ونشرها الآن'}</span>
        </button>
      </div>
    </form>
  );
};
