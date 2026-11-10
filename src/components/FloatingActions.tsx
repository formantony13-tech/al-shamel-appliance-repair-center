import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  ArrowUp, 
  X, 
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
                  اتصل أو راسلنا:
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
                href={`https://wa.me/${phone1}?text=${encodeURIComponent(`السلام عليكم، عايز أستفسر عن صيانة جهاز منزلي لدى ${centerName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">واتساب — الرقم الأساسي</div>
                    <div className="text-[10px] text-emerald-700 font-mono" dir="ltr">{phone1Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#25D366] text-white px-2 py-0.5 rounded-lg">واتساب</span>
              </a>

              {/* WhatsApp Option 2 */}
              <a
                href={`https://wa.me/${phone2}?text=${encodeURIComponent(`السلام عليكم، عايز أستفسر عن صيانة جهاز منزلي لدى ${centerName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">واتساب — الرقم الثاني</div>
                    <div className="text-[10px] text-emerald-700 font-mono" dir="ltr">{phone2Display}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#25D366] text-white px-2 py-0.5 rounded-lg">واتساب</span>
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
                    <div className="text-xs font-black">اتصال — الرقم الأساسي</div>
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
                    <div className="text-xs font-black">اتصال — الرقم الثاني</div>
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
            aria-expanded={isMenuOpen}
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#123b4a] text-white flex items-center justify-center shadow-lg hover:bg-[#174c5d] transition-all active:scale-95"
            aria-label="خيارات الاتصال والواتساب"
            title="اتصل أو راسلنا"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7 relative z-10" />
            ) : (
              <MessageSquare className="w-7 h-7 relative z-10" />
            )}

          </button>
        </div>

      </div>

    </>
  );
};
