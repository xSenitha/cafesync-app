import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Plus, Minus, Send, Trash2, Utensils, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  setCart: (cart: any[]) => void;
  onPlaceOrder: (orderData: any) => Promise<boolean> | void;
  reservations: any[];
  orders: any[];
  tables: any[];
  onBookTable: () => void;
  loading: boolean;
  addNotification: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export function CartModal({ isOpen, onClose, cart, setCart, onPlaceOrder, reservations, orders, tables, onBookTable, loading, addNotification }: CartModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
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

  const handleNextStep = () => {
    if (orderType === 'Dine-In') {
      setStep(2);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = () => {
    if (orderType === 'Dine-In' && !tableNumber) {
      addNotification('Please select a table for Dine-In', 'warning');
      return;
    }
    onPlaceOrder({
      orderType,
      tableNumber: orderType === 'Dine-In' ? parseInt(tableNumber) : null,
      items: cart,
      totalAmount: total
    });
  };

  const getTableStatus = (num: number) => {
    const hasActiveOrder = orders.some(o => 
      o.tableNumber === num && 
      ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
    );
    if (hasActiveOrder) return 'Occupied';

    const hasReservation = reservations.some(r => 
      r.tableNumber === num && 
      r.status === 'Confirmed' &&
      new Date(r.reservationTime).toDateString() === new Date().toDateString()
    );
    if (hasReservation) return 'Reserved';

    return 'Available';
  };

  const resetModal = () => {
    setStep(1);
    onClose();
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
          <div className="px-6 py-6 sm:px-12 sm:py-10 flex justify-between items-center bg-white border-b border-stone-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={step === 2 ? () => setStep(1) : resetModal}
                className="p-2 -ml-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-900"
              >
                {step === 2 ? <Plus className="rotate-45" size={28} strokeWidth={2.5} /> : <X size={28} strokeWidth={2.5} />}
              </button>
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-stone-800 tracking-tight">
                  {step === 1 ? 'Your Order' : 'Select Table'}
                </h3>
                <p className="text-stone-400 text-[10px] sm:text-sm font-medium">
                  {step === 1 ? 'Review items and choose order type' : 'Choose an available table for your meal'}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
              <ShoppingCart size={18} className="text-amber-700" />
              <span className="text-sm font-black text-amber-800">{cart.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-12 space-y-8 scrollbar-hide">
              {step === 1 ? (
                <>
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
                    <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
                      {cart.map((item) => (
                        <motion.div 
                          layout
                          key={item._id} 
                          className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-stone-100 shadow-sm flex flex-row items-center gap-4 sm:gap-6 group hover:shadow-md transition-all"
                        >
                          <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-stone-50 overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-200">
                                <ShoppingCart size={24} className="sm:w-8 sm:h-8" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-lg font-black text-stone-800 truncate">{item.name}</h4>
                            <p className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-widest mt-0.5 sm:mt-1">
                              Rs. {item.price.toFixed(2)}
                            </p>
                            <button 
                              onClick={() => removeItem(item._id)}
                              className="text-[8px] sm:text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest mt-2 sm:mt-3 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                            <div className="flex items-center gap-2 sm:gap-4 bg-stone-50 p-1 sm:p-2 rounded-lg sm:rounded-2xl border border-stone-100">
                              <button 
                                onClick={() => updateQuantity(item._id, -1)}
                                className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-xl bg-white shadow-sm hover:bg-stone-900 hover:text-white transition-all text-stone-400"
                              >
                                <Minus size={14} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                              <span className="text-xs sm:text-lg font-black text-stone-800 w-4 sm:w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item._id, 1)}
                                className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center rounded-md sm:rounded-xl bg-white shadow-sm hover:bg-stone-900 hover:text-white transition-all text-stone-400"
                              >
                                <Plus size={14} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </div>
                            
                            <div className="text-right min-w-[80px] sm:min-w-[120px]">
                              <p className="text-sm sm:text-xl font-black text-stone-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="max-w-xl mx-auto w-full space-y-8 py-4 sm:py-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-stone-800 uppercase tracking-widest">Available Tables</h4>
                      <button 
                        onClick={onBookTable}
                        className="text-[10px] font-black text-amber-700 uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        <Calendar size={12} />
                        Book for later
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {tables.map((table) => {
                        const status = getTableStatus(table.number);
                        const isUnavailable = status !== 'Available';
                        
                        return (
                          <button
                            key={table._id}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => setTableNumber(table.number.toString())}
                            className={`py-4 sm:py-6 rounded-2xl text-xs sm:text-sm font-black transition-all border-2 flex flex-col items-center gap-1 ${
                              tableNumber === table.number.toString()
                                ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-900/20 scale-105' 
                                : status === 'Occupied'
                                  ? 'bg-red-50 border-red-100 text-red-700 cursor-not-allowed opacity-60'
                                  : status === 'Reserved'
                                    ? 'bg-amber-50 border-amber-100 text-amber-700 cursor-not-allowed opacity-60'
                                    : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            <span className="text-[8px] sm:text-[10px] opacity-50 uppercase tracking-tighter">Table</span>
                            {table.number}
                            <span className="text-[8px] opacity-50 font-medium">
                              {status === 'Occupied' ? 'Occupied' : status === 'Reserved' ? 'Reserved' : `${table.capacity} Seats`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {tables.length === 0 && (
                      <div className="text-center py-12 text-xs font-bold text-stone-400 uppercase tracking-widest border-2 border-dashed border-stone-100 rounded-[2rem]">
                        No tables available at the moment.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-stone-100" />
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-50 border-2 border-red-100" />
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-50 border-2 border-amber-100" />
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Reserved</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Sidebar */}
            <div className="w-full lg:w-[450px] bg-white border-t lg:border-t-0 lg:border-l border-stone-100 p-6 sm:p-12 flex flex-col shadow-2xl">
              <div className="flex-1 space-y-8 sm:space-y-10">
                {step === 1 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] ml-1">Order Type</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {(['Dine-In', 'Takeaway', 'Online'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setOrderType(type);
                            if (type !== 'Dine-In') setTableNumber('');
                          }}
                          className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
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
                )}

                {/* Order Summary */}
                <div className="pt-6 sm:pt-10 border-t border-stone-100 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] sm:text-sm font-bold text-stone-400 uppercase tracking-widest">Subtotal</p>
                    <p className="text-sm sm:text-lg font-bold text-stone-800">Rs. {total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] sm:text-sm font-bold text-stone-400 uppercase tracking-widest">Tax (0%)</p>
                    <p className="text-sm sm:text-lg font-bold text-stone-800">Rs. 0.00</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 sm:pt-4">
                    <p className="text-[10px] sm:text-sm font-black text-stone-800 uppercase tracking-[0.2em]">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-700">Rs. {total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
                {step === 1 ? (
                  <button 
                    onClick={handleNextStep}
                    disabled={loading || cart.length === 0}
                    className="w-full bg-stone-900 hover:bg-black text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-[10px] sm:text-sm uppercase tracking-widest"
                  >
                    {orderType === 'Dine-In' ? 'Next: Select Table' : (loading ? 'Processing...' : 'Confirm & Place Order')}
                    {orderType !== 'Dine-In' && !loading && <Send size={18} />}
                    {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading || !tableNumber}
                    className="w-full bg-stone-900 hover:bg-black text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-[10px] sm:text-sm uppercase tracking-widest"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={18} strokeWidth={2.5} />
                    )}
                    {loading ? 'Processing...' : `Confirm Table ${tableNumber} & Order`}
                  </button>
                )}
                
                <button 
                  onClick={step === 2 ? () => setStep(1) : onClose}
                  className="w-full text-stone-400 hover:text-stone-800 font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-colors py-2"
                >
                  {step === 2 ? 'Back to Items' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
