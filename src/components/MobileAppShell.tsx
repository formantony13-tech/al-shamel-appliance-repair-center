import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  ChevronLeft,
  CircleHelp,
  Home,
  MessageCircle,
  Phone,
  LockKeyhole,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Wrench,
  X,
} from 'lucide-react';
import { ReviewsSection } from './ReviewsSection';
import { ForSaleSection } from './ForSaleSection';
import { ContactSection } from './ContactSection';
import { FAQSection } from './FAQSection';
import { BookingSection } from './BookingSection';
import { RepairWork, CustomerReview, AppSystemSettings, BookingRecord, ToastNotification } from '../types';
import { CENTER_NAME, DISPLAY_PHONE_1, PHONE_NUMBER_1 } from '../config';

interface MobileAppShellProps {
  settings: AppSystemSettings;
  works: RepairWork[];
  reviews: CustomerReview[];
  selectedDevice: string;
  selectedIssue: string;
  onSelectService: (service: string) => void;
  onOpenService: (serviceId: string) => void;
  onAddReview: (review: Omit<CustomerReview, 'id' | 'avatarLetter'>) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
  onShowToast: (message: string, type?: ToastNotification['type']) => void;
  onOpenTracker: () => void;
  onOpenTroubleshooting: () => void;
  onViewWarrantyCertificate: (booking: BookingRecord) => void;
  onOpenAdmin: () => void;
}

type MobilePanel = 'home' | 'services' | 'reviews' | 'sale' | 'contact' | 'booking' | 'faq';

const serviceTabs = [
  { id: 'washing', label: 'غسالات', icon: 'غ' },
  { id: 'cooling', label: 'ثلاجات وفريزر', icon: 'ث' },
  { id: 'other', label: 'تكييف وأفران', icon: 'ت' },
];

