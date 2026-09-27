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
import { INITIAL_WORKS, INITIAL_REVIEWS, INITIAL_SETTINGS } from './data/initialData';

export default function App() {
  const [works, setWorks] = useState<RepairWork[]>(INITIAL_WORKS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [settings, setSettings] = useState<AppSystemSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin Dashboard Modal State
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

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
        if (loadedReviews && loadedReviews.length > 0) {
          setReviews(loadedReviews);
        }
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
  const handleAddReview = async (newReviewData: Omit<CustomerReview, 'id' | 'avatarLetter'>) => {
    try {
      const created = await addCustomerReview(newReviewData);
      setReviews((prev) => [created, ...prev]);
      showToast('شكراً جزيلاً لتقييمك! تم حفظ رأيك في قاعدة البيانات ونشره بنجاح ⭐', 'success');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ التقييم', 'error');
    }
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
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#1e293b]">
      {/* Sticky Header with Integrated Horizontal Quick Navigation */}
      <Header 
        onOpenBooking={handleOpenBooking} 
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        settings={settings}
      />

      {/* Main Single Page Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} settings={settings} />

        {/* 2. Services Section */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 3. Why Us Section */}
        <WhyUsSection settings={settings} />

        {/* 4. Works Gallery (Connected to Central Firestore) */}
        <WorksGallery
          works={works}
          onAddWork={handleAddWork}
          onDeleteWork={handleDeleteWork}
          isAdmin={false}
          onShowToast={showToast}
        />

        {/* 5. For Sale Marketplace Section */}
        <ForSaleSection settings={settings} />

        {/* 6. Reviews Section (Connected to Central Firestore) */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
          isAdmin={false}
          onShowToast={showToast}
        />

        {/* 6. Booking Form Section (With Central DB and Unique ID) */}
        <BookingSection
          initialDevice={selectedDeviceForBooking}
          initialIssue={selectedIssueForBooking}
          onShowToast={showToast}
          onOpenTracker={() => setIsTrackerOpen(true)}
          onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)}
          onViewWarrantyCertificate={handleOpenWarrantyCertificate}
        />

        {/* 7. Contact & Location Section */}
        <ContactSection settings={settings} />
      </main>

      {/* Footer & Admin Link */}
      <Footer
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        settings={settings}
      />

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingActions settings={settings} />

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
            onClose={() => setIsAdminDashboardOpen(false)}
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
    </div>
  );
}
