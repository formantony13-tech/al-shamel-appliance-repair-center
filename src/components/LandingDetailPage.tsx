import React from 'react';
import { ArrowRight, Calendar, CheckCircle2, MapPin, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { AREA_LANDING_PAGES, AreaLandingPage, SERVICE_LANDING_PAGES, ServiceLandingPage } from '../data/landingPages';
import { AppSystemSettings } from '../types';
import { DISPLAY_PHONE_1, PHONE_NUMBER_1, CENTER_NAME } from '../config';

interface LandingDetailPageProps {
  page: ServiceLandingPage | AreaLandingPage;
  settings: AppSystemSettings;
  onBook: () => void;
}

const homeHash = () => {
  window.location.hash = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const LandingDetailPage: React.FC<LandingDetailPageProps> = ({ page, settings, onBook }) => {
  const phone = settings.phone1 || PHONE_NUMBER_1;
  const phoneDisplay = settings.phone1Display || DISPLAY_PHONE_1;
  const centerName = settings.centerName || CENTER_NAME;
  const isService = page.kind === 'service';
  const servicePage = page as ServiceLandingPage;
  const areaPage = page as AreaLandingPage;

  return (
    <div className="min-h-screen bg-[#f5f8fa] text-slate-800" dir="rtl">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={homeHash} className="flex min-w-0 items-center gap-2 text-right">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#123b4a] text-[#d97706] shadow-sm">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-[#123b4a] sm:text-base">{centerName}</span>
              <span className="block text-[10px] font-bold text-slate-500">صفحة معلومات تفصيلية</span>
            </span>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <a href={`tel:+${phone}`} dir="ltr" className="hidden items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-[#123b4a] sm:inline-flex">
              <Phone className="h-3.5 w-3.5 text-[#d97706]" /> {phoneDisplay}
            </a>
            <button type="button" onClick={onBook} className="inline-flex items-center gap-1.5 rounded-xl bg-[#d97706] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#b45309]">
              <Calendar className="h-3.5 w-3.5" /> احجز زيارة
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#123b4a] via-[#174c5d] to-[#0d2d38] px-4 py-14 text-white sm:px-6 lg:py-20">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#d97706]/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-[#fbbf24]">
                {isService ? <Wrench className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                {isService ? `خدمة ${servicePage.shortTitle}` : 'نطاق الخدمة والمناطق'}
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{page.title}</h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-8 text-slate-200 sm:text-base">{page.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={onBook} className="inline-flex items-center gap-2 rounded-xl bg-[#d97706] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#b45309] active:scale-95">
                  اطلب فنيًا الآن <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={homeHash} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                  العودة للموقع الرئيسي
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: ShieldCheck, title: 'ضمان معتمد', text: 'تفاصيل واضحة بعد الفحص' },
                { icon: Wrench, title: 'فني متخصص', text: 'تشخيص وإصلاح في مكانك' },
                { icon: Calendar, title: 'موعد منظم', text: 'تواصل سريع خلال 24 ساعة' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <Icon className="mb-2 h-5 w-5 text-[#fbbf24]" />
                  <h2 className="text-sm font-black">{title}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          {isService ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="rounded-xl bg-[#d97706]/10 p-3 text-[#d97706]"><CheckCircle2 className="h-6 w-6" /></span>
                  <div><h2 className="text-xl font-black text-[#123b4a]">أشهر الأعطال التي نعالجها</h2><p className="text-xs font-semibold text-slate-500">تشخيص واضح قبل تنفيذ الإصلاح</p></div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {servicePage.problems.map((problem) => <li key={problem} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold leading-7 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{problem}</li>)}
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
                <h2 className="text-xl font-black text-[#123b4a]">الماركات التي نخدمها</h2>
                <div className="mt-5 flex flex-wrap gap-2">{servicePage.brands.map((brand) => <span key={brand} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-600">{brand}</span>)}</div>
                <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-black text-emerald-800">{servicePage.warranty}</p></div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
                <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-[#d97706]/10 p-3 text-[#d97706]"><MapPin className="h-6 w-6" /></span><h2 className="text-xl font-black text-[#123b4a]">المناطق التي نخدمها</h2></div>
                <div className="flex flex-wrap gap-2">{areaPage.cities.map((city) => <span key={city} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">{city}</span>)}</div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8"><h2 className="text-xl font-black text-[#123b4a]">خدمات الصيانة المتاحة</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{areaPage.services.map((service) => <li key={service} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold leading-7 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{service}</li>)}</ul></div>
            </div>
          )}

          <div className="mt-10 rounded-3xl bg-[#123b4a] p-6 text-center text-white shadow-xl sm:p-8">
            <h2 className="text-2xl font-black">هل تحتاج إلى فني من {centerName}؟</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-300">أرسل بيانات الجهاز والعطل من نموذج الحجز، وسيتواصل معك فريق الصيانة لتأكيد الموعد والتفاصيل.</p>
            <button type="button" onClick={onBook} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#d97706] px-6 py-3 font-black text-white transition hover:bg-[#b45309]"><Calendar className="h-4 w-4" /> ابدأ طلب الصيانة</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export { SERVICE_LANDING_PAGES, AREA_LANDING_PAGES };
