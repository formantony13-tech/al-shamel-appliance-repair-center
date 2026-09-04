import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Edit3,
  X,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { RepairJob, BookingRecord } from '../../types';
import { diagnoseApplianceFault, DiagnosticResult } from '../../lib/applianceDiagnosticEngine';

interface AdminRepairsTabProps {
  repairJobs: RepairJob[];
  bookings: BookingRecord[];
  onSaveRepairJob: (job: Omit<RepairJob, 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDeleteRepairJob: (jobId: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  prefilledBooking?: BookingRecord | null;
  onClearPrefilledBooking?: () => void;
}

export const AdminRepairsTab: React.FC<AdminRepairsTabProps> = ({
  repairJobs,
  bookings,
  onSaveRepairJob,
  onDeleteRepairJob,
  onShowToast,
  prefilledBooking,
  onClearPrefilledBooking
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form State
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [applianceType, setApplianceType] = useState('غسالات');
  const [brand, setBrand] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [solution, setSolution] = useState('');
  const [technicianName, setTechnicianName] = useState('المهندس / قطب');
  const [partsInput, setPartsInput] = useState('');
  const [laborCost, setLaborCost] = useState<number>(0);
  const [partsCost, setPartsCost] = useState<number>(0);
  const [warrantyDuration, setWarrantyDuration] = useState('6 أشهر بضمان معتمد');
  const [status, setStatus] = useState<RepairJob['status']>('IN_PROGRESS');

  // AI Diagnostic State
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<DiagnosticResult | null>(null);

  // React to prefilled booking if requested from bookings tab
  React.useEffect(() => {
    if (prefilledBooking) {
      setSelectedBookingId(prefilledBooking.id);
      setCustomerName(prefilledBooking.fullName);
      setCustomerPhone(prefilledBooking.phoneNumber);
      setAddress(prefilledBooking.address);
      setApplianceType(prefilledBooking.deviceType);
      setBrand(prefilledBooking.brand || '');
      setProblemDescription(prefilledBooking.issueDescription);
      setIsModalOpen(true);
      if (onClearPrefilledBooking) onClearPrefilledBooking();
    }
  }, [prefilledBooking]);

  const handleRunAiDiagnostic = async () => {
    if (!problemDescription.trim()) {
      onShowToast('يرجى كتابة وصف العطل أولاً لتشغيل الفحص الذكي', 'error');
      return;
    }
    setIsDiagnosing(true);
    try {
      const result = await diagnoseApplianceFault(applianceType, problemDescription, brand);
      setAiSuggestion(result);
      if (!diagnosis) setDiagnosis(result.probableCause);
      if (!solution) setSolution(`تم فحص الجهاز وإصلاح ${result.probableCause} وتركيب قطع الغيار الأصلية.`);
      if (result.recommendedParts.length > 0 && !partsInput) {
        setPartsInput(result.recommendedParts.join('\n'));
      }
      onShowToast('تم إنشاء التشخيص الفني الذكي بنجاح!', 'success');
    } catch {
      onShowToast('تعذر تشغيل الفحص التلقائي', 'error');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    const found = bookings.find(b => b.id === bookingId);
    if (found) {
      setCustomerName(found.fullName);
      setCustomerPhone(found.phoneNumber);
      setAddress(found.address);
      setApplianceType(found.deviceType);
      setBrand(found.brand || '');
      setProblemDescription(found.issueDescription);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !problemDescription.trim() || !diagnosis.trim()) {
      onShowToast('يرجى تعبئة الحقول الأساسية للبطاقة الفنية', 'error');
      return;
    }

    const parts = partsInput.split('\n').map(p => p.trim()).filter(Boolean);
    const total = (Number(laborCost) || 0) + (Number(partsCost) || 0);

    const jobData: Omit<RepairJob, 'createdAt' | 'updatedAt'> = {
      id: editingJobId || `rep_${Date.now()}`,
      bookingId: selectedBookingId || `MANUAL_${Date.now()}`,
      customerId: `cust_${customerPhone.replace(/\D/g, '')}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      applianceType: applianceType.trim(),
      brand: brand.trim() || undefined,
      problemDescription: problemDescription.trim(),
      diagnosis: diagnosis.trim(),
      solution: solution.trim() || 'تمت الصيانة الفنية والاختبار بنجاح',
      technicianName: technicianName.trim() || 'المهندس / قطب',
      partsReplaced: parts,
      laborCost: Number(laborCost) || 0,
      partsCost: Number(partsCost) || 0,
      totalCost: total,
      warrantyDuration: warrantyDuration.trim(),
      status: status
    };

    try {
      await onSaveRepairJob(jobData);
      setIsModalOpen(false);
      resetForm();
      onShowToast('تم حفظ بطاقة أمر الصيانة بنجاح', 'success');
    } catch {
      onShowToast('فشل حفظ بطاقة الصيانة', 'error');
    }
  };

  const resetForm = () => {
    setEditingJobId(null);
    setSelectedBookingId('');
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setApplianceType('غسالات');
    setBrand('');
    setProblemDescription('');
    setDiagnosis('');
    setSolution('');
    setPartsInput('');
    setLaborCost(0);
    setPartsCost(0);
    setWarrantyDuration('6 أشهر بضمان معتمد');
    setStatus('IN_PROGRESS');
    setAiSuggestion(null);
  };

  const handleEdit = (job: RepairJob) => {
    setEditingJobId(job.id);
    setSelectedBookingId(job.bookingId || '');
    setCustomerName(job.customerName);
    setCustomerPhone(job.customerPhone);
    setAddress(job.address);
    setApplianceType(job.applianceType);
    setBrand(job.brand || '');
    setProblemDescription(job.problemDescription);
    setDiagnosis(job.diagnosis);
    setSolution(job.solution);
    setTechnicianName(job.technicianName);
    setPartsInput((job.partsReplaced || []).join('\n'));
    setLaborCost(job.laborCost || 0);
    setPartsCost(job.partsCost || 0);
    setWarrantyDuration(job.warrantyDuration || '6 أشهر');
    setStatus(job.status);
    setIsModalOpen(true);
  };

  const filteredJobs = repairJobs.filter(j => 
    j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.customerPhone.includes(searchQuery) ||
    j.applianceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.technicianName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="بحث في بطاقات وأوامر الصيانة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#0e3a5e] outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0e3a5e] hover:bg-[#123f66] text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء بطاقة صيانة فنية جديدة</span>
        </button>
      </div>

      {/* Repairs Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0e3a5e] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black text-[#0e3a5e] bg-blue-50 px-2 py-0.5 rounded">
                  {job.id}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {job.status === 'COMPLETED' ? 'تمت الصيانة ✅' : 'قيد التنفيذ ⚙️'}
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 mb-1">{job.customerName}</h4>
              <p className="text-xs text-slate-500 font-semibold mb-2">{job.applianceType} {job.brand ? `• ${job.brand}` : ''}</p>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl">
                <div><strong>التشخيص:</strong> {job.diagnosis}</div>
                <div><strong>الفني المسؤول:</strong> {job.technicianName}</div>
                {job.partsReplaced && job.partsReplaced.length > 0 && (
                  <div><strong>قطع الغيار:</strong> {job.partsReplaced.join('، ')}</div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-800 font-bold">
                  <span>إجمالي التكلفة:</span>
                  <span className="font-mono font-black text-[#ff7a00]">{job.totalCost || 0} ج.م</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">{job.warrantyDuration || 'ضمان معتمد'}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(job)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  title="تعديل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRepairJob(job.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
          لا توجد بطاقات صيانة مسجلة بعد
        </div>
      )}

      {/* CREATE / EDIT REPAIR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-right border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#ff7a00]" />
                <span>{editingJobId ? 'تعديل بطاقة الصيانة الفنية' : 'إنشاء بطاقة صيانة فنية جديدة'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Optional Link to Existing Booking */}
              {bookings.length > 0 && !editingJobId && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ربط بطلب حجز سابق (اختياري):</label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => handleBookingSelect(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="">-- إنشاء بطاقة مستقلة بدون حجز مسبق --</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.fullName} ({b.deviceType} - {b.address})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم العميل *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الجهاز</label>
                  <select
                    value={applianceType}
                    onChange={(e) => setApplianceType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value="غسالات أوتوماتيك">غسالات أوتوماتيك</option>
                    <option value="ثلاجات ديفروست ونوفروست">ثلاجات ديفروست ونوفروست</option>
                    <option value="ديب فريزر رأسي وأفقي">ديب فريزر رأسي وأفقي</option>
                    <option value="تكييفات">تكييفات</option>
                    <option value="بوتاجازات وأفران">بوتاجازات وأفران</option>
                    <option value="سمكرة ودوكو وعلاج بارومة">سمكرة ودوكو وعلاج بارومة</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الماركة / الموديل</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="مثال: توشيبا، زانوسي، إل جي..."
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الفني القائم بالعمل</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">شرح العطل والأعراض المبلغ عنها *</label>
                  <button
                    type="button"
                    onClick={handleRunAiDiagnostic}
                    disabled={isDiagnosing}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 font-black text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isDiagnosing ? 'جاري الفحص الذكي...' : 'الفاحص الذكي التلقائي 🤖'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="مثال: الغسالة تصدر صوتاً مرتفعاً جداً أثناء العصر ولا تصرف المياه..."
                  className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              {/* AI Suggestion Box */}
              {aiSuggestion && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-[11px] text-purple-950">
                  <div className="flex items-center gap-1.5 font-black text-purple-900">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span>التشخيص الفني المقترح: {aiSuggestion.probableCause}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-purple-900">
                    <div><strong>القطع الموصى بها:</strong> {aiSuggestion.recommendedParts.join('، ')}</div>
                    <div><strong>الوقت المقدر:</strong> {aiSuggestion.estimatedDuration}</div>
                  </div>
                  <div className="text-[10px] text-purple-800">
                    <strong>إرشادات السلامة:</strong> {aiSuggestion.safetyNotes}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التشخيص الفني الدقيق *</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="مثال: تآكل رولمان البلي وتلف الألسيه"
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">مدة الضمان المعتمد</label>
                  <input
                    type="text"
                    value={warrantyDuration}
                    onChange={(e) => setWarrantyDuration(e.target.value)}
                    placeholder="مثال: 6 أشهر شامل قطع الغيار"
                    className="w-full p-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">قطع الغيار المستبدلة (كل قطعة في سطر)</label>
                <textarea
                  rows={2}
                  value={partsInput}
                  onChange={(e) => setPartsInput(e.target.value)}
                  placeholder="رولمان بلي ياباني 6205&#10;أولسيه عازل مياه أصلي"
                  className="w-full p-2 rounded-xl border border-slate-200 font-semibold font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">أجر المصنعية (ج.م)</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر قطع الغيار (ج.م)</label>
                  <input
                    type="number"
                    value={partsCost}
                    onChange={(e) => setPartsCost(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الإجمالي الكلي (ج.م)</label>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 font-black text-slate-900 font-mono text-center">
                    {(Number(laborCost) || 0) + (Number(partsCost) || 0)} ج.م
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">حالة أمر الصيانة</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="IN_PROGRESS">قيد التنفيذ (IN_PROGRESS)</option>
                  <option value="WAITING_FOR_PART">بانتظار وصول قطعة الغيار (WAITING_FOR_PART)</option>
                  <option value="COMPLETED">تمت الصيانة بنجاح والتسليم (COMPLETED)</option>
                  <option value="CANCELLED">ملغي (CANCELLED)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0e3a5e] text-white font-black hover:bg-[#123f66] shadow cursor-pointer"
                >
                  حفظ بطاقة الصيانة ✅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
