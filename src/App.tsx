import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, CreditCard, Users, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from './config';

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
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');
  
  // Data states
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Customer states
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

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
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      if (activeTab === 'menu' || activeTab === 'dashboard') {
        const res = await fetch(`${API_BASE_URL}/api/menu`, { headers });
        const data = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      }
      if (activeTab === 'orders' || activeTab === 'dashboard') {
        const res = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
      if (activeTab === 'payments' || activeTab === 'dashboard') {
        const res = await fetch(`${API_BASE_URL}/api/payments`, { headers });
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      }
      if (activeTab === 'reservations' || activeTab === 'dashboard') {
        const res = await fetch(`${API_BASE_URL}/api/reservations`, { headers });
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      }
      if (activeTab === 'feedback' || activeTab === 'dashboard') {
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
        setViewMode(data.user.role === 'customer' ? 'customer' : 'admin');
        setActiveTab('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message || 'Check if Backend is running'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedTable) {
      addNotification('Please select a table number first', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tableNumber: selectedTable,
          items: cart.map(item => ({
            menuItem: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
          orderType: 'Dine-in'
        })
      });
      if (res.ok) {
        setCart([]);
        addNotification('Order placed successfully!', 'success');
        setActiveTab('orders');
        // fetchData will be triggered by activeTab change effect
      } else {
        const data = await res.json();
        addNotification(data.message || 'Failed to place order', 'warning');
      }
    } catch (err) {
      setError('Connection error while placing order');
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
                  payments={payments}
                  cart={cart} setCart={setCart} 
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                  onPlaceOrder={handlePlaceOrder}
                  token={token}
                  onUpdate={fetchData}
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
                          {activeTab === 'reservations' && 'Track table bookings and guest schedules.'}
                          {activeTab === 'payments' && 'Monitor transactions and financial records.'}
                          {activeTab === 'staff' && 'Manage your team members and roles.'}
                          {activeTab === 'feedback' && 'Read and respond to customer reviews.'}
                          {activeTab === 'about' && 'Learn more about CafeSync and the development team.'}
                        </p>
                      </div>
                      {activeTab !== 'dashboard' && activeTab !== 'about' && activeTab !== 'staff' && (
                        <button 
                          onClick={() => { if (activeTab === 'menu') setShowAddItemModal(true); }}
                          className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-stone-900/10 active:scale-95"
                        >
                          <Plus size={20} strokeWidth={2.5} />
                          Add New
                        </button>
                      )}
                    </div>

                    {activeTab === 'dashboard' && <Dashboard payments={payments} orders={orders} reservations={reservations} menuItems={menuItems} setActiveTab={setActiveTab} />}
                    {activeTab === 'menu' && <MenuManagement menuItems={menuItems} token={token} onUpdateMenu={fetchData} />}
                    {activeTab === 'orders' && <OrderManagement orders={orders} token={token} onUpdateOrder={fetchData} />}
                    {activeTab === 'inventory' && <InventoryManagement menuItems={menuItems} token={token} onUpdate={fetchData} />}
                    {activeTab === 'reservations' && <ReservationManagement reservations={reservations} token={token} onUpdate={fetchData} />}
                    {activeTab === 'staff' && <StaffManagement token={token} />}
                    {activeTab === 'feedback' && <FeedbackManagement feedback={feedback} />}
                    {activeTab === 'about' && <About />}
                    
                    {(activeTab === 'payments') && (
                      <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                        <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                          {activeTab === 'payments' && <CreditCard size={40} />}
                        </div>
                        <h3 className="text-xl font-black text-stone-800">Module Ready for Integration</h3>
                        <p className="text-stone-400 text-sm mt-2 max-w-md mx-auto">
                          This module is fully configured in the backend. Connect your React Native components to the <code>/api/{activeTab}</code> endpoint to start managing data.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        <AddItemModal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} />
      </main>

      {/* Notifications Toast */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
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
