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
import { CustomerView } from './components/customer/CustomerView';
import { AddItemModal } from './components/admin/AddItemModal';
import { About } from './components/admin/About';

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
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'admin' })
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
      setError('Please select a table number first');
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
        setSuccess('Order placed successfully!');
        fetchData();
      } else {
        setError('Failed to place order');
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

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
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
                activeTab={activeTab} setActiveTab={setActiveTab}
                orders={orders}
                onSignOut={() => { setUser(null); setToken(null); setActiveTab('auth'); setIsSidebarOpen(false); }}
              />
            </div>

            <div className="flex-1 min-w-0">
              {viewMode === 'customer' ? (
                <CustomerView 
                  menuItems={menuItems} 
                  cart={cart} setCart={setCart} 
                  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
                  selectedTable={selectedTable} setSelectedTable={setSelectedTable}
                  onPlaceOrder={handlePlaceOrder}
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
                      {activeTab !== 'dashboard' && activeTab !== 'about' && (
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
                    {activeTab === 'menu' && <MenuManagement menuItems={menuItems} />}
                    {activeTab === 'orders' && <OrderManagement orders={orders} />}
                    {activeTab === 'about' && <About />}
                    
                    {(activeTab === 'reservations' || activeTab === 'payments' || activeTab === 'staff' || activeTab === 'feedback') && (
                      <div className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-sm text-center">
                        <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                          {activeTab === 'reservations' && <Calendar size={40} />}
                          {activeTab === 'payments' && <CreditCard size={40} />}
                          {activeTab === 'staff' && <Users size={40} />}
                          {activeTab === 'feedback' && <MessageSquare size={40} />}
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
    </div>
  );
}
