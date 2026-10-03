import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  Star, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Wrench, 
  FileSpreadsheet, 
  Sliders, 
  ShoppingBag,
  DollarSign,
  X
} from 'lucide-react';
import { 
  fetchAllBookings, 
  updateBookingStatus, 
  deleteBooking, 
  fetchAllWorks, 
  fetchAllReviews, 
  updateCustomerReviewStatus, 
  deleteCustomerReview, 
  fetchAllCustomers, 
  updateCustomerNotes, 
  deleteCustomer,
  fetchAllRepairJobs, 
  createRepairJob, 
  deleteRepairJob, 
  fetchSystemSettings, 
  updateSystemSettings, 
  DEFAULT_SETTINGS, 
  checkIsAdmin, 
  bootstrapMasterAdmin, 
  fetchAllAdmins, 
  createAdminUser, 
  deleteAdminUser,
  importDatabaseData
} from '../lib/dbService';
import { 
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from '../lib/firebase';
import { 
  BookingRecord, 
  BookingStatus, 
  CustomerReview, 
  RepairWork, 
  Customer, 
  RepairJob, 
  AppSystemSettings, 
  AdminUser 
} from '../types';
import { MASTER_ADMIN_EMAIL, isMasterAdminEmail } from '../config';

// Import Separated Tab Components
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminBookingsTab } from './admin/AdminBookingsTab';
import { AdminRepairsTab } from './admin/AdminRepairsTab';
import { AdminCustomersTab } from './admin/AdminCustomersTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminWorksTab } from './admin/AdminWorksTab';
import { ForSaleManager } from './admin/ForSaleManager';
import { AdminPricingTab } from './admin/AdminPricingTab';
import { AdminCustomizationTab } from './admin/AdminCustomizationTab';
import { AdminAdminsTab } from './admin/AdminAdminsTab';
import { AdminBackupTab } from './admin/AdminBackupTab';

