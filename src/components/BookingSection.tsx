import React, { useState } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Upload,
  Trash2,
  MessageCircle,
  CheckCircle,
  Copy,
  ArrowLeft,
  Search,
  Award,
  HelpCircle
} from 'lucide-react';
import { 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_2, 
  DISPLAY_PHONE_2, 
  CENTER_NAME, 
  YEARS_EXPERIENCE, 
  LOCATION_NAME,
  GOOGLE_MAPS_LINK 
} from '../config';
import { BookingFormData, BookingRecord } from '../types';
import { validateEgyptianPhone } from '../lib/validation';
import { checkSpamSubmission, recordSubmission } from '../lib/spamProtection';
import { getArabicFirebaseErrorMessage } from '../lib/firebaseErrorHandler';

interface BookingSectionProps {
  initialDevice?: string;
  initialIssue?: string;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenTracker?: () => void;
  onOpenTroubleshooting?: () => void;
  onViewWarrantyCertificate?: (booking: BookingRecord) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ 
  initialDevice = 'ديب فريزر',
  initialIssue = '',
  onShowToast,
  onOpenTracker,
  onOpenTroubleshooting,
  onViewWarrantyCertificate
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phoneNumber: '',
    address: '',
    deviceType: initialDevice || 'ديب فريزر ألاسكا / كريازي',
    brand: '',
    issueDescription: initialIssue || '',
    preferredTime: 'أقرب موعد متاح'
  });
  const [formRenderTime] = useState<number>(() => Date.now());
  const [honeypotValue, setHoneypotValue] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Sync when initial values change from diagnostics
  React.useEffect(() => {
    if (initialDevice) {
      setFormData(prev => ({
        ...prev,
        deviceType: initialDevice,
        issueDescription: initialIssue || prev.issueDescription
      }));
    }
  }, [initialDevice, initialIssue]);

  const selectedTargetNumber: '1' | '2' = '1';
  const [appliancePhoto, setAppliancePhoto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [fallbackWhatsAppUrl, setFallbackWhatsAppUrl] = useState<string | null>(null);

  const popularBranches = [
    'محافظة البحيرة',
    'منطقة أخرى داخل محافظة البحيرة'
  ];

  const quickDeviceSuggestions = [
    'ديب فريزر رأسي أدراج',
    'ديب فريزر أفقي صندوق',
    'ثلاجة بابين / نوفروست',
    'غسالة أوتوماتيك أمامية',
    'غسالة فوق أوتوماتيك',
    'علاج بارومة وسمكرة ودوكو',
    'تكييف سبليت',
    'بوتاجاز / فرن',
    'سخان مياه',
    'غسالة أطباق'
  ];

  const timeOptions = [
    'أقرب موعد متاح',
    'اليوم في الفترة الصباحية (9ص - 2ظ)',
    'اليوم في الفترة المسائية (4ع - 10م)',
    'غداً صباحاً',
    'غداً مساءً',
    'تحديد موعد هاتفياً'
  ];

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const { compressAndUploadImage } = await import('../lib/imageUtils');
      const photoId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const uploadResult = await compressAndUploadImage(file, 'bookings', photoId);
      setAppliancePhoto(uploadResult.url);
      onShowToast(uploadResult.storagePath ? 'تم رفع الصورة إلى التخزين السحابي' : 'تم تجهيز الصورة للاستخدام دون اتصال', 'success');
    } catch (err: any) {
      onShowToast(err?.message || 'تعذر معالجة الصورة، يرجى اختيار ملف صورة صالح', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 0. Anti-spam validation
    const spamCheck = checkSpamSubmission({
      honeypot: honeypotValue,
      formRenderTime
    });

    if (!spamCheck.allowed) {
      onShowToast(spamCheck.reason || 'تم رفض الإرسال لأسباب أمنية', 'error');
      return;
    }

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      onShowToast('يرجى كتابة الاسم الثلاثي بالكامل', 'error');
      return;
    }

    const phoneValidation = validateEgyptianPhone(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      onShowToast(phoneValidation.error || 'يرجى إدخال رقم هاتف صحيح', 'error');
      return;
    }

    if (!formData.issueDescription.trim() || formData.issueDescription.trim().length < 5) {
      onShowToast('يرجى كتابة وصف واضح للعطل لمساعدة المهندس', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. SAVE BOOKING TO CENTRAL CLOUD DATABASE FIRST
      const { createBooking } = await import('../lib/dbService');
      const savedBooking = await createBooking({
        fullName: formData.fullName.trim(),
        phoneNumber: phoneValidation.normalized,
        address: formData.address.trim(),
        deviceType: formData.deviceType,
        brand: formData.brand.trim() || undefined,
        issueDescription: formData.issueDescription.trim(),
        preferredTime: formData.preferredTime,
        imageUrl: appliancePhoto || undefined
      });

      // Record submission timestamp for spam limiter
      recordSubmission();

      setConfirmedBooking(savedBooking);
      onShowToast(
        savedBooking.syncState === 'SYNCED'
          ? `وصل طلبك للمركز. احتفظ بكود المتابعة: ${savedBooking.id}`
          : 'اتحفظ الطلب على جهازك، لكن لسه ما وصلش للمركز. ابعته على واتساب لتأكيد استلامه.',
        savedBooking.syncState === 'SYNCED' ? 'success' : 'info'
      );

    } catch (error: any) {
      console.error('Error creating booking:', error);
      const friendlyMsg = getArabicFirebaseErrorMessage(error);
      const targetPhone = selectedTargetNumber === '1' ? PHONE_NUMBER_1 : PHONE_NUMBER_2;
      const fallbackMsg = `*طلب صيانة عاجل (إرسال مباشر عبر واتساب)* 🛠️
━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${formData.fullName.trim()}
📱 *الموبايل:* ${formData.phoneNumber.trim()}
📍 *العنوان:* ${formData.address.trim()}
🔌 *الجهاز:* ${formData.deviceType} ${formData.brand ? `(${formData.brand.trim()})` : ''}
⏰ *الموعد المطلوب:* ${formData.preferredTime}
📝 *وصف العطل:*
${formData.issueDescription.trim()}
━━━━━━━━━━━━━━━━━━`;
      const fallbackUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(fallbackMsg)}`;
      setFallbackWhatsAppUrl(fallbackUrl);
      onShowToast(friendlyMsg || 'تعذر تسجيل الطلب الآن. تواصل معنا هاتفيًا أو عبر واتساب لإرساله، ثم تأكد من استلام المركز له.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const copyBookingId = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.id);
      onShowToast('تم نسخ كود الحجز إلى الحافظة', 'success');
    }
  };

  const confirmedBookingWhatsAppUrl = confirmedBooking
    ? `https://wa.me/${selectedTargetNumber === '1' ? PHONE_NUMBER_1 : PHONE_NUMBER_2}?text=${encodeURIComponent(
        `مرحباً مركز قطب، أرسلت طلب صيانة من الموقع. كود الطلب: ${confirmedBooking.id}\nالاسم: ${confirmedBooking.fullName}\nرقم الهاتف: ${confirmedBooking.phoneNumber}\nالعنوان: ${confirmedBooking.address}\nالجهاز: ${confirmedBooking.deviceType}${confirmedBooking.brand ? ` (${confirmedBooking.brand})` : ''}\nالوقت المفضل: ${confirmedBooking.preferredTime}\nوصف العطل: ${confirmedBooking.issueDescription}`
      )}`
    : '#';

  return (
    <section id="booking" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Form Column (Right in RTL) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-50 border-2 border-slate-200 p-6 sm:p-10 shadow-lg">
              
              {confirmedBooking ? (
                /* SUCCESS CONFIRMATION SCREEN */
                <div className="text-center py-8 space-y-6 animate-fadeIn">
                  <div className={`w-20 h-20 rounded-full ${confirmedBooking.syncState === 'SYNCED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'} flex items-center justify-center mx-auto shadow-inner`}>
                    {confirmedBooking.syncState === 'SYNCED' ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                  </div>

                  <div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                      {confirmedBooking.syncState === 'SYNCED' ? 'وصل طلبك للمركز' : 'الطلب محفوظ على جهازك فقط'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#123b4a] mt-2">
                      أهلاً يا {confirmedBooking.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                      {confirmedBooking.syncState === 'SYNCED'
                        ? 'استلمنا بياناتك. هنتواصل معاك لتأكيد موعد الزيارة.'
                        : 'الطلب لسه ما وصلش للمركز. ابعته على واتساب من الزر أدناه، واحتفظ بكود المتابعة.'}
                    </p>
                  </div>

                  {/* Booking ID Box */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#123b4a]/20 max-w-sm mx-auto flex items-center justify-between shadow-sm">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-500 block">كود المتابعة الخاص — احتفظ به:</span>
                      <span className="text-xl font-black text-[#123b4a] font-mono">{confirmedBooking.id}</span>
                      <span className="mt-1 block max-w-[230px] text-[10px] font-semibold leading-5 text-slate-500">الكود هو مفتاح الاطلاع على حالة الطلب؛ لا ترسله إلا لمن تثق به.</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyBookingId}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#123b4a] hover:text-white text-slate-700 transition-colors"
                      title="نسخ كود الحجز"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {confirmedBooking.syncState === 'PENDING_SYNC' && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-bold text-right">
                      ⚠️ ما قدرناش نأكد وصول الطلب للمركز. ما تعتبرش الموعد محجوزًا لحد ما يرد عليك الفريق؛ ابعت التفاصيل على واتساب أو اتصل بينا.
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {onViewWarrantyCertificate && (
                      <button
                        type="button"
                        onClick={() => onViewWarrantyCertificate(confirmedBooking)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#123b4a] hover:bg-[#174c5d] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md"
                      >
                        <Award className="w-4 h-4 text-[#d97706]" />
                        <span>عرض وطباعة إيصال الحجز والضمان</span>
                      </button>
                    )}

                    <a
                      href={confirmedBookingWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{confirmedBooking.syncState === 'SYNCED' ? 'متابعة الطلب على واتساب' : 'إرسال بيانات الطلب على واتساب'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmedBooking(null);
                        setFormData({
                          fullName: '',
                          phoneNumber: '',
                          address: 'محافظة البحيرة',
                          deviceType: 'ديب فريزر',
                          brand: '',
                          issueDescription: '',
                          preferredTime: 'أقرب موعد متاح'
                        });
                        setAppliancePhoto('');
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                    >
                      حجز صيانة لجهاز آخر
                    </button>
                  </div>
                </div>
              ) : (
                /* MAIN BOOKING FORM */
                <div>
                  {fallbackWhatsAppUrl && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-right space-y-2.5 animate-fadeIn">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>تعذر إرسال الحجز للسيرفر السحابي</span>
                      </div>
                      <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                        الطلب ما وصلش للمركز إلكترونيًا. اضغط الزر التالي لإرسال التفاصيل بنفسك عبر واتساب، وانتظر تأكيد الفريق للموعد:
                      </p>
                      <a
                        href={fallbackWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm shadow-md transition-transform active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>إرسال الطلب الآن عبر واتساب مباشرة 💬</span>
                      </a>
                    </div>
                  )}

                  <div className="text-right mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black uppercase tracking-wider w-fit">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>طلب زيارة صيانة</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {onOpenTroubleshooting && (
                          <button
                            type="button"
                            onClick={onOpenTroubleshooting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black border border-amber-200 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
                            <span>دليل الأعطال</span>
                          </button>
                        )}

                        {onOpenTracker && (
                          <button
                            type="button"
                            onClick={onOpenTracker}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black border border-slate-200 transition-colors"
                          >
                            <Search className="w-3.5 h-3.5 text-[#d97706]" />
                            <span>تتبع الحجز</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#123b4a] leading-tight">
                      اطلب زيارة صيانة
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                      اكتب بياناتك ومشكلة الجهاز، وفريق المركز هيتواصل معاك لتأكيد إمكانية الزيارة وموعدها حسب منطقتك.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-right">
                    {/* Honeypot field for anti-spam (hidden from real users) */}
                    <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                      <label htmlFor="website_hp">Leave this empty</label>
                      <input
                        id="website_hp"
                        type="text"
                        name="website_hp"
                        value={honeypotValue}
                        onChange={(e) => setHoneypotValue(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1.5">
                          الاسم بالكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: أحمد عبد الله"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1.5">
                          رقم الموبايل (11 رقم) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="010xxxxxxxx أو 011xxxxxxxx"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Address & Branches */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        العنوان داخل محافظة البحيرة <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="اكتب عنوانك داخل نطاق الخدمة: المركز أو القرية أو الشارع وأقرب علامة مميزة"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                        />
                        <MapPin className="w-5 h-5 text-slate-400 absolute top-3.5 right-3.5" />
                      </div>

                      {/* Quick Branch Selection Pills */}
                      <div className="mt-2.5">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                          تحديد المحافظة أو الفرع بسرعة:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {popularBranches.map((branch) => (
                            <button
                              key={branch}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  address: branch
                                }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                formData.address.includes(branch.substring(0, 12))
                                  ? 'bg-[#123b4a] text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {branch}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Device Type (Free-text + Quick chips) & Brand */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black text-slate-700">
                            اكتب نوع جهازك <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[11px] text-[#d97706] font-bold">
                            حر (يمكنك كتابة أي نوع)
                          </span>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="اكتب نوع جهازك هنا (مثال: ديب فريزر، غسالة، ثلاجة، فرن...)"
                          value={formData.deviceType}
                          onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                        />
                        
                        {/* Quick suggestions chips */}
                        <div className="mt-2">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                            أو اضغط للاختيار السريع والتعديل:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {quickDeviceSuggestions.map((sugg) => (
                              <button
                                key={sugg}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, deviceType: sugg }))}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                  formData.deviceType === sugg
                                    ? 'bg-[#d97706] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {sugg}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-1.5">
                          الماركة / الموديل (اختياري)
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: ألاسكا، كريازي، شارب، توشيبا، LG، سامسونج، زانوسي، بيكو"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                        />
                      </div>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        الموعد المفضل للزيارة
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Issue Description */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        وصف العطل أو المشكلة بالتفصيل <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="مثال: الديب فريزر مش بيجمد / الثلاجة بتجمع ثلج ومش بتبرد أو بتنزل ميه / الغسالة بتعصر بصوت عالي أو بتسرب ميه أو فيها برومة..."
                        value={formData.issueDescription}
                        onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#123b4a]/20 focus:border-[#123b4a] transition-all"
                      />
                    </div>

                    {/* Upload Photo preview */}
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        صورة الجهاز أو مكان العطل والبارومة (اختياري):
                      </label>
                      {appliancePhoto ? (
                        <div className="relative aspect-[16/8] rounded-2xl overflow-hidden border border-slate-200">
                          <img src={appliancePhoto} alt="معاينة صورة الجهاز" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setAppliancePhoto('')}
                            className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            حذف
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-300 hover:border-[#123b4a] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                          <Upload className="w-6 h-6 text-[#d97706] mb-1" />
                          <span className="text-xs font-bold text-slate-700">اضغط لرفع صورة من هاتفك أو اسحبها هنا</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">تساعد المهندس في تشخيص العطل قبل التحرك</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handlePhotoUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        id="submit-booking-btn"
                        className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#d97706] hover:bg-[#b45309] text-white text-base font-black shadow-md shadow-[#d97706]/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>جارٍ إرسال طلبك…</span>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            <span>إرسال طلب الصيانة</span>
                          </>
                        )}
                      </button>
                      <p className="text-[11px] font-semibold text-slate-500 text-center mt-2 leading-5">
                        الموعد لا يتأكد بمجرد إرسال الطلب؛ سنتواصل معك لتأكيده. نستخدم بياناتك للتواصل بشأن هذا الطلب.
                      </p>
                    </div>

                  </form>
                </div>
              )}

            </div>
          </div>

          {/* Side Info Column (Left in RTL) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#123b4a] p-6 text-white shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#d97706]"><Phone className="h-5 w-5" /></div>
                <div><h3 className="text-base font-black">تواصل مع {CENTER_NAME}</h3><p className="text-xs font-semibold text-slate-300">الزيارات يوميًا من 8 صباحًا إلى 11 مساءً</p></div>
              </div>
              <a href={`tel:+${PHONE_NUMBER_1}`} className="block rounded-2xl bg-white/10 p-3 text-center text-xl font-black text-[#d97706] font-mono" dir="ltr">{DISPLAY_PHONE_1}</a>
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-right">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="flex items-center gap-2 text-sm font-black text-white">
                    <MapPin className="w-4 h-4 text-[#d97706]" />
                  نطاق التغطية والخدمة:
                </h4>
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#d97706] hover:underline font-bold"
                >
                  الخريطة
                </a>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-slate-300">
                  مركزنا في محافظة البحيرة. تغطية الزيارة تختلف حسب المنطقة، فاتصل بنا للتأكد قبل اختيار الموعد.
              </p>
            </div>

          </div>

        </div>

      </div>
      </div>
    </section>
  );
};
