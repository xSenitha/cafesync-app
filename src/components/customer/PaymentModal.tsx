import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X, CheckCircle, AlertCircle, Smartphone, Landmark } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  token: string | null;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, order, token, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'Card' | 'Mobile' | 'Bank'>('Card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalAmount,
          paymentMethod: method
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Payment failed');
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-stone-800">Checkout</h2>
                  <p className="text-stone-400 text-xs font-medium mt-1">Complete your payment for Order #{order._id.slice(-6).toUpperCase()}</p>
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
                  <h3 className="text-xl font-black text-stone-800">Payment Successful!</h3>
                  <p className="text-stone-500 font-medium mt-2">Thank you for your order.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Amount to Pay</p>
                      <p className="text-2xl font-black text-stone-800">Rs. {order.totalAmount}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Select Payment Method</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setMethod('Card')}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          method === 'Card' 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-white border-stone-100 text-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        <CreditCard size={20} />
                        <span className="text-[10px] font-black uppercase">Card</span>
                      </button>
                      <button 
                        onClick={() => setMethod('Mobile')}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          method === 'Mobile' 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-white border-stone-100 text-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        <Smartphone size={20} />
                        <span className="text-[10px] font-black uppercase">Mobile</span>
                      </button>
                      <button 
                        onClick={() => setMethod('Bank')}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          method === 'Bank' 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-white border-stone-100 text-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        <Landmark size={20} />
                        <span className="text-[10px] font-black uppercase">Bank</span>
                      </button>
                    </div>
                  </div>

                  {method === 'Card' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 p-5 bg-stone-50 rounded-3xl border border-stone-100"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="0000 0000 0000 0000"
                          className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">CVV</label>
                          <input 
                            type="password" 
                            placeholder="***"
                            maxLength={3}
                            className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-1">
                        <input type="checkbox" id="saveCard" className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                        <label htmlFor="saveCard" className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Save card for future payments</label>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading}
                    onClick={handlePayment}
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-stone-800 transition-all disabled:opacity-50 shadow-xl shadow-stone-900/20"
                  >
                    {loading ? 'Processing...' : `Pay Rs. ${order.totalAmount}`}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
