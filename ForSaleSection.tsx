import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Info,
  ChevronRight,
  X,
  Clock
} from 'lucide-react';
import { ApplianceForSale, ForSaleCategory, AppSystemSettings } from '../types';
import { fetchAllForSaleItems } from '../lib/dbService';

interface ForSaleSectionProps {
  settings: AppSystemSettings;
}

const CATEGORIES: { label: string; value: ForSaleCategory }[] = [
  { label: 'جميع الأجهزة', value: 'الكل' },
  { label: 'ثلاجات', value: 'ثلاجات' },
  { label: 'غسالات', value: 'غسالات' },
  { label: 'ديب فريزر', value: 'ديب فريزر' },
  { label: 'بوتاجازات', value: 'بوتاجازات' },
  { label: 'تكييفات', value: 'تكييفات' }
];

export const ForSaleSection: React.FC<ForSaleSectionProps> = ({ settings }) => {
  const [items, setItems] = useState<ApplianceForSale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ForSaleCategory>('الكل');
  const [selectedItem, setSelectedItem] = useState<ApplianceForSale | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const data = await fetchAllForSaleItems();
        setItems(data);
      } catch (err) {
        console.error('Error loading for-sale items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'الكل') return true;
    return item.category === selectedCategory;
  });

  const getStatusBadge = (status: ApplianceForSale['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            متاح للشراء فوراً
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            محجوز لعميل
          </span>
        );
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            تم البيع
          </span>
        );
    }
  };

  const getWhatsAppBuyLink = (item: ApplianceForSale) => {
    const text = encodeURIComponent(
      `السلام عليكم يا مركز قطب، أرغب في الاستفسار وشراء الجهاز المعروض:\n- الجهاز: ${item.title}\n- الماركة: ${item.brand}\n- السعر: ${item.price.toLocaleString('ar-EG')} ج.م\n- كود الجهاز: ${item.id}\nهل ما زال متاحاً وكيفية المعاينة والتوصيل؟`
    );
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <section id="for-sale-section" className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden border-t border-slate-200/80">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 border border-primary/20 shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            <span>سوق الأجهزة المجددة بالضمان المعتمد</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
            معروضات أجهزة منزلية بحالة الزيرو مع ضمان المركز
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            ثلاجات، غسالات، وديب فريزر مفحوصة بدقة من فنيين معتمدين، بقطع غيار أصلية وبأسعار تنافسية توفر لك أكثر من 50% مع ضمان رسمي وفاتورة معتمدة.
          </p>

          {/* Guarantee Highlights Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ضمان شامل من 6 شهور إلى سنة</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>فحص واختبار تبريد وتشغيل 48 ساعة</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>معاينة حقيقية وتوصيل للمنزل</span>
            </div>
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              id={`for-sale-filter-${cat.value}`}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
                <div className="h-56 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">لا توجد أجهزة معروضة في هذا القسم حالياً</h3>
            <p className="text-sm text-slate-500 mb-6">
              يتم تحديث المعروضات أسبوعياً. يمكنك التواصل معنا مباشرة لطلب مواصفات جهاز معين وسنوفر لك أفضل خيار مع الضمان.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أرغب في الاستفسار عن الأجهزة المنزلية المتاحة للبيع لدى مركزكم.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>اسأل عن جهازك عبر واتساب</span>
            </a>
          </div>
        ) : (
          /* Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => {
              const discountPercent = item.originalPrice 
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : null;

              return (
                <div
                  key={item.id}
                  id={`for-sale-card-${item.id}`}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(item.status)}
                    </div>

                    {/* Discount Tag */}
                    {discountPercent && discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>وفر {discountPercent}%</span>
                      </div>
                    )}

                    {/* Brand Pill */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {item.brand}
                    </div>

                    {/* Quick View Overlay Button */}
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-primary" />
                        <span>عرض المواصفات والصور</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Condition */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span>{item.category}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">{item.condition}</span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => setSelectedItem(item)}
                        className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      {/* Key Specs */}
                      <ul className="space-y-1.5 mb-4 text-xs sm:text-sm text-slate-600">
                        {item.specs.slice(0, 3).map((spec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Warranty Badge */}
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold mb-5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.warranty}</span>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div>
                      <div className="flex items-baseline justify-between mb-4 border-t border-slate-100 pt-4">
                        <div>
                          <span className="text-xs text-slate-400 block mb-0.5">السعر بعد التجديد والفحص</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-slate-900">{item.price.toLocaleString('ar-EG')}</span>
                            <span className="text-xs font-bold text-slate-600">ج.م</span>
                          </div>
                        </div>
                        {item.originalPrice && (
                          <div className="text-left">
                            <span className="text-xs text-slate-400 block mb-0.5">السعر جديد بالسوق</span>
                            <span className="text-sm font-semibold text-slate-400 line-through">
                              {item.originalPrice.toLocaleString('ar-EG')} ج.م
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          id={`for-sale-whatsapp-${item.id}`}
                          href={getWhatsAppBuyLink(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>احجز عبر واتساب</span>
                        </a>

                        <a
                          id={`for-sale-call-${item.id}`}
                          href={`tel:${settings.phone1}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>اتصل للمعاينة</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-black mb-2">هل لديك جهاز قديم وترغب في استبداله أو بيعه؟</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              مركز قطب يقدم خدمة تثمين واستبدال الأجهزة المنزلية القديمة (ثلاجات، غسالات، فريزر) مع خصم قيمتها من صيانة جهازك أو استبدالها بجهاز مجدد بضمان.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، لدي جهاز قديم وأريد الاستفسار عن إمكانية بيعه أو استبداله لدى المركز.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استفسر عن التثمين والاستبدال</span>
            </a>
            <a
              href={`tel:${settings.phone1}`}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{settings.phone1Display}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8">
            {/* Modal Header & Image */}
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 right-4">
                {getStatusBadge(selectedItem.status)}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                <span>{selectedItem.category}</span>
                <span>•</span>
                <span>الماركة: {selectedItem.brand}</span>
                {selectedItem.model && (
                  <>
                    <span>•</span>
                    <span>الموديل: {selectedItem.model}</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 leading-snug">
                {selectedItem.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedItem.description}
              </p>

              {/* Technical Specifications */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>المواصفات الفنية وتقارير الفحص</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedItem.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-emerald-800 font-bold block">الضمان المعتمد</span>
                    <span className="text-xs text-emerald-950 font-semibold">{selectedItem.warranty}</span>
                  </div>
                </div>

                {selectedItem.location && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[11px] text-amber-800 font-bold block">موقع المعاينة والتوصيل</span>
                      <span className="text-xs text-amber-950 font-semibold">{selectedItem.location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Row & Call to Action */}
              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">السعر الإجمالي بضمان المركز</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">{selectedItem.price.toLocaleString('ar-EG')}</span>
                    <span className="text-sm font-bold text-slate-600">جنيه مصري</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={getWhatsAppBuyLink(selectedItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>تأكيد الحجز عبر واتساب</span>
                  </a>

                  <a
                    href={`tel:${settings.phone1}`}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>اتصال فوري</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
