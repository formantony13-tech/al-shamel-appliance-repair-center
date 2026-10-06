import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Wrench, 
  Menu, 
  X, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Award, 
  Search, 
  HelpCircle,
  ShoppingBag,
  Camera,
  Star,
  Sparkles,
  MapPin,
  Lock,
  Tag
} from 'lucide-react';
import { 
  DISPLAY_PHONE_1, 
  PHONE_NUMBER_1, 
  DISPLAY_PHONE_2,
  PHONE_NUMBER_2,
  CENTER_NAME, 
  YEARS_EXPERIENCE 
} from '../config';
import { AppSystemSettings } from '../types';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenTracker?: () => void;
  onOpenTroubleshooting?: () => void;
  onOpenAdmin?: () => void;
  settings?: AppSystemSettings;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenBooking, 
  onOpenTracker, 
  onOpenTroubleshooting, 
  onOpenAdmin,
  settings 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const centerName = settings?.centerName || CENTER_NAME;
  const phone1 = settings?.phone1 || PHONE_NUMBER_1;
  const phone1Display = settings?.phone1Display || DISPLAY_PHONE_1;
  const phone2 = settings?.phone2 || PHONE_NUMBER_2;
  const phone2Display = settings?.phone2Display || DISPLAY_PHONE_2;
  const yearsExp = settings?.yearsExperience || YEARS_EXPERIENCE;

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
    { name: 'الرئيسية', href: '#hero' },
    { name: 'خدمات الصيانة', href: '#services' },
    { name: 'معرض الأجهزة', href: '#works' },
    { name: 'أجهزة للبيع', href: '#for-sale-section' },
    { name: 'آراء العملاء', href: '#reviews' },
    { name: 'لماذا نحن؟', href: '#why-us' },
    { name: 'الأسئلة الشائعة', href: '#faq' },
    { name: 'اتصل بنا', href: '#contact' },
  ];

  const quickNavItems = [
    {
      id: 'services',
      href: '#services',
      label: 'الخدمات والأسعار',
      icon: Wrench,
      highlight: false,
    },
    {
      id: 'works',
      href: '#works',
      label: 'معرض الأعمال والإنجازات',
      icon: Camera,
      badge: 'واقعي بالصور',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'for-sale-section',
      href: '#for-sale-section',
      label: 'أجهزة معروضة للبيع',
      icon: ShoppingBag,
      badge: 'بالضمان',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      isSpecial: true
    },
    {
      id: 'reviews',
      href: '#reviews',
      label: 'تقييمات وآراء العملاء',
      icon: Star,
      badge: '5 نجوم',
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'why-us',
      href: '#why-us',
      label: 'مزايا المركز والضمان',
      icon: ShieldCheck,
    },
    {
      id: 'faq',
      href: '#faq',
      label: 'الأسئلة الشائعة',
      icon: HelpCircle,
    },
    {
      id: 'contact',
      href: '#contact',
      label: 'الفروع والاتصال',
      icon: MapPin,
    }
  ];

  return (
    <>
      {/* Top Notification / Emergency Alert Bar */}
      {settings?.emergencyAlertEnabled && settings?.emergencyAlertText ? (
        <div id="emergency-alert-bar" className="bg-gradient-to-r from-amber-600 to-[#d97706] text-white text-xs py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>{settings.emergencyAlertText}</span>
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

      {/* Top Notification Bar & Developer Credit */}
      <div id="top-bar" className="bg-[#123b4a] text-white text-xs py-1.5 px-3 sm:px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Operating Hours & Experience */}
          <div className="flex items-center gap-3 sm:gap-4 text-slate-200">
            <span className="flex items-center gap-1 text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-[#d97706]" />
              {settings?.operatingHours || 'الزيارات المنزلية 8 ص–11 م • الخط الساخن والواتساب 24 ساعة'}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-amber-300 font-bold">
              <Award className="w-3.5 h-3.5" />
              خبرة +{yearsExp} سنة في الصيانة والتجديد
            </span>
          </div>

          {/* Developer Credit & Fast Contact */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px]">
            {/* Hotline 1 */}
            <a
              href={`tel:+${phone1}`}
              className="flex items-center gap-1 text-[#d97706] hover:text-white font-bold transition-colors"
              dir="ltr"
              title="اتصال بالرقم الأساسي"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone1Display}</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href={`tel:+${phone2}`}
              className="hidden sm:flex items-center gap-1 text-slate-200 hover:text-white font-bold transition-colors"
              dir="ltr"
              title="اتصال بالرقم الثاني"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span><span className="font-sans text-[10px] text-slate-400">اتصال:</span> {phone2Display}</span>
            </a>
          </div>

        </div>
      </div>

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
            <a href="#hero" id="header-logo" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#123b4a] to-[#174c5d] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-[#d97706]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-lg lg:text-xl text-[#123b4a] leading-tight lg:whitespace-nowrap">
                    {centerName}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black shrink-0">
                    +{yearsExp} سنة خبرة
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold flex items-center gap-1 lg:whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="truncate">صيانة معتمدة • قطع غيار أصلية</span>
                </span>
              </div>
            </a>

            {/* Desktop Full Navigation Links */}
            <nav id="primary-nav" className="hidden xl:flex items-center gap-3 2xl:gap-5">
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
              {/* Troubleshooting Button */}
              {onOpenTroubleshooting && (
                <button
                  type="button"
                  id="header-troubleshoot-btn"
                  onClick={onOpenTroubleshooting}
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
                  title="دليل فحص وتشخيص الأعطال السريع"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#d97706]" />
                  <span className="hidden lg:inline">دليل الأعطال</span>
                </button>
              )}

              {/* Safe Booking Tracker Button */}
              {onOpenTracker && (
                <button
                  type="button"
                  id="header-track-btn"
                  onClick={onOpenTracker}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#123b4a] bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                  title="متابعة حالة طلب الصيانة"
                >
                  <Search className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>متابعة الطلب</span>
                </button>
              )}

              {/* Admin Panel Button */}
              {onOpenAdmin && (
                <button
                  type="button"
                  id="header-admin-btn"
                  onClick={onOpenAdmin}
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                  title="دخول لوحة التحكم السحابية"
                >
                  <Lock className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>الإدارة</span>
                </button>
              )}

              {/* Hotline Call Button */}
              <a
                href={`tel:+${phone1}`}
                id="header-call-btn"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#123b4a] bg-slate-100 hover:bg-slate-200 transition-colors"
                title="اتصال فوري"
              >
                <Phone className="w-3.5 h-3.5 text-[#d97706]" />
                <span className="font-mono">{phone1Display}</span>
              </a>

              {/* Book Appointment CTA Button */}
              <button
                type="button"
                id="header-book-cta"
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] shadow-md shadow-[#d97706]/20 hover:shadow-lg hover:shadow-[#d97706]/30 transition-all transform active:scale-95 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">احجز صيانة</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu-drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Integrated Horizontal Quick Navigation Bar (أزرار وصول سريع بالعرض لكل الأقسام) */}
        <div id="quick-nav-bar" className="bg-slate-50/90 border-t border-slate-200/70 py-1.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <div id="quick-nav-items" className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 w-full">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 pl-1">
                <Sparkles className="w-3 h-3 text-[#d97706]" />
                <span>الوصول السريع:</span>
              </span>

              {quickNavItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = activeHash === item.href;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    id={`quick-nav-${item.id}`}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 whitespace-nowrap ${
                      item.isSpecial
                        ? 'bg-gradient-to-r from-[#123b4a] to-[#174c5d] text-white shadow-xs hover:shadow-md hover:scale-102'
                        : isCurrent
                        ? 'bg-[#123b4a] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.isSpecial ? 'text-[#d97706]' : isCurrent ? 'text-[#d97706]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}

              {/* Direct WhatsApp fast chat link */}
              <a
                href={`https://wa.me/${phone1}?text=مرحباً، أود الاستفسار عن خدمات الصيانة والأجهزة لدى ${encodeURIComponent(centerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 text-emerald-800 border border-emerald-300/40 shrink-0 whitespace-nowrap mr-auto transition-colors"
                title="محادثة واتساب مباشرة"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>واتساب فوري</span>
              </a>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-menu-drawer" className="xl:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-xl">
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

              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 text-white font-black text-sm transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#d97706]" />
                  <span>لوحة تحكم الإدارة السحابية</span>
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
                href={`https://wa.me/${phone1}?text=مرحباً، أود حجز مهندس صيانة من ${encodeURIComponent(centerName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                تواصل عبر واتساب (24 ساعة)
              </a>

              <div className="mt-2 border-t border-slate-100 pt-2 text-center text-[11px] text-slate-400">
                تصميم وتطوير: م/ صبحي
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
