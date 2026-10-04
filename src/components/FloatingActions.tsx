import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  ArrowUp, 
  X, 
  Send, 
  Upload, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  MessageCircle
} from 'lucide-react';
import { 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_2, 
  DISPLAY_PHONE_2, 
  CENTER_NAME 
} from '../config';
import { AppSystemSettings } from '../types';

interface FloatingActionsProps {
  settings?: AppSystemSettings;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ settings }) => {
  const centerName = settings?.centerName || CENTER_NAME;
  const phone1 = settings?.phone1 || PHONE_NUMBER_1;
  const phone1Display = settings?.phone1Display || DISPLAY_PHONE_1;
  const phone2 = settings?.phone2 || PHONE_NUMBER_2;
  const phone2Display = settings?.phone2Display || DISPLAY_PHONE_2;

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Quick Chat Modal Form State
  const [chatProblem, setChatProblem] = useState('');
  const [chatDevice, setChatDevice] = useState('غسالة أوتوماتيك');
  const [chatName, setChatName] = useState('');
  const [chatSelectedNumber, setChatSelectedNumber] = useState<'1' | '2'>('1');
  const [chatImagePreview, setChatImagePreview] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleImageAttach = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setChatImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendQuickChat = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNumber = chatSelectedNumber === '1' ? phone1 : phone2;
    const numberLabel = chatSelectedNumber === '1' ? phone1Display : phone2Display;

    const message = `*استشارة وصيانة فورية من موقع ${centerName}* 🛠️
━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${chatName.trim() || 'عميل كريم'}
🔌 *نوع الجهاز:* ${chatDevice}
📝 *وصف العطل:*
${chatProblem.trim() || 'أود الاستفسار عن كشف وحجز صيانة'}
━━━━━━━━━━━━━━━━━━
_الرقم الموجه إليه:_ ${numberLabel}
_أبو المطامير - محافظة البحيرة_`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${targetNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
    setIsChatModalOpen(false);
    setChatProblem('');
    setChatName('');
    setChatImagePreview('');
  };

  return (
    <>
      {/* Floating Buttons Container - Bottom Left (RTL Friendly) */}
      <div id="floating-actions" className="fixed bottom-5 left-4 sm:left-6 z-40 flex flex-col items-center gap-3">
        
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#123b4a] text-white flex items-center justify-center shadow-lg hover:bg-[#174c5d] transition-all transform hover:scale-110 active:scale-95 border border-white/20"
            aria-label="الصعود لأعلى الصفحة"
            title="العودة لأعلى"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Quick Chat / Consultation Modal Launcher */}
        <button
          type="button"
          onClick={() => setIsChatModalOpen(true)}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#123b4a] hover:bg-[#174c5d] text-white text-xs font-black shadow-xl border border-white/20 transition-all transform hover:scale-105 active:scale-95"
          title="تحدث مع مهندس الصيانة فوراً"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="hidden sm:inline">استشارة وصور العطل</span>
          <span className="sm:hidden">استشارة</span>
          <Wrench className="w-4 h-4 text-[#d97706]" />
        </button>

        {/* Master Contact Trigger with Popup Menu */}
        <div className="relative">
          {/* Expanded Menu */}
          {isMenuOpen && (
            <div 
              className="absolute bottom-16 left-0 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 p-3 min-w-[260px] sm:min-w-[280px] flex flex-col gap-2 animate-fadeIn text-right z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-[#123b4a] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                  تواصل فوري (24 ساعة):
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* WhatsApp Option 1 */}
              <a
                href={`https://wa.me/${phone1}?text=مرحباً، أود حجز مهندس صيانة من ${encodeURIComponent(centerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">واتساب الخط 1</div>
                    <div className="text-[10px] text-emerald-700 font-mono" dir="ltr">{phone1Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#25D366] text-white px-2 py-0.5 rounded-lg">شات</span>
              </a>

              {/* WhatsApp Option 2 */}
              <a
                href={`https://wa.me/${phone2}?text=مرحباً، أود حجز صيانة من ${encodeURIComponent(centerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">واتساب الخط 2</div>
                    <div className="text-[10px] text-emerald-700 font-mono" dir="ltr">{phone2Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#25D366] text-white px-2 py-0.5 rounded-lg">شات</span>
              </a>

              {/* Phone Call Option 1 */}
              <a
                href={`tel:+${phone1}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#123b4a] transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#123b4a] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#d97706]" />
                  </div>
                  <div>
                    <div className="text-xs font-black">اتصال بالخط الأساسي</div>
                    <div className="text-[10px] text-slate-600 font-mono" dir="ltr">{phone1Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#123b4a] text-white px-2 py-0.5 rounded-lg">مكالمة</span>
              </a>

              {/* Phone Call Option 2 */}
              <a
                href={`tel:+${phone2}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs font-black">اتصال بالخط الثاني</div>
                    <div className="text-[10px] text-slate-600 font-mono" dir="ltr">{phone2Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-700 text-white px-2 py-0.5 rounded-lg">مكالمة</span>
              </a>
            </div>
          )}

          {/* Main Round Floating Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            id="floating-master-btn"
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#25D366] to-[#1ebe5a] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:from-[#20ba59] hover:to-[#18a24c] transition-all transform hover:scale-110 active:scale-95"
            aria-label="خيارات التواصل السريع عبر واتساب والهاتف"
            title="تواصل معنا عبر واتساب والاتصال بالرقمين"
          >
            {/* Ping pulse */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none"></span>

            {isMenuOpen ? (
              <X className="w-7 h-7 relative z-10" />
            ) : (
              <MessageSquare className="w-7 h-7 relative z-10" />
            )}

            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#d97706] border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
              2
            </span>
          </button>
        </div>

      </div>

      {/* QUICK CHAT / CONSULTATION MODAL */}
      {isChatModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setIsChatModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-6 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsChatModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-black mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                استشارة وتواصل فوري
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#123b4a]">
                تحدث مع فني {CENTER_NAME}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                اكتب مشكلة جهازك أو أرفق صورته وسيتم توجيهها فوراً لمهندس الصيانة على واتساب
              </p>
            </div>

            <form onSubmit={handleSendQuickChat} className="space-y-4">
              
              {/* Select WhatsApp Number */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  اختر رقم الواتساب للتواصل:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChatSelectedNumber('1')}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col ${
                      chatSelectedNumber === '1'
                        ? 'border-[#25D366] bg-emerald-50 ring-2 ring-[#25D366]/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-[#123b4a]">الرقم الأساسي</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700" dir="ltr">{DISPLAY_PHONE_1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChatSelectedNumber('2')}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col ${
                      chatSelectedNumber === '2'
                        ? 'border-[#25D366] bg-emerald-50 ring-2 ring-[#25D366]/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black text-[#123b4a]">الرقم الثاني</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700" dir="ltr">{DISPLAY_PHONE_2}</span>
                  </button>
                </div>
              </div>

              {/* Name & Device */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    اسمك الكريم:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: أحمد عبد الله"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#123b4a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    نوع الجهاز:
                  </label>
                  <select
                    value={chatDevice}
                    onChange={(e) => setChatDevice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#123b4a]"
                  >
                    <option value="ديب فريزر">ديب فريزر</option>
                    <option value="ثلاجة نوفروست">ثلاجة نوفروست</option>
                    <option value="غسالة أوتوماتيك">غسالة أوتوماتيك</option>
                    <option value="سمكرة ودوكو برومة">سمكرة وبرومة صاج</option>
                    <option value="تكييف">تكييف سبليت</option>
                    <option value="بوتاجاز">بوتاجاز أو سخان</option>
                  </select>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  اكتب العطل أو الاستفسار:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="مثال: الديب فريزر فصل تبريد / الغسالة بتعمل صوت في العصر..."
                  value={chatProblem}
                  onChange={(e) => setChatProblem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-[#123b4a]"
                />
              </div>

              {/* Attach Photo for Preview */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  إرفاق صورة للعطل أو مكان البارومة (اختياري):
                </label>
                {chatImagePreview ? (
                  <div className="relative aspect-[16/8] rounded-xl overflow-hidden border border-slate-200">
                    <img src={chatImagePreview} alt="معاينة صورة العطل" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setChatImagePreview('')}
                      className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold"
                    >
                      حذف الصورة
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-300 hover:border-[#123b4a] rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Upload className="w-4 h-4 text-[#d97706]" />
                    <span className="text-xs font-bold text-slate-600">اختر صورة للجهاز من هاتفك أو الكمبيوتر</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageAttach(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChatModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-black shadow-lg shadow-[#25D366]/20 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>بدء المحادثة على واتساب الآن</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};
