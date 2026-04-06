import { motion, AnimatePresence } from 'motion/react';
import { Coffee, ShoppingCart, Utensils, Plus, Minus, ChevronRight, Clock, Calendar, CreditCard, CheckCircle, AlertCircle, Star, MessageSquare, PlusCircle, Wallet } from 'lucide-react';
import { useState } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { ReservationForm } from './ReservationForm';
import { PaymentModal } from './PaymentModal';

interface CustomerViewProps {
  activeTab: string;
  menuItems: any[];
  orders: any[];
  reservations: any[];
  payments: any[];
  cart: any[];
  setCart: (cart: any[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTable: number | null;
  setSelectedTable: (table: number | null) => void;
  onPlaceOrder: () => void;
  token: string | null;
  onUpdate: () => void;
}

export function CustomerView({ 
  activeTab, menuItems, orders, reservations, payments, cart, setCart, 
  selectedCategory, setSelectedCategory, selectedTable, setSelectedTable, onPlaceOrder,
  token, onUpdate
}: CustomerViewProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any | null>(null);
  const categories = ['All', ...new Set(menuItems.map((item: any) => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter((item: any) => item.category === selectedCategory);

  const addToCart = (item: any) => {
    const existing = cart.find((c: any) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c: any) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find((c: any) => c._id === itemId);
    if (!existing) return;
    if (existing.quantity > 1) {
      setCart(cart.map((c: any) => c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter((c: any) => c._id !== itemId));
    }
  };

  const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
      case 'dashboard':
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-stone-800">Fresh Menu</h2>
                  <p className="text-stone-400 text-sm font-medium mt-1">Select your favorite items and place an order.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowReservationForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-black uppercase tracking-wider text-amber-700 transition-all border border-amber-100"
                  >
                    <Calendar size={14} />
                    Book a Table
                  </button>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100 shadow-sm">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Table</label>
                    <select 
                      value={selectedTable || ''} 
                      onChange={(e) => setSelectedTable(Number(e.target.value))}
                      className="bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select</option>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Table {n}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat as string}
                    onClick={() => setSelectedCategory(cat as string)}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10' 
                        : 'bg-white text-stone-400 hover:bg-stone-50 border border-stone-100'
                    }`}
                  >
                    {cat as string}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item: any) => (
                  <motion.div 
                    layout
                    key={item._id}
                    className="bg-white p-5 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
                  >
                    <div className="relative h-48 mb-4 overflow-hidden rounded-2xl bg-stone-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Coffee size={48} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-stone-800">{item.name}</h3>
                      <p className="text-lg font-black text-amber-700">Rs. {item.price}</p>
                    </div>
                    <p className="text-xs text-stone-400 font-medium line-clamp-2 mb-6 h-8">{item.description}</p>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-stone-50 text-stone-800 font-bold py-3 rounded-2xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                      Add to Order
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm sticky top-24">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                    <ShoppingCart size={20} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">Your Order</h3>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                        <Utensils size={32} />
                      </div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Cart is empty</p>
                    </div>
                  ) : (
                    cart.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between group">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-stone-800">{item.name}</p>
                          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Rs. {item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                          <button onClick={() => removeFromCart(item._id)} className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-stone-400 hover:text-stone-900">
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black text-stone-800 w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-stone-400 hover:text-stone-900">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-stone-100 space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-stone-800">Rs. {total}</p>
                    </div>
                    <button 
                      onClick={onPlaceOrder}
                      className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-900/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Place Order
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-stone-800">My Orders</h2>
              <p className="text-stone-400 text-sm font-medium mt-1">Track your active and past orders.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                  <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                    <Clock size={40} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">No orders yet</h3>
                  <p className="text-stone-400 text-sm mt-2">Start ordering from our fresh menu!</p>
                </div>
              ) : (
                orders.map((order: any) => (
                  <div key={order._id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-50 p-3 rounded-2xl text-amber-700">
                        <ShoppingCart size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total</p>
                        <p className="text-lg font-black text-stone-800">Rs. {order.totalAmount}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </div>
                      {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => setSelectedOrderForPayment(order)}
                          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-stone-900/10"
                        >
                          <Wallet size={14} />
                          Pay Now
                        </button>
                      )}
                      {order.status === 'Paid' && (
                        <button 
                          onClick={() => setShowFeedbackForm(order._id)}
                          className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                          title="Leave Feedback"
                        >
                          <Star size={18} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {showFeedbackForm && (
              <FeedbackForm 
                orderId={showFeedbackForm} 
                onClose={() => setShowFeedbackForm(null)} 
                onSuccess={onUpdate} 
              />
            )}
            {selectedOrderForPayment && (
              <PaymentModal
                isOpen={!!selectedOrderForPayment}
                onClose={() => setSelectedOrderForPayment(null)}
                order={selectedOrderForPayment}
                token={token}
                onSuccess={onUpdate}
              />
            )}
          </div>
        );

      case 'reservations':
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-stone-800">My Reservations</h2>
                <p className="text-stone-400 text-sm font-medium mt-1">Manage your table bookings.</p>
              </div>
              <button 
                onClick={() => setShowReservationForm(true)}
                className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-stone-900/10"
              >
                <PlusCircle size={18} />
                Book a Table
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {reservations.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                  <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                    <Calendar size={40} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">No reservations</h3>
                  <p className="text-stone-400 text-sm mt-2">Book a table for your next visit.</p>
                </div>
              ) : (
                reservations.map((res: any) => (
                  <div key={res._id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-700">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800">Table #{res.tableNumber}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {new Date(res.reservationDate).toLocaleDateString()} at {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Guests</p>
                        <p className="text-lg font-black text-stone-800">{res.numberOfGuests} People</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                        res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {res.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <ReservationForm 
              isOpen={showReservationForm}
              onClose={() => setShowReservationForm(false)}
              onSuccess={() => {}}
            />
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-stone-800">Payment History</h2>
              <p className="text-stone-400 text-sm font-medium mt-1">Review your past transactions.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {payments.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                  <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                    <CreditCard size={40} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">No payments</h3>
                  <p className="text-stone-400 text-sm mt-2">Your payment history will appear here.</p>
                </div>
              ) : (
                payments.map((payment: any) => (
                  <div key={payment._id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-700">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800">Payment Successful</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{new Date(payment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Amount Paid</p>
                        <p className="text-lg font-black text-stone-800">Rs. {payment.amount}</p>
                      </div>
                      <div className="px-4 py-2 bg-stone-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-400">
                        {payment.paymentMethod}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
            <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-black text-stone-800">Feature Coming Soon</h3>
            <p className="text-stone-400 text-sm mt-2">We are working hard to bring this feature to your customer experience.</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
