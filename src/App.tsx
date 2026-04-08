import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, CreditCard, Users, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from './config';
import { App as CapApp } from '@capacitor/app';

// Components
import { Header } from './components/layout/Header';
import { Auth } from './components/auth/Auth';
import { Sidebar } from './components/admin/Sidebar';
import { Dashboard } from './components/admin/Dashboard';
import { OrderManagement } from './components/admin/OrderManagement';
import { MenuManagement } from './components/admin/MenuManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { ReservationManagement } from './components/admin/ReservationManagement';
import { StaffManagement } from './components/admin/StaffManagement';
import { FeedbackManagement } from './components/admin/FeedbackManagement';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { CustomerView } from './components/customer/CustomerView';
import { AddItemModal } from './components/admin/AddItemModal';
import { About } from './components/admin/About';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');
  
  // Data states
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const isPopping = useRef(false);
  const lastExitPress = useRef(0);

  // Navigation History Management
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        isPopping.current = true;
        const { activeTab: stateTab, viewMode: stateMode, showAddItemModal: stateModal, isSidebarOpen: stateSidebar } = event.state;
        if (stateTab) setActiveTab(stateTab);
        if (stateMode) setViewMode(stateMode);
        if (stateModal !== undefined) setShowAddItemModal(stateModal);
        if (stateSidebar !== undefined) setIsSidebarOpen(stateSidebar);
        
        // Brief timeout to let states update before allowing new pushes
        setTimeout(() => { isPopping.current = false; }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Capacitor Hardware Back Button
    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack || window.history.length <= 1) {
        const now = Date.now();
        if (now - lastExitPress.current < 2000) {
          CapApp.exitApp();
        } else {
          lastExitPress.current = now;
          addNotification('Press back again to exit', 'info');
        }
      } else {
        window.history.back();
      }
    });
    
    // Initial state
    window.history.replaceState({ activeTab, viewMode, showAddItemModal, isSidebarOpen }, '');

    return () => {
      window.removeEventListener('popstate', handlePopState);
      backListener.then(l => l.remove());
    };
  }, []);

  // Sync state to history
  useEffect(() => {
    if (activeTab === 'auth' || isPopping.current) return;
    
    const currentState = window.history.state;
    const hasChanged = !currentState || 
        currentState.activeTab !== activeTab || 
        currentState.viewMode !== viewMode || 
        currentState.showAddItemModal !== showAddItemModal ||
        currentState.isSidebarOpen !== isSidebarOpen;

    if (hasChanged) {
      window.history.pushState({ activeTab, viewMode, showAddItemModal, isSidebarOpen }, '');
    }
  }, [activeTab, viewMode, showAddItemModal, isSidebarOpen]);

  // Customer states
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`);
        const data = await res.json();
        setHealth(data);
      } catch (err: any) {
        setError(`Cannot connect to Backend at ${API_BASE_URL}. Error: ${err.message}`);
      }
    };
    checkHealth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    if (!token) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    const isCustomer = user?.role === 'customer';

    try {
      // Menu items are needed for both admin and customer (menu/dashboard)
      if (activeTab === 'menu' || activeTab === 'dashboard' || activeTab === 'reservations' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/menu`, { headers });
        const data = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      }

      // Orders are needed for admin (orders/dashboard) and customer (for table availability)
      if (activeTab === 'orders' || activeTab === 'dashboard' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }

      // Payments are needed for admin (payments/dashboard) and customer (payment history)
      if (activeTab === 'payments' || activeTab === 'dashboard' || (isCustomer && activeTab === 'payments')) {
        const res = await fetch(`${API_BASE_URL}/api/payments`, { headers });
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      }

      // Reservations and Tables are CRITICAL for customer table selection in cart
      if (activeTab === 'reservations' || activeTab === 'dashboard' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/reservations`, { headers });
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
        
        const tablesRes = await fetch(`${API_BASE_URL}/api/tables`, { headers });
        const tablesData = await tablesRes.json();
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }

      // Feedback is needed for admin (feedback/dashboard) and customer (feedback tab)
      if (activeTab === 'feedback' || activeTab === 'dashboard' || (isCustomer && activeTab === 'feedback')) {
        const res = await fetch(`${API_BASE_URL}/api/feedback`, { headers });
        const data = await res.json();
        setFeedback(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const playNotification = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    playNotification();
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Polling for new orders, status changes, and inventory updates (Real-time simulation)
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        // Fetch Orders
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) {
          // Check for new orders (only for admin)
          if (viewMode === 'admin' && ordersData.length > orders.length) {
            const newOrder = ordersData[0];
            addNotification(`New Order received! Table ${newOrder.tableNumber}`, 'success');
          }
          
          // Check for status changes in existing orders
          ordersData.forEach(newOrder => {
            const oldOrder = orders.find(o => o._id === newOrder._id);
            if (oldOrder && oldOrder.status !== newOrder.status) {
              addNotification(`Order #${newOrder._id.slice(-6).toUpperCase()} status updated to ${newOrder.status}`, 'info');
            }
          });

          setOrders(ordersData);
        }

        // Fetch Payments
        const paymentsRes = await fetch(`${API_BASE_URL}/api/payments`, { headers });
        const paymentsData = await paymentsRes.json();
        if (Array.isArray(paymentsData)) {
          // Check for new payments (only for admin)
          if (viewMode === 'admin' && paymentsData.length > payments.length) {
            const newPayment = paymentsData[0];
            addNotification(`New Payment received! Rs. ${newPayment.amount}`, 'success');
          }
          setPayments(paymentsData);
        }

        // Fetch Menu (Inventory)
        const menuRes = await fetch(`${API_BASE_URL}/api/menu`, { headers });
        const menuData = await menuRes.json();
        if (Array.isArray(menuData)) {
          // Check for low stock notifications (only for admin)
          if (viewMode === 'admin') {
            menuData.forEach(newItem => {
              const oldItem = menuItems.find(i => i._id === newItem._id);
              if (oldItem && newItem.stockQuantity <= (newItem.lowStockThreshold || 10) && oldItem.stockQuantity > (newItem.lowStockThreshold || 10)) {
                addNotification(`Low stock alert: ${newItem.name} (${newItem.stockQuantity} left)`, 'warning');
              }
            });
          }
          setMenuItems(menuData);
        }

        // Fetch Reservations
        const reservationsRes = await fetch(`${API_BASE_URL}/api/reservations`, { headers });
        const reservationsData = await reservationsRes.json();
        if (Array.isArray(reservationsData)) {
          // Check for new reservations (only for admin)
          if (viewMode === 'admin' && reservationsData.length > reservations.length) {
            const newRes = reservationsData[0];
            addNotification(`New Reservation from ${newRes.customerName}!`, 'success');
          }
          setReservations(reservationsData);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000); // Poll every 5 seconds for better "real-time" feel
    return () => clearInterval(interval);
  }, [token, orders, menuItems, viewMode]);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created successfully! Please sign in with your credentials.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message || 'Check if Backend is running'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        const initialMode = data.user.role === 'customer' ? 'customer' : 'admin';
        setViewMode(initialMode);
        setActiveTab('dashboard');
        // Replace the 'auth' state in history with the logged in state
        window.history.replaceState({ activeTab: 'dashboard', viewMode: initialMode, showAddItemModal: false, isSidebarOpen: false }, '');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message || 'Check if Backend is running'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (item: any) => {
    try {
      const url = item._id ? `${API_BASE_URL}/api/menu/${item._id}` : `${API_BASE_URL}/api/menu`;
      const method = item._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        addNotification(`${item.name} ${item._id ? 'updated' : 'added to menu'}`, 'success');
        fetchData();
        setEditingItem(null);
      } else {
        const data = await res.json();
        addNotification(data.message || 'Failed to save item', 'warning');
      }
    } catch (err) {
      console.error('Save item error:', err);
      addNotification('Connection error', 'warning');
    }
  };

  const handlePlaceOrder = async (orderData: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tableNumber: orderData.tableNumber,
          items: orderData.items.map((item: any) => ({
            menuItem: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: orderData.totalAmount,
          orderType: orderData.orderType
        })
      });
      if (res.ok) {
        setCart([]);
        addNotification('Order placed successfully!', 'success');
        setActiveTab('orders');
        // fetchData will be triggered by activeTab change effect
        return true;
      } else {
        const data = await res.json();
        addNotification(data.message || 'Failed to place order', 'warning');
        return false;
      }
    } catch (err) {
      addNotification('Connection error while placing order', 'warning');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-amber-100">
      <Header 
        user={user} 
        health={health} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <main className="max-w-7xl mx-auto p-3 sm:p-8">
        {activeTab === 'auth' && !user && (
          <Auth 
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            loading={loading} error={error} success={success}
            handleLogin={handleLogin} handleRegister={handleRegister}
          />
        )}

        {user && (
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Sidebar is always available on mobile, but hidden on desktop in customer view */}
            <div className={viewMode === 'customer' ? 'lg:hidden' : ''}>
              <Sidebar 
                isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                orders={orders}
                reservations={reservations}
                user={user}
                onSignOut={() => { setUser(null); setToken(null); setActiveTab('auth'); setIsSidebarOpen(false); }}
                viewMode={viewMode}
              />
            </div>

            <div className="flex-1 min-w-0">
              {viewMode === 'customer' ? (
                <CustomerView 
                  activeTab={activeTab}
                  menuItems={menuItems} 
                  orders={orders}
                  reservations={reservations}
                  tables={tables}
                  payments={payments}
                  cart={cart} setCart={setCart} 
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  onPlaceOrder={handlePlaceOrder}
                  token={token}
                  user={user}
                  onUpdate={fetchData}
                  setActiveTab={setActiveTab}
                  loading={loading}
                  addNotification={addNotification}
                />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-stone-800 capitalize">{activeTab}</h2>
                        <p className="text-stone-400 text-sm font-medium mt-1">
                          {activeTab === 'dashboard' && 'Welcome back! Here is what is happening today.'}
                          {activeTab === 'orders' && 'Manage incoming and active customer orders.'}
                          {activeTab === 'menu' && 'Update your cafe menu and inventory items.'}
                          {activeTab === 'inventory' && 'Track stock levels and manage supplies.'}
                          {activeTab === 'reservations' && 'Track table bookings and guest schedules.'}
                          {activeTab === 'payments' && 'Monitor transactions and financial records.'}
                          {activeTab === 'staff' && 'Manage your team members, roles, and permissions.'}
                          {activeTab === 'feedback' && 'Read and respond to customer reviews.'}
                          {activeTab === 'about' && 'Learn more about CafeSync and the development team.'}
                        </p>
                      </div>
                      {activeTab !== 'dashboard' && activeTab !== 'about' && activeTab !== 'staff' && (
                        <button 
                          onClick={() => { if (activeTab === 'menu' || activeTab === 'inventory') setShowAddItemModal(true); }}
                          className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-stone-900/10 active:scale-95"
                        >
                          <Plus size={20} strokeWidth={2.5} />
                          Add New
                        </button>
                      )}
                    </div>

                    {activeTab === 'dashboard' && <Dashboard payments={payments} orders={orders} reservations={reservations} tables={tables} menuItems={menuItems} setActiveTab={setActiveTab} />}
                    {activeTab === 'menu' && <MenuManagement menuItems={menuItems} token={token} onUpdateMenu={fetchData} onEditItem={(item) => { setEditingItem(item); setShowAddItemModal(true); }} />}
                    {activeTab === 'orders' && <OrderManagement orders={orders} token={token} onUpdateOrder={fetchData} />}
                    {activeTab === 'inventory' && <InventoryManagement menuItems={menuItems} token={token} onUpdate={fetchData} />}
                    {activeTab === 'reservations' && <ReservationManagement reservations={reservations} orders={orders} tables={tables} token={token} onUpdate={fetchData} />}
                    {activeTab === 'payments' && <PaymentManagement payments={payments} token={token} />}
                    {activeTab === 'staff' && <StaffManagement token={token} currentUser={user} />}
                    {activeTab === 'feedback' && <FeedbackManagement feedback={feedback} />}
                    {activeTab === 'about' && <About />}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        <AddItemModal 
          isOpen={showAddItemModal} 
          onClose={() => { setShowAddItemModal(false); setEditingItem(null); }} 
          onSave={handleAddItem}
          initialData={editingItem}
        />
      </main>

      {/* Notifications Toast */}
      <div className="fixed top-6 right-6 z-[200] space-y-3">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-center gap-4 p-4 rounded-2xl shadow-2xl border min-w-[300px] ${
                n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                n.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                'bg-white border-stone-100 text-stone-800'
              }`}
            >
              <div className={`p-2 rounded-xl ${
                n.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                'bg-stone-100 text-stone-600'
              }`}>
                {n.type === 'success' ? <CheckCircle size={20} /> :
                 n.type === 'warning' ? <AlertTriangle size={20} /> :
                 <Info size={20} />}
              </div>
              <p className="flex-1 text-sm font-bold">{n.message}</p>
              <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
