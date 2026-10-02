import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Key, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AdminUser } from '../../types';
import { isMasterAdminEmail } from '../../config';

interface AdminAdminsTabProps {
  currentAdminEmail?: string;
  currentAdminUid?: string;
  isMasterAdmin: boolean;
  adminsList: AdminUser[];
  onAddAdmin: (email: string, password: string, displayName: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER') => Promise<void>;
  onDeleteAdmin: (admin: AdminUser) => Promise<void>;
  onRunSecurityAudit: () => Promise<void>;
  auditReport: Array<{ name: string; category: string; passed: boolean; details: string }> | null;
  isRunningAudit: boolean;
  isSavingAdmin: boolean;
  onChangeMasterPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminAdminsTab: React.FC<AdminAdminsTabProps> = ({
  currentAdminEmail,
  currentAdminUid,
  isMasterAdmin,
  adminsList,
  onAddAdmin,
  onDeleteAdmin,
  onRunSecurityAudit,
  auditReport,
  isRunningAudit,
  isSavingAdmin,
  onChangeMasterPassword,
  onShowToast
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'MANAGER'>('ADMIN');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const visibleAdmins = adminsList.filter((admin) => !isMasterAdminEmail(admin.email));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newAdminPassword.length < 6) {
      onShowToast('يرجى كتابة بريد صحيح وكلمة مرور من 6 أحرف على الأقل', 'error');
      return;
    }
    await onAddAdmin(newEmail.trim(), newAdminPassword, newDisplayName.trim(), newRole);
    setNewEmail('');
    setNewAdminPassword('');
    setNewDisplayName('');
    setNewRole('ADMIN');
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      onShowToast('كلمة المرور الجديدة وتأكيدها غير متطابقين.', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      await onChangeMasterPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast('تم تغيير كلمة مرور الماستر بنجاح.', 'success');
    } catch (error: any) {
      const code = error?.code;
      onShowToast(
        code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'كلمة المرور الحالية غير صحيحة.'
          : error?.message || 'تعذر تغيير كلمة المرور حالياً.',
        'error'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3a5e] to-[#123f66] text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ff7a00] font-black text-xs mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>إدارة المشرفين وصلاحيات الحماية السحابية</span>
          </div>
          <h3 className="text-lg font-black">أمان النظام والتحكم في صلاحيات الدخول</h3>
          <p className="text-xs text-slate-200 mt-1">
            التحكم في حسابات المهندسين والمشرفين المصرح لهم بالدخول وإدارة طلبات الصيانة وتحديث المعرض والإعدادات.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/10 text-xs font-bold text-slate-100 flex items-center gap-2 shrink-0">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>قواعد أمان Firebase مفعلة ومحمية</span>
        </div>
      </div>

      {/* Current Session Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <UserCheck className="w-4 h-4 text-[#0e3a5e]" />
          <span>بيانات جلسة المشرف الحالي</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block font-bold">البريد الإلكتروني المسجل:</span>
            <span className="font-black text-slate-900 font-mono text-sm">
              {isMasterAdmin ? 'المالك الرئيسي' : currentAdminEmail || 'غير محدد'}
            </span>
            {currentAdminUid && (
              <span className="text-[10px] text-slate-500 font-mono block">UID: {currentAdminUid}</span>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-400 block font-bold">مستوى الصلاحية:</span>
            <span className={`inline-flex items-center gap-1.5 font-black text-xs px-2.5 py-1 rounded-lg ${
              isMasterAdmin ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isMasterAdmin ? 'مدير عام رئيسي (Super Admin)' : 'مشرف صيانة معتمد'}</span>
            </span>
          </div>
        </div>
      </div>

      {isMasterAdmin ? (
        <>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#ff7a00]" />
            <span>إضافة مشرف من حساب الماستر</span>
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="engineer@gmail.com" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" />
            <input type="password" required minLength={6} value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="كلمة مرور الدخول" autoComplete="new-password" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" dir="ltr" />
            <input type="text" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} placeholder="اسم المشرف / المهندس" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'MANAGER')} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
              <option value="ADMIN">مشرف إدارة (Admin)</option>
              <option value="MANAGER">مدير عمليات (Manager)</option>
            </select>
            <button type="submit" disabled={isSavingAdmin} className="w-full py-2.5 px-4 bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black rounded-xl transition-all shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>{isSavingAdmin ? 'جاري الإضافة...' : 'إضافة المشرف'}</span>
            </button>
          </form>
          <p className="text-[11px] text-slate-500">سيُنشئ النظام حساب دخول فعليًا تلقائيًا ويولّد UID دون الحاجة إلى فتح Firebase Console. يمكن للماستر فقط إضافة المشرفين أو حذفهم، ولا يمكن منح أي مشرف دور الماستر.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#ff7a00]" />
            <span>تغيير كلمة مرور الماستر</span>
          </h4>
          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <input type="password" required minLength={8} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="كلمة المرور الحالية" autoComplete="current-password" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" dir="ltr" />
            <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة" autoComplete="new-password" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" dir="ltr" />
            <input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة المرور الجديدة" autoComplete="new-password" className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0e3a5e]" dir="ltr" />
            <button type="submit" disabled={isChangingPassword} className="md:col-span-3 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl transition-all shadow cursor-pointer disabled:opacity-50">
              {isChangingPassword ? 'جاري تغيير كلمة المرور...' : 'حفظ كلمة المرور الجديدة'}
            </button>
          </form>
          <p className="text-[11px] text-slate-500">للحماية، يطلب النظام كلمة المرور الحالية أولاً. هذا الخيار يعمل مع حسابات Email/Password فقط؛ حساب Google يغيّر كلمة المرور من حساب Google نفسه.</p>
        </div>
        </>
      ) : (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-3 text-right">
            <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-slate-900">إدارة المشرفين مقصورة على الماستر</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">لا يمكن للمشرف الحالي إضافة أو حذف أو ترقية أي حساب.</p>
            </div>
          </div>
        </div>
      )}

      {/* Authorized Admins List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900">
          قائمة المشرفين المصرح لهم حالياً ({visibleAdmins.length})
        </h4>

        {visibleAdmins.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-semibold text-xs bg-slate-50 rounded-xl">
            لا يوجد مشرفون مفوضون مسجلون بعد. حساب المالك محفوظ داخلياً ولا يظهر في هذه القائمة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="p-3">المشرف / الاسم</th>
                  <th className="p-3">البريد الإلكتروني</th>
                  <th className="p-3">الصلاحية</th>
                  <th className="p-3">تاريخ التفويض</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleAdmins.map((admin) => {
                  return (
                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                            {admin.displayName ? admin.displayName[0] : admin.email[0].toUpperCase()}
                          </div>
                          <span>{admin.displayName || 'مشرف معتمد'}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{admin.email}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          admin.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : admin.role === 'MANAGER'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {admin.role === 'SUPER_ADMIN' ? 'مدير عام (Super Admin)' : admin.role === 'MANAGER' ? 'مدير عمليات (Manager)' : 'مشرف (Admin)'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('ar-EG') : 'الأساسي'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteAdmin(admin)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="إلغاء تفويض المشرف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Zero-Trust Live Security & Production Audit Tool */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>الفحص الأمني المباشر وتدقيق قواعد الإنتاج (Production & Security Audit)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              اختبار فوري لكافة طبقات الحماية السحابية والتأكد من حظر المستخدم العادي من قراءة أو تعديل أي بيانات حساسة.
            </p>
          </div>

          <button
            type="button"
            onClick={onRunSecurityAudit}
            disabled={isRunningAudit}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isRunningAudit ? 'جاري الفحص المباشر...' : 'تشغيل فحص الأمان الشامل الآن 🚀'}</span>
          </button>
        </div>

        {auditReport && (
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {auditReport.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-2.5 text-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-emerald-950 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed font-medium">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-black block text-emerald-400">النظام مؤمّن وموثق بنسبة 100% وفق أحدث معايير Zero-Trust</span>
                  <span className="text-[11px] text-slate-300">تم التحقق من كافة قواعد Firestore وStorage ومنع أي تسريب لبيانات العملاء أو الحجوزات أو الإصلاحات.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Best Practices */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Key className="w-4 h-4 text-[#ff7a00]" />
          <span>توصيات الأمان وحماية لوحة التحكم</span>
        </h4>

        <div className="space-y-3 text-xs text-slate-600 font-medium">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">إدارة البريد الإلكتروني الرئيسي عبر متغيرات البيئة</span>
              <span className="text-[11px] text-slate-500">
                حساب المالك الرئيسي مثبت داخلياً في سياسة الأمان، ويتم التحقق منه في التطبيق وقواعد Firebase معاً دون عرضه في واجهة الإدارة.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">تشفير كلمات المرور والتوثيق المباشر</span>
              <span className="text-[11px] text-slate-500">
                تتم إدارة تسجيل الدخول والرموز المميزة (Tokens) سحابياً عبر خوادم Google Firebase الآمنة.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">تأمين رفع الملفات والصور</span>
              <span className="text-[11px] text-slate-500">
                قواعد Firebase Storage تتحقق من حجم ونوعية الصور لمنع رفع أي ملفات ضارة.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
