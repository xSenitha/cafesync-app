import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Plus, Minus, Send, Trash2, Utensils, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  setCart: (cart: any[]) => void;
  onPlaceOrder: (orderData: any) => void;
  reservations: any[];
  tables: any[];
  onBookTable: () => void;
  loading: boolean;
  addNotification: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export function CartModal({ isOpen, onClose, cart, setCart, onPlaceOrder, reservations, tables, onBookTable, loading, addNotification }: CartModalProps) {
  const [orderType, setOrderType] = useState<'Dine-In' | 'Takeaway' | 'Online'>('Dine-In');
  const [tableNumber, setTableNumber] = useState('');

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item._id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && newQty > item.stockQuantity) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const handlePlaceOrder = () => {
    if (orderType === 'Dine-In') {
      onBookTable();
      return;
    }
    onPlaceOrder({
      orderType,
      tableNumber: null,
      items: cart,
      totalAmount: total
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[150] bg-[#FDFCFB] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-8 sm:px-12 sm:py-10 flex justify-between items-center bg-white border-b border-stone-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 -ml-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-900"
              >
                <X size={28} strokeWidth={2.5} />
              </button>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-800 tracking-tight">Your Order</h3>
                <p className="text-stone-400 text-xs sm:text-sm font-medium">Review items and choose order type</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
              <ShoppingCart size={18} className="text-amber-700" />
              <span className="text-sm font-black text-amber-800">{cart.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-8 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-stone-200">
                    <Trash2 size={48} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-black text-stone-800">Your cart is empty</h4>
                  <p className="text-stone-400 text-sm mt-2 max-w-xs mx-auto">Looks like you haven't added anything to your order yet.</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 text-amber-700 font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Back to Menu
                  </button>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto w-full space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      key={item._id} 
                      className="bg-white p-5 sm:p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-50 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-200">
                            <ShoppingCart size={32} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-black text-stone-800">{item.name}</h4>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">
                          Rs. {item.price.toFixed(2)}
                        </p>
                        <button 
                          onClick={() => removeItem(item._id)}
                          className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest mt-3 transition-colors"
                        >
                          Remove Item
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-2xl border border-stone-100">
                          <button 
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-stone-900 hover:text-white transition-all text-stone-400"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-lg font-black text-stone-800 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:bg-stone-900 hover:text-white transition-all text-stone-400"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[120px]">
                          <p className="text-xl font-black text-stone-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Section */}
            <div className="w-full lg:w-[450px] bg-white border-t lg:border-t-0 lg:border-l border-stone-100 p-8 sm:p-12 flex flex-col shadow-2xl">
              <div className="flex-1 space-y-10">
                {/* Order Type */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Order Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Dine-In', 'Takeaway', 'Online'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                          orderType === type 
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-900/20' 
                            : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="pt-10 border-t border-stone-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Subtotal</p>
                    <p className="text-lg font-bold text-stone-800">Rs. {total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Tax (0%)</p>
                    <p className="text-lg font-bold text-stone-800">Rs. 0.00</p>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <p className="text-sm font-black text-stone-800 uppercase tracking-[0.2em]">Total Amount</p>
                    <p className="text-3xl font-black text-amber-700">Rs. {total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-12 space-y-4">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.length === 0}
                  className="w-full bg-stone-900 hover:bg-black text-white font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm uppercase tracking-widest"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} strokeWidth={2.5} />
                  )}
                  {loading ? 'Processing...' : orderType === 'Dine-In' ? 'Confirm & Select a Table' : 'Confirm & Place Order'}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full text-stone-400 hover:text-stone-800 font-bold text-xs uppercase tracking-widest transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
