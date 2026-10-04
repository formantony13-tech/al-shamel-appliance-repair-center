import React, { useState } from 'react';
import { Users, Search, Phone, MapPin, Calendar, MessageSquare, Plus, Trash2, Edit3, X, DollarSign } from 'lucide-react';
import { Customer } from '../../types';

interface AdminCustomersTabProps {
  customers: Customer[];
  onSaveCustomer: (customer: Customer) => Promise<void>;
  onDeleteCustomer: (customerId: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  customers,
  onSaveCustomer,
  onDeleteCustomer,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.area && c.area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setAddress('');
    setArea('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setAddress(c.address);
    setArea(c.area || '');
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      onShowToast('يرجى كتابة الاسم ورقم الهاتف والعنوان', 'error');
      return;
    }

    const customerData: Customer = {
      id: editingCustomer ? editingCustomer.id : `cust_${phone.replace(/\D/g, '')}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area: area.trim() || undefined,
      notes: notes.trim() || undefined,
      totalBookings: editingCustomer ? editingCustomer.totalBookings : 1,
      totalSpent: editingCustomer ? editingCustomer.totalSpent : 0,
      lastBookingDate: editingCustomer ? editingCustomer.lastBookingDate : new Date().toISOString().split('T')[0],
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await onSaveCustomer(customerData);
      setIsModalOpen(false);
      onShowToast('تم حفظ بيانات العميل بنجاح', 'success');
    } catch {
      onShowToast('فشل حفظ بيانات العميل', 'error');
    }
  };

  const handleWhatsApp = (customer: Customer) => {
    const raw = customer.phone.replace(/\D/g, '');
    const cleanPhone = raw.startsWith('0') ? `2${raw}` : raw.startsWith('2') ? raw : `20${raw}`;
    const msg = `مرحباً بك أستاذ ${customer.name} معك مركز قطب للحل السريع لصيانة الأجهزة المنزلية. نتشرف بخدمتكم دائماً!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="بحث في سجل العملاء بالاسم أو الهاتف أو المنطقة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-[#123b4a] outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#123b4a] hover:bg-[#174c5d] text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عميل جديد لسجل CRM</span>
        </button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#123b4a] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-500">{c.area || 'عميل مسجل'}</span>
                <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-[#123b4a]">
                  {c.totalBookings || 1} حجز
                </span>
              </div>

              <h4 className="text-sm font-black text-slate-900 mb-1">{c.name}</h4>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-2 font-mono font-bold text-[#123b4a]">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{c.address}</span>
                </div>
                {c.notes && (
                  <div className="p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900 border border-amber-100">
                    <strong>ملاحظات الإدارة:</strong> {c.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleWhatsApp(c)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(c)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  title="تعديل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCustomer(c.id)}
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

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
          لا يوجد عملاء يطابقون شروط البحث
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-right border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#d97706]" />
                <span>{editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم العميل بالكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف الأساسي *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المحافظة / المركز</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="مثال: البحيرة - أبو المطامير"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان بالتفصيل *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات خاصة بالإدارة</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: عميل مميز، يفضل الزيارة الصباحية..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
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
                  className="px-6 py-2 rounded-xl bg-[#123b4a] text-white font-black hover:bg-[#174c5d] shadow"
                >
                  حفظ العميل ✅
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
