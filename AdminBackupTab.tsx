import React, { useRef, useState } from 'react';
import { Download, Upload, ShieldCheck, Database, FileText, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { BookingRecord, Customer, CustomerReview, RepairJob, AppSystemSettings, RepairWork } from '../../types';

interface AdminBackupTabProps {
  bookings: BookingRecord[];
  repairJobs: RepairJob[];
  customers: Customer[];
  reviews: CustomerReview[];
  works: RepairWork[];
  settings: AppSystemSettings;
  onImportBackup?: (data: any) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminBackupTab: React.FC<AdminBackupTabProps> = ({
  bookings,
  repairJobs,
  customers,
  reviews,
  works,
  settings,
  onImportBackup,
  onShowToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportJSON = () => {
    try {
      const backupData = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        centerName: settings.centerName,
        data: {
          bookings,
          repairJobs,
          customers,
          reviews,
          works,
          settings
        }
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `al-kotb-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      onShowToast('تم تصدير النسخة الاحتياطية بنجاح إلى ملف JSON', 'success');
    } catch (error) {
      console.error('Export backup error:', error);
      onShowToast('تعذر تصدير النسخة الاحتياطية', 'error');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || !parsed.version) {
        throw new Error('صيغة ملف النسخة الاحتياطية غير صالحة');
      }

      if (onImportBackup) {
        await onImportBackup(parsed.data);
      }
      onShowToast('تم استيراد واستعادة بيانات النسخة الاحتياطية بنجاح', 'success');
    } catch (err: any) {
      console.error('Import error:', err);
      onShowToast(err?.message || 'فشل في استيراد ملف النسخة الاحتياطية', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e3a5e] to-[#164e7c] text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ff7a00] font-black text-xs mb-1">
            <Database className="w-4 h-4" />
            <span>إدارة النسخ الاحتياطي والأمان</span>
          </div>
          <h3 className="text-lg font-black">حفظ واسترجاع بيانات المركز بالكامل</h3>
          <p className="text-xs text-slate-200 mt-1">
            يمكنك تحميل نسخة احتياطية مشفرة بصيغة JSON تحتوي على الحجوزات، أوامر الشغل، سجلات العملاء، التقييمات، وإعدادات المركز.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-[#ff7a00] hover:bg-[#e06c00] text-white font-black text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية الآن</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 block">طلبات الحجز</span>
          <span className="text-2xl font-black text-[#0e3a5e] font-mono">{bookings.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 block">أوامر الصيانة</span>
          <span className="text-2xl font-black text-indigo-700 font-mono">{repairJobs.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 block">سجلات العملاء</span>
          <span className="text-2xl font-black text-blue-700 font-mono">{customers.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 block">تقييمات العملاء</span>
          <span className="text-2xl font-black text-emerald-700 font-mono">{reviews.length}</span>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">تصدير وحفظ البيانات محلياً</h4>
              <p className="text-xs text-slate-500 font-medium">حفظ ملف JSON يحتوي على كافة الجداول والسجلات</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600 font-medium space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>يشمل صور وأكواد الحجوزات والتشخيص الفني</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>متوافق مع أي استعادة مستقبلية</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف النسخة الاحتياطية (.json)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">استعادة بيانات من نسخة سابقة</h4>
              <p className="text-xs text-slate-500 font-medium">استيراد ملف JSON محفوظ مسبقاً</p>
            </div>
          </div>

          <div className="bg-amber-50 p-3.5 rounded-xl text-xs text-amber-900 font-medium space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>تنبيه: الاستيراد سيقوم بدمج أو تحديث السجلات الموجودة</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full py-3 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري استيراد البيانات...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>اختيار ملف JSON للاستعادة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
