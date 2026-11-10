import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { WorksGallery } from './components/WorksGallery';
import { ForSaleSection } from './components/ForSaleSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { Toast } from './components/Toast';
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
import { BookingTrackerModal } from './components/BookingTrackerModal';
import { WarrantyCertificateModal } from './components/WarrantyCertificateModal';
import { TroubleshootingGuideModal } from './components/TroubleshootingGuideModal';
import { LandingDetailPage } from './components/LandingDetailPage';
import { FAQSection } from './components/FAQSection';
import { getAreaLandingPage, getServiceLandingPage } from './data/landingPages';
import { ArrowLeft } from 'lucide-react';

import { RepairWork, CustomerReview, ToastNotification, BookingRecord, AppSystemSettings } from './types';
import { 
  seedInitialDataIfNeeded, 
  fetchAllWorks, 
  addWorkItem, 
  deleteWorkItem, 
  fetchAllReviews, 
  addCustomerReview, 
  deleteCustomerReview,
  fetchSystemSettings 
} from './lib/dbService';
import { testConnection } from './lib/firebase';
import { INITIAL_WORKS, INITIAL_SETTINGS } from './data/initialData';

export default function App() {
  const [works, setWorks] = useState<RepairWork[]>(INITIAL_WORKS);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<AppSystemSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin Dashboard Modal State
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(() => window.location.hash === '#/admin');

  // Booking Tracker Modal State
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);

  // Warranty Certificate Modal State
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState<boolean>(false);
  const [selectedWarrantyBooking, setSelectedWarrantyBooking] = useState<BookingRecord | null>(null);

  // Troubleshooting Guide Modal State
  const [isTroubleshootingOpen, setIsTroubleshootingOpen] = useState<boolean>(false);

  // Booking initial device & issue selected
  const [selectedDeviceForBooking, setSelectedDeviceForBooking] = useState('ديب فريزر');
  const [selectedIssueForBooking, setSelectedIssueForBooking] = useState('');

  // Toast notifications queue
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [hashRoute, setHashRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const nextHash = window.location.hash;
      setHashRoute(nextHash);
      setIsAdminDashboardOpen(nextHash === '#/admin');
      if (nextHash === '#for-sale-section') {
        window.setTimeout(() => document.getElementById('for-sale-section')?.scrollIntoView({ behavior: 'smooth' }), 60);
      }
      if (nextHash === '#/#services') {
        window.setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load from Central Firestore Database on Startup
  useEffect(() => {
    async function initData() {
      try {
        setIsLoading(true);
        // Test connection non-blockingly
        testConnection().catch(() => {});
        await seedInitialDataIfNeeded();
        const [loadedWorks, loadedReviews, loadedSettings] = await Promise.all([
          fetchAllWorks(),
          fetchAllReviews(),
          fetchSystemSettings()
        ]);
        if (loadedWorks && loadedWorks.length > 0) {
          setWorks(loadedWorks);
        }
        setReviews(loadedReviews || []);
        if (loadedSettings) {
          setSettings(loadedSettings);
        }
      } catch (err) {
        console.error('Error loading initial data from Firestore:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastNotification = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add work handler (Persisted to Cloud Firestore)
  const handleAddWork = async (newWorkData: Omit<RepairWork, 'id'>) => {
    try {
      const created = await addWorkItem(newWorkData);
      setWorks((prev) => [created, ...prev]);
      showToast('تمت إضافة عمل الصيانة الجديد بنجاح وحفظه في قاعدة البيانات السحابية!', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ العمل في قاعدة البيانات', 'error');
    }
  };

  // Delete work handler
  const handleDeleteWork = async (id: string) => {
    try {
      await deleteWorkItem(id);
      setWorks((prev) => prev.filter((w) => w.id !== id));
      showToast('تم حذف عمل الصيانة من قاعدة البيانات بنجاح', 'info');
    } catch (err) {
      showToast('فشل حذف العمل', 'error');
    }
  };

  // Add review handler (Persisted to Cloud Firestore)
  const handleAddReview = async (newReviewData: Omit<CustomerReview, 'id' | 'avatarLetter' | 'verified' | 'status' | 'createdAt'>) => {
    await addCustomerReview(newReviewData);
  };

  // Delete review handler
  const handleDeleteReview = async (id: string) => {
    try {
      await deleteCustomerReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('تم حذف التقييم بنجاح', 'info');
    } catch (err) {
      showToast('فشل حذف التقييم', 'error');
    }
  };

  // Open Warranty Certificate Modal
  const handleOpenWarrantyCertificate = (booking: BookingRecord) => {
    setSelectedWarrantyBooking(booking);
    setIsWarrantyModalOpen(true);
  };

  // Select diagnostic issue from Troubleshooting Guide
  const handleSelectDiagnosticIssue = (deviceCategory: string, issueText: string) => {
    setSelectedDeviceForBooking(deviceCategory);
    setSelectedIssueForBooking(issueText);
    showToast(`تم اختيار العطل: ${issueText}، يُرجى استكمال بياناتك للتأكيد`, 'info');
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to booking with pre-selected device
  const handleSelectService = (serviceCategory: string) => {
    setSelectedDeviceForBooking(serviceCategory);
    window.location.hash = '#/reviews-contact';
    window.setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleOpenBooking = () => {
    window.location.hash = '#/reviews-contact';
    window.setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const openServicePage = (serviceId: string) => {
    window.location.hash = `#/service/${serviceId}`;
  };

  const openAreaPage = (areaId: string) => {
    window.location.hash = `#/area/${areaId}`;
  };

  const closeAdminDashboard = () => {
    setIsAdminDashboardOpen(false);
    if (window.location.hash === '#/admin') window.location.hash = '#/';
  };

  const serviceRoute = hashRoute.match(/^#\/service\/([^/]+)$/);
  const areaRoute = hashRoute.match(/^#\/area\/([^/]+)$/);
  const pageRoute = hashRoute === '#/works' ? 'works' : hashRoute === '#/reviews-contact' ? 'reviews-contact' : 'home';
  const detailPage = serviceRoute
    ? getServiceLandingPage(serviceRoute[1])
    : areaRoute
      ? getAreaLandingPage(areaRoute[1])
      : undefined;

  if (detailPage) {
    return (
      <LandingDetailPage
        page={detailPage}
        settings={settings}
        onBook={() => {
          window.location.hash = '';
          window.setTimeout(() => {
            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
      />
    );
  }

  const headerProps = {
    onOpenBooking: handleOpenBooking,
    onOpenTracker: () => setIsTrackerOpen(true),
    onOpenTroubleshooting: () => setIsTroubleshootingOpen(true),
    settings,
  };

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
        <Header {...headerProps} />
        <main className="min-h-[60vh]">
          {pageRoute === 'home' && (
            <>
              <Hero onOpenBooking={handleOpenBooking} settings={settings} />
              <ServicesSection onSelectService={handleSelectService} onOpenService={openServicePage} />
              <WhyUsSection settings={settings} />
              <ForSaleSection settings={settings} />
              <section className="px-4 py-10 text-center sm:px-6 lg:px-8">
                <a href="#/works" className="inline-flex items-center gap-2 rounded-xl bg-[#123b4a] px-6 py-3 text-sm font-black text-white shadow-md transition hover:bg-[#174c5d]">شاهد أعمالنا <ArrowLeft className="h-4 w-4" /></a>
              </section>
            </>
          )}

          {pageRoute === 'works' && (
            <WorksGallery works={works} onAddWork={handleAddWork} onDeleteWork={handleDeleteWork} isAdmin={false} onShowToast={showToast} />
          )}

          {pageRoute === 'reviews-contact' && (
            <>
              <ReviewsSection reviews={reviews} onAddReview={handleAddReview} onDeleteReview={handleDeleteReview} isAdmin={false} onShowToast={showToast} />
              <FAQSection />
              <BookingSection initialDevice={selectedDeviceForBooking} initialIssue={selectedIssueForBooking} onShowToast={showToast} onOpenTracker={() => setIsTrackerOpen(true)} onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)} onViewWarrantyCertificate={handleOpenWarrantyCertificate} />
              <ContactSection settings={settings} onOpenArea={openAreaPage} />
            </>
          )}
        </main>
        <Footer settings={settings} />
        <FloatingActions settings={settings} />
      </div>

      {/* Toast Notification Manager */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Admin Dashboard Modal */}
      {isAdminDashboardOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="status" aria-live="polite">
              <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-2xl">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0f3d5e]" aria-hidden="true" />
                <p className="font-bold text-slate-700">جارٍ تحميل لوحة الإدارة...</p>
              </div>
            </div>
          }
        >
          <AdminDashboard
            onClose={closeAdminDashboard}
            onShowToast={showToast}
            onViewWarrantyCertificate={handleOpenWarrantyCertificate}
            settings={settings}
            onSettingsUpdated={(updatedSettings) => setSettings(updatedSettings)}
          />
        </Suspense>
      )}

      {/* Customer Booking Tracker Modal */}
      <BookingTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onShowToast={showToast}
        onViewWarrantyCertificate={handleOpenWarrantyCertificate}
      />

      {/* Printable Maintenance Warranty Certificate Modal */}
      <WarrantyCertificateModal
        isOpen={isWarrantyModalOpen}
        onClose={() => setIsWarrantyModalOpen(false)}
        booking={selectedWarrantyBooking}
      />

      {/* Quick Troubleshooting & Diagnostics Guide Modal */}
      <TroubleshootingGuideModal
        isOpen={isTroubleshootingOpen}
        onClose={() => setIsTroubleshootingOpen(false)}
        onSelectIssueForBooking={handleSelectDiagnosticIssue}
      />
    </>
  );
}
