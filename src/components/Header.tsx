import React, { useState, useEffect } from 'react';
import { Phone, Wrench, Menu, X, Calendar, ShieldCheck, MessageSquare, Search, HelpCircle } from 'lucide-react';
import { 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_1, 
  CENTER_NAME, 
  YEARS_EXPERIENCE
} from '../config';
import { AppSystemSettings } from '../types';
import { safePublicCopy } from '../lib/publicCopy';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenTracker?: () => void;
  onOpenTroubleshooting?: () => void;
  settings?: AppSystemSettings;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenBooking, 
  onOpenTracker, 
  onOpenTroubleshooting, 
  settings
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const centerName = settings?.centerName || CENTER_NAME;
  const phone1 = settings?.phone1 || PHONE_NUMBER_1;
  const phone1Display = settings?.phone1Display || DISPLAY_PHONE_1;
  const yearsExp = settings?.yearsExperience || YEARS_EXPERIENCE;
  const emergencyAlertText = safePublicCopy(settings?.emergencyAlertText, '');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'services', 'works', 'for-sale-section', 'reviews', 'why-us', 'contact'];
      const scrollPos = window.scrollY + 180;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHash(`#${s}`);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#/' },
    { name: 'خدمات الصيانة', href: '#/#services' },
    { name: 'أجهزة للبيع', href: '#for-sale-section' },
    { name: 'أعمالنا', href: '#/works' },
    { name: 'التواصل', href: '#/reviews-contact' },
  ];


  return (
    <>
      {/* Top Notification / Emergency Alert Bar */}
      {settings?.emergencyAlertEnabled && emergencyAlertText ? (
        <div id="emergency-alert-bar" className="bg-gradient-to-r from-amber-600 to-[#d97706] text-white text-xs py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>{emergencyAlertText}</span>
            </div>
            <a
              href={`tel:+${phone1}`}
              className="px-3 py-1 rounded-full bg-white text-[#123b4a] font-black text-[11px] hover:bg-amber-100 transition-colors shrink-0"
            >
              اتصل الآن: {phone1Display}
            </a>
          </div>
        </div>
      ) : null}

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 border-b border-slate-200/80 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white shadow-xs'
        }`}
      >
        {/* Primary Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo */}
              <a href="#/" id="header-logo" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#123b4a] to-[#174c5d] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-[#d97706]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-lg text-[#123b4a] leading-tight truncate">
                    {centerName}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black shrink-0">
                    +{yearsExp} سنة خبرة
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="truncate">صيانة منزلية • الضمان حسب نوع الإصلاح</span>
                </span>
              </div>
            </a>

            {/* Desktop Full Navigation Links */}
            <nav id="primary-nav" className="hidden lg:flex items-center gap-2 xl:gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  id={`nav-${link.href.replace('#', '')}`}
                  className={`text-xs font-bold transition-colors relative py-1 ${
                    activeHash === link.href
                      ? 'text-[#d97706] font-black'
                      : 'text-slate-700 hover:text-[#d97706]'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Header Top Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Hotline Call Button */}
              <a
                href={`tel:+${phone1}`}
                id="header-call-btn"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#123b4a] bg-slate-100 hover:bg-slate-200 transition-colors"
                title="اتصل بالمركز"
              >
                <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                <span className="font-mono">{phone1Display}</span>
              </a>

              {/* Book Appointment CTA Button */}
              <button
                type="button"
                id="header-book-cta"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#123b4a] hover:bg-[#174c5d] border border-[#123b4a] transition-colors active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">احجز صيانة</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu-drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-menu-drawer" className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#d97706] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {onOpenTroubleshooting && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTroubleshooting();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-sm transition-colors border border-amber-200"
                >
                  <HelpCircle className="w-4 h-4 text-[#d97706]" />
                  <span>دليل فحص وتشخيص الأعطال السريع</span>
                </button>
              )}

              {onOpenTracker && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTracker();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123b4a] font-black text-sm transition-colors border border-slate-200"
                >
                  <Search className="w-4 h-4 text-[#d97706]" />
                  <span>متابعة حالة طلب الصيانة</span>
                </button>
              )}

              <a
                href={`tel:+${phone1}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#123b4a] text-white font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-[#d97706]" />
                اتصال هاتفي ({phone1Display})
              </a>
              <a
                href={`https://wa.me/${phone1}?text=${encodeURIComponent(`السلام عليكم، عايز أستفسر عن صيانة جهاز منزلي لدى ${centerName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                تواصل عبر واتساب
              </a>

              <div className="mt-2 border-t border-slate-100 pt-2 text-center text-[11px] text-slate-400">
                Developed by Eng. Sobhy
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
