import React, { useState } from 'react';
import { Calendar, Users, Phone, User, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { API_BASE_URL } from '../../config';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
  reservations: any[];
  orders: any[];
  tables: any[];
}

export function ReservationForm({ isOpen, onClose, onSuccess, token, reservations, orders, tables }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableNumber: 0,
    numberOfGuests: 2,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'),
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isTableReserved = (num: number) => {
    if (!formData.reservationDate || !formData.reservationTime) return false;
    
    const selectedTime = new Date(`${formData.reservationDate}T${formData.reservationTime}`);
    const now = new Date();
    
    // 1. Check if table is currently occupied by an order (if booking for today and close to now)
    const isToday = selectedTime.toDateString() === now.toDateString();
    if (isToday) {
      const activeOrder = orders.find(o => 
        o.tableNumber === num && 
        ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
      );
      
      if (activeOrder) {
        // If there's an active order, and the reservation is within the next 2 hours, it's blocked
        const timeDiffMs = selectedTime.getTime() - now.getTime();
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        if (timeDiffHours < 2) return true;
      }
    }

    // 2. Check for other reservations in a 2-hour window
    return reservations.some(r => {
      if (r.tableNumber !== num || r.status === 'Cancelled' || r.status === 'Completed') return false;
      
      const resTime = new Date(r.reservationTime);
      const diffMs = Math.abs(selectedTime.getTime() - resTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);
      
      return diffHours < 2;
    });
  };

  const availableTablesCount = tables.filter(t => !isTableReserved(t.number)).length;

  React.useEffect(() => {
    if (formData.tableNumber > 0 && isTableReserved(formData.tableNumber)) {
      setFormData(prev => ({ ...prev, tableNumber: 0 }));
    }
  }, [formData.reservationDate, formData.reservationTime, reservations, orders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reservationDateTime = new Date(`${formData.reservationDate}T${formData.reservationTime}`);
      
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          tableNumber: formData.tableNumber,
          numberOfGuests: formData.numberOfGuests,
          reservationTime: reservationDateTime,
          notes: formData.notes
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
          setFormData({
            customerName: '',
            customerPhone: '',
            tableNumber: 0,
            numberOfGuests: 2,
            reservationDate: new Date().toISOString().split('T')[0],
            reservationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            notes: ''
          });
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to book table');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-stone-800">Book a Table</h2>
                  <p className="text-stone-400 text-xs font-medium mt-1">Reserve your spot at CafeSync</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={24} className="text-stone-400" />
                </button>
              </div>

              {success ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">Reservation Confirmed!</h3>
                  <p className="text-stone-500 font-medium mt-2">We look forward to seeing you.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="text"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.reservationDate}
                          onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="time"
                          value={formData.reservationTime}
                          onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Guests</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="number"
                          min="1"
                          max="20"
                          value={formData.numberOfGuests}
                          onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                          className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Select Table</label>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest ml-1">
                          {availableTablesCount} Tables Available
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-stone-100 border border-stone-200" />
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Free</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-100 border border-amber-200" />
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Reserved</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {tables.map((table) => {
                        const reserved = isTableReserved(table.number);
                        return (
                          <button
                            key={table._id}
                            type="button"
                            disabled={reserved}
                            onClick={() => setFormData({ ...formData, tableNumber: table.number })}
                            className={`py-2.5 rounded-xl text-[10px] font-black transition-all border-2 flex flex-col items-center gap-0.5 ${
                              formData.tableNumber === table.number
                                ? 'bg-stone-900 border-stone-900 text-white shadow-lg shadow-stone-900/20' 
                                : reserved
                                  ? 'bg-amber-50 border-amber-100 text-amber-700 cursor-not-allowed opacity-60'
                                  : 'bg-stone-50 border-stone-100 text-stone-400 hover:border-stone-200'
                            }`}
                          >
                            <span className="text-[8px] opacity-50">T</span>
                            {table.number}
                          </button>
                        );
                      })}
                    </div>
                    {tables.length === 0 && (
                      <div className="text-center py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-2 border-dashed border-stone-100 rounded-2xl">
                        No tables configured.
                      </div>
                    )}
                    {formData.tableNumber > 0 && isTableReserved(formData.tableNumber) && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-[9px] font-bold border border-amber-100">
                        <AlertCircle size={14} />
                        This table is already reserved for the selected date.
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Special Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all h-24 resize-none"
                      placeholder="Any special requests?"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-stone-800 transition-all disabled:opacity-50 shadow-xl shadow-stone-900/20"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