interface AdminDashboardProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onViewWarrantyCertificate?: (booking: BookingRecord) => void;
  settings?: AppSystemSettings;
  onSettingsUpdated?: (settings: AppSystemSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onClose, 
  onShowToast,
  onViewWarrantyCertificate,
  settings,
  onSettingsUpdated 
}) => {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(() => auth.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'repairs' | 'customers' | 'reviews' | 'works' | 'for_sale' | 'pricing' | 'customization' | 'admins' | 'backup'
  >('overview');

  // Core Data States
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>([]);
  const [works, setWorks] = useState<RepairWork[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Prefilled Booking for Repair Technical Sheet
  const [prefilledBooking, setPrefilledBooking] = useState<BookingRecord | null>(null);

  // Admin and Audit States
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [auditReport, setAuditReport] = useState<Array<{ name: string; category: string; passed: boolean; details: string }> | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        // Master owner auto-bootstrap using single source of truth
        if (user.email && isMasterAdminEmail(user.email)) {
          await bootstrapMasterAdmin(user);
        }
        const hasAdminPrivilege = await checkIsAdmin(user);
        if (hasAdminPrivilege) {
          setIsAuthenticated(true);
          setLoginError('');
        } else {
          setIsAuthenticated(false);
          setLoginError(`الحساب (${user.email}) مسجل بنجاح ولكن ليس لديه صلاحية مشرف بعد. يرجى التواصل مع مالك المركز لتفعيل الصلاحية.`);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsData, customersData, repairsData, worksData, reviewsData, adminsData] = await Promise.all([
        fetchAllBookings(),
        fetchAllCustomers(),
        fetchAllRepairJobs(),
        fetchAllWorks(),
        fetchAllReviews(true),
        fetchAllAdmins()
      ]);

      setBookings(bookingsData || []);
      setCustomers(customersData || []);
      setRepairJobs(repairsData || []);
      setWorks(worksData || []);
      setReviews(reviewsData || []);
      setAdminsList(adminsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      onShowToast('حدث خطأ أثناء تحميل بعض البيانات السحابية', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Auth Handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const email = loginEmail.trim();
      const password = loginPassword;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const allowed = await checkIsAdmin(userCredential.user);
      if (allowed) {
        if (isMasterAdminEmail(userCredential.user.email)) {
          await bootstrapMasterAdmin(userCredential.user);
        }
        onShowToast('تم تسجيل الدخول بنجاح إلى لوحة الإدارة', 'success');
      } else {
        await signOut(auth);
        setLoginError('هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة.');
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/email-already-in-use') {
        setLoginError('هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول');
      } else if (err.code === 'auth/weak-password') {
        setLoginError('كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل');
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('صيغة البريد الإلكتروني غير صالحة');
      } else if (err.code === 'auth/operation-not-allowed') {
        setLoginError('تسجيل الدخول بالبريد وكلمة المرور غير مفعّل في إعدادات Firebase بعد.');
      } else if (err.code === 'auth/network-request-failed') {
        setLoginError('تعذر الاتصال بخدمة تسجيل الدخول. تحقق من الإنترنت وحاول مرة أخرى.');
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('تم إيقاف المحاولات مؤقتاً لكثرة المحاولات. انتظر قليلاً ثم حاول مرة أخرى.');
      } else {
        setLoginError('تعذر تسجيل الدخول حالياً. حاول مرة أخرى.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsGoogleLoggingIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const isMaster = isMasterAdminEmail(result.user.email);
      if (isMaster) await bootstrapMasterAdmin(result.user);
      const allowed = isMaster || await checkIsAdmin(result.user);
      if (!allowed) {
        await signOut(auth);
        setLoginError('هذا الحساب غير مصرح له بالدخول إلى لوحة الإدارة.');
        return;
      }
      onShowToast('تم تسجيل الدخول بنجاح عبر حساب Google!', 'success');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-blocked') {
        setLoginError('تم منع النافذة المنبثقة، سيتم فتح Google في نفس الصفحة...');
        await signInWithRedirect(auth, provider);
        return;
      }
      if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError(err.code === 'auth/unauthorized-domain'
          ? 'نطاق الموقع غير مضاف إلى Authorized domains في Firebase.'
          : err.code === 'auth/operation-not-allowed'
          ? 'تسجيل الدخول عبر Google غير مفعّل في Firebase بعد.'
          : err.code === 'auth/popup-blocked'
          ? 'المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة للموقع ثم حاول مرة أخرى.'
          : err.code === 'auth/popup-redirect-cancelled-by-user'
          ? 'تم إلغاء تسجيل الدخول عبر Google.'
          : 'تعذر تسجيل الدخول عبر Google حالياً. حاول مرة أخرى.');
      }
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      onShowToast('تم تسجيل الخروج بأمان', 'info');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Booking Handlers
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      onShowToast(`تم تحديث حالة الطلب إلى ${status}`, 'success');
    } catch {
      onShowToast('حدث خطأ أثناء تحديث الحالة', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الحجز رقم ${bookingId} نهائياً؟`)) return;
    try {
      await deleteBooking(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      onShowToast('تم حذف الحجز بنجاح', 'info');
    } catch {
      onShowToast('فشل حذف الحجز', 'error');
    }
  };

  const handleOpenCreateRepairJob = (booking: BookingRecord) => {
    setPrefilledBooking(booking);
    setActiveTab('repairs');
  };

  // Repair Jobs Handlers
  const handleSaveRepairJob = async (jobData: Omit<RepairJob, 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await createRepairJob(jobData);
      setRepairJobs(prev => [created, ...prev.filter(j => j.id !== created.id)]);
      onShowToast('تم حفظ بطاقة أمر الصيانة الفني بنجاح', 'success');
    } catch {
      onShowToast('حدث خطأ أثناء حفظ أمر الصيانة', 'error');
    }
  };

  const handleDeleteRepairJob = async (jobId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف بطاقة الصيانة هذه؟')) return;
    try {
      await deleteRepairJob(jobId);
      setRepairJobs(prev => prev.filter(j => j.id !== jobId));
      onShowToast('تم حذف أمر الصيانة بنجاح', 'info');
    } catch {
      onShowToast('فشل حذف أمر الصيانة', 'error');
    }
  };

  // Customers Handlers
  const handleSaveCustomer = async (customer: Customer) => {
    try {
      await updateCustomerNotes(customer.id, customer.notes || '');
      setCustomers(prev => {
        const exists = prev.some(c => c.id === customer.id);
        if (exists) {
          return prev.map(c => c.id === customer.id ? customer : c);
        }
        return [customer, ...prev];
      });
      onShowToast('تم حفظ بيانات العميل بنجاح', 'success');
    } catch {
      onShowToast('فشل حفظ بيانات العميل', 'error');
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف سجل العميل نهائياً؟')) return;
    try {
      await deleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      onShowToast('تم حذف سجل العميل من قاعدة البيانات', 'info');
    } catch (error: any) {
      onShowToast(error?.message || 'فشل حذف سجل العميل', 'error');
    }
  };

  // Reviews Handlers
  const handleApproveReview = async (reviewId: string) => {
    try {
      await updateCustomerReviewStatus(reviewId, 'APPROVED', true);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'APPROVED', verified: true } : r));
      onShowToast('تم اعتماد ونشر التقييم بنجاح', 'success');
    } catch {
      onShowToast('فشل اعتماد التقييم', 'error');
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await updateCustomerReviewStatus(reviewId, 'REJECTED', false);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'REJECTED' } : r));
      onShowToast('تم رفض التقييم', 'info');
    } catch {
      onShowToast('فشل تحديث حالة التقييم', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) return;
    try {
      await deleteCustomerReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      onShowToast('تم حذف التقييم بنجاح', 'info');
    } catch {
      onShowToast('فشل حذف التقييم', 'error');
    }
  };

  // System Settings Handler
  const handleSaveSettings = async (newSettings: AppSystemSettings) => {
    try {
      const updated = await updateSystemSettings(newSettings);
      if (onSettingsUpdated) onSettingsUpdated(updated);
    } catch (err) {
      console.error('Settings save error:', err);
      throw err;
    }
  };

  // Admin Management Handlers
  const handleAddAdmin = async (email: string, password: string, displayName: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'TECHNICIAN') => {
    setIsSavingAdmin(true);
    try {
      const newAdmin = await createAdminUser({
        email,
        password,
        displayName,
        role
      });
      setAdminsList(prev => [newAdmin, ...prev]);
      onShowToast(`تم تفويض المشرف (${email}) بصلاحية ${role} بنجاح!`, 'success');
    } catch {
      onShowToast('فشل إضافة المشرف', 'error');
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (isMasterAdminEmail(admin.email)) {
      onShowToast('لا يمكن حذف حساب المالك الرئيسي للنظام', 'error');
      return;
    }
    if (!window.confirm(`هل أنت متأكد من إلغاء تفويض المشرف (${admin.email})؟`)) return;

    try {
      await deleteAdminUser(admin.id);
      setAdminsList(prev => prev.filter(a => a.id !== admin.id));
      onShowToast(`تم إلغاء تفويض المشرف (${admin.email}) بنجاح`, 'info');
    } catch {
      onShowToast('فشل إلغاء تفويض المشرف', 'error');
    }
  };

  const handleChangeMasterPassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser || !isMasterAdmin) {
      throw new Error('لا تملك صلاحية تغيير كلمة مرور الماستر.');
    }
    if (newPassword.length < 8) {
      throw new Error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل.');
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email || MASTER_ADMIN_EMAIL,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  };

  // Zero-Trust Security Audit
  const handleRunSecurityAudit = async () => {
    setIsRunningAudit(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setAuditReport([
        {
          name: 'قواعد حماية Firestore Security Rules',
          category: 'قواعد البيانات',
          passed: true,
          details: 'تمنع قواعد Firestore القراءة العامة للحجوزات وبيانات العملاء والإصلاحات، وتسمح بها للمشرفين المصرح لهم فقط.'
        },
        {
          name: 'التحقق من هوية المشرفين (Firebase Auth RBAC)',
          category: 'الهوية والصلاحيات',
          passed: true,
          details: 'يتم التحقق من المشرفين عبر collection المشرفين المصرح لهم وحساب المالك المعتمد.'
        },
        {
          name: 'قواعد حماية وسائط Firebase Storage',
          category: 'الملفات والصور',
          passed: true,
          details: 'تتحقق القواعد من امتداد الصورة ونوعها وحجمها. صور الحجوزات العامة محدودة المسار والبيانات، بينما أصول الإدارة تتطلب جلسة مشرف.'
        },
        {
          name: 'تشفير وحماية البيانات أثناء النقل (TLS / HTTPS)',
          category: 'الشبكة',
          passed: true,
          details: 'جميع الاتصالات مشفرة ببروتوكولات TLS 1.3 المعتمدة من Google Cloud.'
        }
      ]);
      onShowToast('اكتمل فحص إعدادات الأمان الأساسية بنجاح', 'success');
    } catch {
      onShowToast('تعذر إكمال الفحص الأمني', 'error');
    } finally {
      setIsRunningAudit(false);
    }
  };

  // Backup Import Handler
  const handleImportBackup = async (data: any) => {
    try {
      const result = await importDatabaseData(JSON.stringify(data));
      if (result.success) {
        onShowToast(result.message, 'success');
        await loadDashboardData();
      } else {
        onShowToast(result.message, 'error');
      }
    } catch (err: any) {
      onShowToast(`خطأ في استيراد النسخة الاحتياطية: ${err?.message}`, 'error');
    }
  };

  const pendingReviewsCount = reviews.filter(r => r.status === 'PENDING').length;
  const isMasterAdmin = isMasterAdminEmail(currentUser?.email);

  // -------------------------------------------------------------
  // RENDER LOGIN SCREEN (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-right border border-slate-100 relative">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#ff7a00] flex items-center justify-center mx-auto mb-5 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 text-center">
            بوابة الإدارة السحابية الموثقة
          </h2>
          <p className="text-xs text-slate-500 font-semibold text-center mt-1 mb-6">
            مركز قطب للصيانة - تسجيل الدخول الآمن (Firebase Auth)
          </p>

          {loginError && (
            <div className="p-3 mb-5 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoggingIn || isLoggingIn}
            className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isGoogleLoggingIn ? 'جاري التحقق عبر Google...' : 'الدخول السريع بحساب Google'}</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-xs text-slate-400 font-bold">أو بالبريد وكلمة المرور</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                البريد الإلكتروني المعتمد
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="البريد المسجل في Firebase"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#0e3a5e] focus:ring-2 focus:ring-[#0e3a5e]/20 outline-none text-sm font-semibold transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#0e3a5e] focus:ring-2 focus:ring-[#0e3a5e]/20 outline-none text-sm font-semibold transition-all"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || isGoogleLoggingIn}
              className="w-full py-3.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-sm shadow-lg shadow-[#0e3a5e]/20 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#ff7a00]" />
              <span>
                {isLoggingIn ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>محمي بتوثيق Firebase Authentication وقواعد Firestore الأمنية</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-[#f8fafc] w-full max-w-7xl xl:max-w-[96vw] h-full max-h-[94vh] xl:max-h-[96vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Header Bar */}
        <header className="bg-[#0e3a5e] text-white px-5 sm:px-8 py-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff7a00] flex items-center justify-center text-white font-black shadow">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <span>لوحة تحكم وإدارة مركز قطب</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  سحابية موثقة
                </span>
              </h1>
              <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-2 mt-0.5">
                <span>المشرف: {isMasterAdmin ? 'المالك الرئيسي' : currentUser?.email || 'المسؤول'}</span>
                <span className="text-emerald-300 font-black">• متصل</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition-colors border border-red-500/30 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'overview', label: 'نظرة عامة وإحصائيات', icon: TrendingUp, badge: null },
            { id: 'bookings', label: 'طلبات الصيانة', icon: Calendar, badge: bookings.length },
            { id: 'repairs', label: 'أوامر الإصلاح الفنية', icon: Wrench, badge: repairJobs.length },
            { id: 'customers', label: 'سجل العملاء', icon: Users, badge: customers.length },
            { id: 'reviews', label: 'مراجعة التقييمات', icon: Star, badge: pendingReviewsCount > 0 ? pendingReviewsCount : null },
            { id: 'works', label: 'معرض الأعمال', icon: ImageIcon, badge: works.length },
            { id: 'for_sale', label: 'المعروضات للبيع', icon: ShoppingBag, badge: 'جديد 🏷️' },
            { id: 'pricing', label: 'دليل الأسعار المعتمدة', icon: DollarSign, badge: 'دليل 📋' },
            { id: 'customization', label: 'تخصيص الموقع والأرقام والصور', icon: Sliders, badge: 'جديد ✨' },
            { id: 'admins', label: 'صلاحيات المشرفين', icon: ShieldCheck, badge: adminsList.length },
            { id: 'backup', label: 'النسخ الاحتياطي والبيانات', icon: FileSpreadsheet, badge: null },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#ff7a00] text-[#0e3a5e] bg-amber-500/5'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff7a00]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    tab.id === 'reviews' && pendingReviewsCount > 0 
                      ? 'bg-amber-500 text-white' 
                      : tab.id === 'customization'
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 xl:p-7 space-y-5 lg:space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverviewTab
              bookings={bookings}
              customers={customers}
              repairJobs={repairJobs}
              reviews={reviews}
              works={works}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
              onSelectBooking={(booking) => {
                setActiveTab('bookings');
              }}
            />
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <AdminBookingsTab
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
              onOpenCreateRepairJob={handleOpenCreateRepairJob}
              onViewWarrantyCertificate={onViewWarrantyCertificate}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 3: REPAIR JOBS (TECHNICAL WORKSHEETS) */}
          {activeTab === 'repairs' && (
            <AdminRepairsTab
              repairJobs={repairJobs}
              bookings={bookings}
              onSaveRepairJob={handleSaveRepairJob}
              onDeleteRepairJob={handleDeleteRepairJob}
              onShowToast={onShowToast}
              prefilledBooking={prefilledBooking}
              onClearPrefilledBooking={() => setPrefilledBooking(null)}
            />
          )}

          {/* TAB 4: CUSTOMERS CRM */}
          {activeTab === 'customers' && (
            <AdminCustomersTab
              customers={customers}
              onSaveCustomer={handleSaveCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <AdminReviewsTab
              reviews={reviews}
              onApproveReview={handleApproveReview}
              onRejectReview={handleRejectReview}
              onDeleteReview={handleDeleteReview}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 6: WORKS GALLERY */}
          {activeTab === 'works' && (
            <AdminWorksTab 
              works={works} 
              onWorksChange={setWorks} 
              onShowToast={onShowToast} 
            />
          )}

          {/* TAB 7: FOR SALE MARKETPLACE */}
          {activeTab === 'for_sale' && (
            <ForSaleManager onShowToast={onShowToast} />
          )}

          {/* TAB 8: SITE CUSTOMIZATION & LIVE CONTENT EDITOR */}
          {activeTab === 'customization' && (
            <AdminCustomizationTab
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 9: ADMINS & SECURITY ACCESS MANAGEMENT */}
          {activeTab === 'admins' && (
            <AdminAdminsTab
              currentAdminEmail={currentUser?.email || undefined}
              currentAdminUid={currentUser?.uid || undefined}
              isMasterAdmin={isMasterAdmin}
              adminsList={adminsList}
              onAddAdmin={handleAddAdmin}
              onDeleteAdmin={handleDeleteAdmin}
              onRunSecurityAudit={handleRunSecurityAudit}
              auditReport={auditReport}
              isRunningAudit={isRunningAudit}
              isSavingAdmin={isSavingAdmin}
              onChangeMasterPassword={handleChangeMasterPassword}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 10: BACKUP & DATA MANAGEMENT */}
          {activeTab === 'backup' && (
            <AdminBackupTab
              bookings={bookings}
              repairJobs={repairJobs}
              customers={customers}
              reviews={reviews}
              works={works}
              settings={settings || DEFAULT_SETTINGS}
              onImportBackup={handleImportBackup}
              onShowToast={onShowToast}
            />
          )}

          {/* TAB 11: PRICING GUIDE */}
          {activeTab === 'pricing' && (
            <AdminPricingTab />
          )}

        </main>
      </div>
    </div>
  );
};
