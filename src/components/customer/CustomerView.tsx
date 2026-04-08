import { motion, AnimatePresence } from 'motion/react';
import { Coffee, ShoppingCart, Plus, Clock, Calendar, CreditCard, CheckCircle, AlertCircle, Star, MessageSquare, PlusCircle, Wallet, ShoppingBag, XCircle, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { ReservationForm } from './ReservationForm';
import { PaymentModal } from './PaymentModal';
import { CartModal } from './CartModal';

import { API_BASE_URL } from '../../config';

interface CustomerViewProps {
  activeTab: string;
  menuItems: any[];
  orders: any[];
  reservations: any[];
  tables: any[];
  payments: any[];
  cart: any[];
  setCart: (cart: any[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onPlaceOrder: (orderData: any) => Promise<boolean>;
  token: string | null;
  user: any | null;
  onUpdate: () => void;
  setActiveTab: (tab: string) => void;
  loading: boolean;
  addNotification: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export function CustomerView({ 
  activeTab, menuItems, orders, reservations, tables, payments, cart, setCart, 
  selectedCategory, setSelectedCategory, onPlaceOrder,
  token, user, onUpdate, setActiveTab, loading, addNotification
}: CustomerViewProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any | null>(null);
  const isPopping = useRef(false);

  // Handle Browser Back Button for Customer Modals
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        isPopping.current = true;
        if (event.state.showCartModal !== undefined) setShowCartModal(event.state.showCartModal);
        if (event.state.showReservationForm !== undefined) setShowReservationForm(event.state.showReservationForm);
        if (event.state.showFeedbackForm !== undefined) setShowFeedbackForm(event.state.showFeedbackForm);
        if (event.state.isPaymentModalOpen === false) setSelectedOrderForPayment(null);
        
        setTimeout(() => { isPopping.current = false; }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync modal states to history
  useEffect(() => {
    if (isPopping.current) return;
    
    const currentState = window.history.state;
    if (!currentState) return;

    const isPaymentModalOpen = !!selectedOrderForPayment;
    const hasChanged = 
      currentState.showCartModal !== showCartModal ||
      currentState.showReservationForm !== showReservationForm ||
      currentState.showFeedbackForm !== showFeedbackForm ||
      currentState.isPaymentModalOpen !== isPaymentModalOpen;

    if (hasChanged) {
      window.history.pushState({ 
        ...currentState, 
        showCartModal, 
        showReservationForm, 
        showFeedbackForm,
        isPaymentModalOpen
      }, '');
    }
  }, [showCartModal, showReservationForm, showFeedbackForm, selectedOrderForPayment]);

  const categories = ['All', ...(Array.isArray(menuItems) ? [...new Set(menuItems.map((item: any) => item.category))] : [])];
  const filteredItems = Array.isArray(menuItems) 
    ? (selectedCategory === 'All' ? menuItems : menuItems.filter((item: any) => item.category === selectedCategory))
    : [];

  const addToCart = (item: any) => {
    if (!Array.isArray(cart)) return;
    const existing = cart.find((c: any) => c && c._id === item._id);
    if (existing) {
      if (existing.quantity >= item.stockQuantity) {
        addNotification(`Only ${item.stockQuantity} items available in stock`, 'warning');
        return;
      }
      setCart(cart.map((c: any) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      if (item.stockQuantity <= 0) {
        addNotification(`Item out of stock`, 'warning');
        return;
      }
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    addNotification(`${item.name} added to cart`, 'success');
  };

  const onCancelReservation = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onUpdate();
        addNotification('Reservation cancelled successfully', 'success');
      }
    } catch (err) {
      console.error('Cancel reservation error:', err);
    }
  };

  const onClearOrderHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your order history? (Only Paid and Cancelled orders will be removed)')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onUpdate();
        addNotification('Order history cleared', 'success');
      }
    } catch (err) {
      console.error('Clear order history error:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
      case 'dashboard':
        return (
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="flex-1 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-800">Fresh Menu</h2>
                  <p className="text-stone-400 text-xs sm:text-sm font-medium mt-1">Select your favorite items and place an order.</p>
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {categories.map(cat => (
                  <button
                    key={cat as string}
                    onClick={() => setSelectedCategory(cat as string)}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
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
              <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredItems.map((item: any) => (
                  <motion.div 
                    layout
                    key={item._id}
                    className="bg-white p-4 sm:p-5 rounded-[2rem] sm:rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
                  >
                    <div className="relative h-32 sm:h-48 mb-3 sm:mb-4 overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Coffee size={32} className="sm:w-12 sm:h-12" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 sm:mb-2">
                      <h3 className="text-sm sm:text-lg font-black text-stone-800 truncate">{item.name}</h3>
                      <p className="text-sm sm:text-lg font-black text-amber-700">Rs. {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        item.stockQuantity <= (item.lowStockThreshold || 10) ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        Stock: {item.stockQuantity}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-stone-400 font-medium line-clamp-2 mb-4 sm:mb-6 h-6 sm:h-8">{item.description}</p>
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={item.stockQuantity <= 0}
                      className="w-full bg-stone-50 text-stone-800 text-xs sm:text-base font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px] group-hover/btn:rotate-90 transition-transform" />
                      {item.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Order'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-stone-800">Order History</h2>
                <p className="text-stone-400 text-sm font-medium mt-1">Track your active and past orders.</p>
              </div>
              {orders.some((o: any) => o.status === 'Paid' || o.status === 'Cancelled') && (
                <button 
                  onClick={onClearOrderHistory}
                  className="flex items-center gap-2 bg-stone-100 text-stone-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  <Trash2 size={18} />
                  Clear History
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {!Array.isArray(orders) || orders.length === 0 ? (
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
                        <p className="text-sm font-black text-stone-800">Order #{order?._id ? order._id.slice(-6).toUpperCase() : 'N/A'}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order?.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                            <span key={idx} className="text-[9px] font-bold bg-stone-50 text-stone-500 px-1.5 py-0.5 rounded">
                              {item.menuItem?.name || 'Item'} x{item.quantity}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                          {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date N/A'}
                        </p>
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
          </div>
        );

      case 'reservations':
        const myReservations = Array.isArray(reservations) ? reservations.filter((res: any) => res && res.user === user?._id) : [];
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
              {!Array.isArray(myReservations) || myReservations.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                  <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                    <Calendar size={40} />
                  </div>
                  <h3 className="text-xl font-black text-stone-800">No reservations</h3>
                  <p className="text-stone-400 text-sm mt-2">Book a table for your next visit.</p>
                </div>
              ) : (
                myReservations.map((res: any) => (
                  <div key={res._id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-700">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800">Table #{res.tableNumber}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {new Date(res.reservationTime).toLocaleDateString()} at {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      {(res.status === 'Pending' || res.status === 'Confirmed') && (
                        <button 
                          onClick={() => onCancelReservation(res._id)}
                          className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                          title="Cancel Reservation"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <ReservationForm 
              isOpen={showReservationForm}
              onClose={() => setShowReservationForm(false)}
              onSuccess={() => {
                onUpdate();
                setShowReservationForm(false);
              }}
              token={token}
              reservations={reservations}
              orders={orders}
              tables={tables}
            />
          </div>
        );

      case 'payments':
        const pendingOrders = Array.isArray(orders) ? orders.filter((o: any) => o && o.status !== 'Paid' && o.status !== 'Cancelled') : [];
        return (
          <div className="space-y-12">
            {/* Pending Payments */}
            {pendingOrders.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-stone-800">Pending Payments</h2>
                  <p className="text-stone-400 text-xs font-medium mt-1">Select an order below to complete your payment.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {pendingOrders.map((order: any) => (
                    <div key={order._id} className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-stone-800">Order #{order?._id ? order._id.slice(-6).toUpperCase() : 'N/A'}</p>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total: Rs. {order?.totalAmount || 0}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedOrderForPayment(order)}
                        className="bg-stone-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-stone-900/10 flex items-center gap-2"
                      >
                        <CreditCard size={16} />
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-stone-800">Payment History</h2>
                <p className="text-stone-400 text-xs font-medium mt-1">Review your past transactions.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {!Array.isArray(payments) || payments.length === 0 ? (
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
    <div className="relative min-h-[calc(100vh-120px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      {showFeedbackForm && (
        <FeedbackForm 
          orderId={showFeedbackForm} 
          onClose={() => setShowFeedbackForm(null)} 
          onSuccess={onUpdate} 
          token={token}
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

      {/* Floating Cart Button - Accessible from any tab */}
      <AnimatePresence>
        {cart.length > 0 && activeTab !== 'orders' && (
          <motion.button
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 20, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCartModal(true)}
            className="fixed bottom-8 right-6 sm:right-10 z-[100] bg-stone-900 text-white p-4 sm:p-5 rounded-[2rem] shadow-2xl flex items-center gap-3 border border-white/10"
          >
            <div className="relative">
              <ShoppingBag size={24} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-stone-900">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:block">View Order</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fullscreen Cart Modal */}
      <CartModal 
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        cart={cart}
        setCart={setCart}
        reservations={reservations}
        orders={orders}
        tables={tables}
        user={user}
        onBookTable={() => {
          setShowCartModal(false);
          setActiveTab('reservations');
          setShowReservationForm(true);
        }}
        onPlaceOrder={async (orderData) => {
          const success = await onPlaceOrder(orderData);
          if (success) setShowCartModal(false);
          return success;
        }}
        loading={loading}
        addNotification={addNotification}
      />
    </div>
  );
}
