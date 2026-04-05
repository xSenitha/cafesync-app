import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, ShoppingCart, CreditCard, Calendar, User, LogIn, Plus, 
  CheckCircle, LayoutDashboard, Users, MessageSquare, TrendingUp,
  Clock, AlertCircle, ChevronRight, LogOut, Search, Filter, Trash2,
  Menu, X
} from 'lucide-react';
import { API_BASE_URL } from './config';

export default function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data states
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

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
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
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
      console.error('Login Error:', err);
      setError(`Connection Error: ${err.message || 'Check if Backend is running'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900 font-sans selection:bg-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {user && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-2.5 rounded-xl text-white shadow-lg shadow-amber-900/20">
            <Coffee size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-stone-800 leading-none">CafeSync</h1>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Management Suite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {health && (
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">System Live</span>
              </div>
              <span className={`text-[9px] font-black uppercase ${health.database === 'Connected' ? 'text-emerald-600' : 'text-red-500'}`}>
                DB: {health.database}
              </span>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-3 pl-6 border-l border-stone-100">
              <div className="text-right hidden xs:block">
                <p className="text-xs font-bold text-stone-800">{user.name}</p>
                <p className="text-[10px] font-medium text-stone-400 capitalize">{user.role}</p>
              </div>
              <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 border border-stone-200">
                <User size={18} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {activeTab === 'auth' && !user && (
          <div className="max-w-md mx-auto mt-12 sm:mt-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-100"
            >
              <div className="text-center mb-10">
                <div className="inline-flex bg-amber-50 p-4 rounded-3xl text-amber-700 mb-4">
                  <Coffee size={32} />
                </div>
                <h2 className="text-3xl font-black text-stone-800">Welcome Back</h2>
                <p className="text-stone-400 text-sm mt-2">Manage your cafe with precision and ease.</p>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-center gap-3"
                >
                  <CheckCircle size={18} />
                  {success}
                </motion.div>
              )}

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-stone-900/10 active:scale-[0.98]"
                  >
                    {loading ? 'Authenticating...' : <><LogIn size={18} strokeWidth={2.5} /> Sign In</>}
                  </button>
                  <button 
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-white text-stone-900 border-2 border-stone-100 font-bold py-4 rounded-2xl hover:bg-stone-50 transition-all disabled:opacity-50 active:scale-[0.98]"
                  >
                    {loading ? 'Creating Account...' : 'Create New Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {user && (
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
                />
              )}
            </AnimatePresence>

            {/* Navigation Sidebar */}
            <motion.aside 
              initial={false}
              animate={{ 
                x: isSidebarOpen ? 0 : -300,
                opacity: isSidebarOpen ? 1 : 0,
                width: isSidebarOpen ? '256px' : '0px'
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed lg:relative lg:translate-x-0 lg:opacity-100 lg:w-64 z-50 lg:z-0 bg-white lg:bg-transparent h-[calc(100vh-80px)] lg:h-auto top-20 lg:top-0 left-0 p-6 lg:p-0 border-r lg:border-r-0 border-stone-100 overflow-hidden flex-shrink-0`}
            >
              <nav className="space-y-1.5 sticky top-24">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
                <div className="pt-6 pb-2 px-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Operations</p>
                </div>
                <NavItem icon={<ShoppingCart size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} badge={orders.filter(o => o.status === 'Pending').length} />
                <NavItem icon={<Coffee size={20} />} label="Menu" active={activeTab === 'menu'} onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }} />
                <NavItem icon={<Calendar size={20} />} label="Reservations" active={activeTab === 'reservations'} onClick={() => { setActiveTab('reservations'); setIsSidebarOpen(false); }} />
                <NavItem icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} />
                
                <div className="pt-6 pb-2 px-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Management</p>
                </div>
                <NavItem icon={<Users size={20} />} label="Staff" active={activeTab === 'staff'} onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }} />
                <NavItem icon={<MessageSquare size={20} />} label="Feedback" active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }} />
                
                <div className="pt-10">
                  <button 
                    onClick={() => { setUser(null); setToken(null); setActiveTab('auth'); setIsSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                  >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </nav>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Tab Header */}
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
                      </p>
                    </div>
                    {activeTab !== 'dashboard' && (
                      <button className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-stone-900/10 active:scale-95">
                        <Plus size={20} strokeWidth={2.5} />
                        Add New
                      </button>
                    )}
                  </div>

                  {/* Dashboard Content */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Sales" value={`Rs. ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-emerald-500" />
                        <StatCard label="Active Orders" value={orders.filter(o => o.status !== 'Paid' && o.status !== 'Cancelled').length} icon={<ShoppingCart size={20} />} color="bg-amber-500" />
                        <StatCard label="Reservations" value={reservations.filter(r => r.status === 'Confirmed').length} icon={<Calendar size={20} />} color="bg-blue-500" />
                        <StatCard label="Menu Items" value={menuItems.length} icon={<Coffee size={20} />} color="bg-purple-500" />
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-stone-800 flex items-center gap-2">
                              <Clock size={18} className="text-amber-600" /> Recent Orders
                            </h3>
                            <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-amber-700 hover:underline">View All</button>
                          </div>
                          <div className="space-y-4">
                            {orders.slice(0, 4).map((order: any) => (
                              <div key={order._id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <div className="flex items-center gap-4">
                                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                                    <ShoppingCart size={18} className="text-stone-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-stone-800">Table #{order.tableNumber || 'N/A'}</p>
                                    <p className="text-[10px] font-medium text-stone-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</p>
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Team Responsibilities */}
                        <div className="bg-stone-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-stone-900/20 relative overflow-hidden">
                          <div className="relative z-10">
                            <h3 className="text-xl font-black mb-6">Project Team</h3>
                            <div className="space-y-6">
                              <TeamMember name="Gihen H.S" id="IT24103788" role="Order Management" />
                              <TeamMember name="Bandara P.M.A.N" id="IT24104140" role="Billing & Payments" />
                              <TeamMember name="Kasfbi A.J" id="IT24102666" role="Menu & Inventory" />
                              <TeamMember name="Peiris H.M.D" id="IT24100953" role="Table & Reservations" />
                            </div>
                          </div>
                          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-700/20 rounded-full blur-3xl"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Tab */}
                  {activeTab === 'menu' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {menuItems.map((item: any) => (
                        <motion.div 
                          layout
                          key={item._id} 
                          className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
                        >
                          <div className="relative h-48 mb-4 overflow-hidden rounded-2xl bg-stone-100">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <Coffee size={48} strokeWidth={1.5} />
                              </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-stone-800 shadow-sm">
                              {item.category}
                            </div>
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-black text-stone-800">{item.name}</h3>
                            <p className="text-lg font-black text-amber-700">Rs. {item.price}</p>
                          </div>
                          <p className="text-xs text-stone-400 font-medium line-clamp-2 mb-4 h-8">{item.description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${item.stockQuantity > 5 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{item.stockQuantity} in stock</span>
                            </div>
                            <button className="text-stone-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-100">
                            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Customer/Table</th>
                            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                          {orders.map((order: any) => (
                            <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="text-xs font-bold text-stone-800">#{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-[10px] font-medium text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-stone-800">{order.customerName || `Table ${order.tableNumber}`}</p>
                                <p className="text-[10px] font-medium text-stone-400">{order.orderType}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                                  order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-stone-400 hover:text-stone-900 transition-colors">
                                  <ChevronRight size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Other tabs placeholder */}
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
                      <div className="mt-8 flex justify-center gap-4">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">
                          API: Functional
                        </div>
                        <div className="px-4 py-2 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full border border-blue-100">
                          DB: Synced
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all group ${
        active 
          ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10' 
          : 'text-stone-500 hover:bg-stone-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-amber-500' : 'group-hover:text-stone-900'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-amber-500 text-stone-900' : 'bg-amber-100 text-amber-700'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-5">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-stone-200`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-stone-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function TeamMember({ name, id, role }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[10px] font-black">
          {name.split(' ')[0][0]}
        </div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-white/40 font-medium">{id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">{role}</p>
      </div>
    </div>
  );
}