export const MobileAppShell: React.FC<MobileAppShellProps> = (props) => {
  const [panel, setPanel] = useState<MobilePanel>('home');
  const [serviceTab, setServiceTab] = useState('washing');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const centerName = props.settings.centerName || CENTER_NAME;
  const phone = props.settings.phone1 || PHONE_NUMBER_1;
  const phoneDisplay = props.settings.phone1Display || DISPLAY_PHONE_1;

  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSheetOpen]);

  const openPanel = (nextPanel: MobilePanel) => {
    setPanel(nextPanel);
    setIsSheetOpen(nextPanel !== 'home');
  };

  const closeSheet = () => {
    setPanel('home');
    setIsSheetOpen(false);
  };

  const panelTitle: Record<Exclude<MobilePanel, 'home'>, string> = {
    services: 'خدمات الصيانة',
    reviews: 'آراء العملاء',
    sale: 'الأجهزة المجددة للبيع',
    contact: 'التواصل والحجز',
    booking: 'طلب حجز زيارة',
    faq: 'الأسئلة الشائعة',
  };

  const serviceSummary: Record<string, { title: string; text: string; action: string }> = {
    washing: { title: 'صيانة الغسالات', text: 'أعطال العصر والطرد والتسريب والكارتة ورولمان البلي، مع فحص الجهاز في المنزل حسب الحالة.', action: 'احجز فني غسالات' },
    cooling: { title: 'الثلاجات والديب فريزر', text: 'ضعف التبريد، تسريب الفريون، تراكم الثلج، الكمبروسر وعلاج البرومة وتجديد الصاج.', action: 'احجز فني تبريد' },
    other: { title: 'التكييفات والأفران', text: 'غسيل وشحن فريون التكييف، وصيانة البوتاجاز والسخان والفرن حسب نطاق الزيارة.', action: 'اطلب استشارة' },
  };

  const renderPanelContent = () => {
    if (panel === 'services') {
      const summary = serviceSummary[serviceTab];
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="تصنيفات الخدمات">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={serviceTab === tab.id}
                onClick={() => setServiceTab(tab.id)}
                className={`rounded-xl px-2 py-3 text-[11px] font-black transition ${serviceTab === tab.id ? 'bg-white text-[#123b4a] shadow-sm' : 'text-slate-500'}`}
              >
                <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#d97706]/10 text-[#d97706]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 text-right shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123b4a] text-white"><Wrench className="h-6 w-6 text-[#d97706]" /></div>
              <h3 className="text-lg font-black text-[#123b4a]">{summary.title}</h3>
            </div>
            <p className="text-sm font-semibold leading-7 text-slate-600">{summary.text}</p>
            <button type="button" onClick={() => { closeSheet(); props.onSelectService(summary.title); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d97706] px-4 py-3 text-sm font-black text-white">{summary.action}<ChevronLeft className="h-4 w-4" /></button>
          </div>
          <button type="button" onClick={() => { closeSheet(); props.onOpenTroubleshooting(); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#123b4a]/15 bg-[#123b4a]/5 px-4 py-3 text-sm font-black text-[#123b4a]"><CircleHelp className="h-4 w-4" />دليل فحص العطل قبل الحجز</button>
        </div>
      );
    }
    if (panel === 'reviews') return <ReviewsSection reviews={props.reviews} onAddReview={props.onAddReview} onDeleteReview={props.onDeleteReview} isAdmin={false} onShowToast={props.onShowToast} />;
    if (panel === 'sale') return <ForSaleSection settings={props.settings} />;
    if (panel === 'faq') return <FAQSection />;
    if (panel === 'booking') return <BookingSection initialDevice={props.selectedDevice} initialIssue={props.selectedIssue} onShowToast={props.onShowToast} onOpenTracker={props.onOpenTracker} onOpenTroubleshooting={props.onOpenTroubleshooting} onViewWarrantyCertificate={props.onViewWarrantyCertificate} />;
    return <ContactSection settings={props.settings} onOpenArea={props.onOpenService} />;
  };

  return (
    <div className="mobile-app-shell min-h-[100svh] bg-[#f8fafc] pb-24 text-[#1e293b]" dir="rtl">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 pb-3 pt-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-[#d97706]">خدمة منزلية في البحيرة</p>
            <h1 className="truncate text-lg font-black text-[#123b4a]">{centerName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={props.onOpenAdmin} aria-label="دخول الإدارة" className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-[#123b4a]"><LockKeyhole className="h-4 w-4" /></button>
            <a href={`tel:+${phone}`} aria-label="اتصال سريع" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#123b4a] text-white shadow-md"><Phone className="h-5 w-5 text-[#d97706]" /></a>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">
          <span>الزيارات 8 ص–11 م</span><span className="text-emerald-700">الرد 24 ساعة</span><span dir="ltr">{phoneDisplay}</span>
        </div>
      </header>

      <main className="px-4 pt-4">
        {panel === 'home' && (
          <div className="space-y-4">
            <section className="rounded-[2rem] bg-gradient-to-br from-[#123b4a] to-[#174c5d] p-5 text-white shadow-lg">
              <div className="mb-3 flex items-center gap-2 text-xs font-black text-amber-300"><ShieldCheck className="h-4 w-4" />قطع غيار أصلية وتفاصيل الضمان قبل الإصلاح</div>
              <h2 className="text-2xl font-black leading-[1.45]">حل سريع لمشكلة جهازك<br /><span className="text-[#f59e0b]">من غير لف ودوران</span></h2>
              <p className="mt-2 text-xs font-semibold leading-6 text-slate-200">اختار الخدمة أو تواصل معنا مباشرة، وسيتم تنسيق الزيارة حسب المنطقة والموعد المتاح.</p>
              <button type="button" onClick={() => openPanel('booking')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d97706] px-4 py-3 text-sm font-black text-white"><CalendarCheck className="h-4 w-4" />اطلب حجز زيارة</button>
            </section>

            <section className="grid grid-cols-2 gap-3" aria-label="اختصارات الموقع">
              <button type="button" onClick={() => openPanel('services')} className="app-card app-card-tall bg-blue-50 text-right"><Wrench className="h-7 w-7 text-blue-700" /><strong>خدماتنا</strong><span>غسالات وثلاجات وأجهزة</span><ChevronLeft className="absolute left-3 top-4 h-4 w-4 text-blue-400" /></button>
              <button type="button" onClick={() => openPanel('reviews')} className="app-card app-card-tall bg-amber-50 text-right"><Star className="h-7 w-7 fill-amber-500 text-amber-500" /><strong>آراء العملاء</strong><span>تجارب وتقييمات المركز</span><ChevronLeft className="absolute left-3 top-4 h-4 w-4 text-amber-400" /></button>
              <button type="button" onClick={() => openPanel('sale')} className="app-card bg-emerald-50 text-right"><ShoppingBag className="h-6 w-6 text-emerald-700" /><strong>أجهزة للبيع</strong><span>أجهزة مجددة بالضمان</span></button>
              <button type="button" onClick={() => openPanel('contact')} className="app-card bg-violet-50 text-right"><MessageCircle className="h-6 w-6 text-violet-700" /><strong>تواصل معنا</strong><span>واتساب واتصال وحجز</span></button>
              <button type="button" onClick={() => openPanel('faq')} className="app-card bg-slate-100 text-right"><CircleHelp className="h-6 w-6 text-[#123b4a]" /><strong>أسئلة شائعة</strong><span>التكلفة والضمان والنطاق</span></button>
              <button type="button" onClick={props.onOpenTracker} className="app-card bg-orange-50 text-right"><Search className="h-6 w-6 text-orange-700" /><strong>تتبع الحجز</strong><span>اعرف حالة طلبك</span></button>
            </section>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div><p className="text-xs font-black text-[#123b4a]">تحتاج تشخيصاً سريعاً؟</p><p className="mt-1 text-[11px] font-semibold text-slate-500">أرسل صورة العطل للمهندس</p></div>
              <button type="button" onClick={props.onOpenTroubleshooting} className="rounded-xl bg-[#123b4a] px-3 py-2 text-[11px] font-black text-white">دليل الأعطال</button>
            </div>
          </div>
        )}
      </main>

      {isSheetOpen && panel !== 'home' && (
        <div className="fixed inset-0 z-50 bg-slate-950/55" onClick={closeSheet}>
          <section className="mobile-bottom-sheet absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-[2rem] bg-[#f8fafc] px-4 pb-8 pt-3 shadow-2xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={panelTitle[panel as Exclude<MobilePanel, 'home'>]}>
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-[#f8fafc]/95 py-2 backdrop-blur-md">
              <button type="button" onClick={closeSheet} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm" aria-label="إغلاق"><X className="h-5 w-5" /></button>
              <h2 className="text-lg font-black text-[#123b4a]">{panelTitle[panel as Exclude<MobilePanel, 'home'>]}</h2>
              <span className="w-9" />
            </div>
            {renderPanelContent()}
          </section>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-5px_20px_rgba(15,61,94,0.08)] backdrop-blur-md" aria-label="التنقل الرئيسي">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {([
            ['home', Home, 'الرئيسية'], ['services', Wrench, 'خدماتنا'], ['reviews', Star, 'الآراء'], ['sale', ShoppingBag, 'أجهزة للبيع'], ['contact', Phone, 'اتصل بنا'],
          ] as const).map(([id, Icon, label]) => (
            <button key={id} type="button" onClick={() => openPanel(id)} className={`flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-black transition ${panel === id && !isSheetOpen ? 'bg-[#123b4a] text-white' : 'text-slate-500'}`} aria-current={panel === id && !isSheetOpen ? 'page' : undefined}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
