import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert, Dimensions } from 'react-native';
import { Plus, CheckCircle, Info, AlertTriangle, X } from 'lucide-react-native';
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
import { PaymentManagement } from './components/admin/PaymentManagement';
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

  // Customer states
  const [cart, setCart] = useState<any[]>([]);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      const url = `${API_BASE_URL}/api/health`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        } else {
          console.warn(`⚠️ Health check: ${res.status} from ${url}`);
        }
      } catch (err: any) {
        console.warn(`⏳ Waiting for backend at ${url}...`);
      }
    };
    
    checkHealth();
    const timer = setInterval(() => {
      if (!health) checkHealth();
    }, 5000);
    return () => clearInterval(timer);
  }, [health]);

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
      if (activeTab === 'menu' || activeTab === 'dashboard' || activeTab === 'reservations' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/menu`, { headers });
        const data = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      }

      if (activeTab === 'orders' || activeTab === 'dashboard' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }

      if (activeTab === 'payments' || activeTab === 'dashboard' || (isCustomer && activeTab === 'payments')) {
        const res = await fetch(`${API_BASE_URL}/api/payments`, { headers });
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      }

      if (activeTab === 'reservations' || activeTab === 'dashboard' || isCustomer) {
        const res = await fetch(`${API_BASE_URL}/api/reservations`, { headers });
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
        
        const tablesRes = await fetch(`${API_BASE_URL}/api/tables`, { headers });
        const tablesData = await tablesRes.json();
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }

      if (activeTab === 'feedback' || activeTab === 'dashboard' || (isCustomer && activeTab === 'feedback')) {
        const res = await fetch(`${API_BASE_URL}/api/feedback`, { headers });
        const data = await res.json();
        setFeedback(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-dismiss
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Polling logic removed for clarity or implemented similarly
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000); 
    return () => clearInterval(interval);
  }, [token]);

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
        setSuccess('Account created! Please sign in.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const url = `${API_BASE_URL}/api/auth/login`;
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    console.log(`🔑 Login Request: POST ${fullUrl}`);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(`❌ Non-JSON response from ${fullUrl}:`, text.substring(0, 500));
        if (text.toLowerCase().includes('<!doctype html>')) {
          throw new Error('Server returned HTML (likely SPA fallback) instead of JSON. Check if the backend is running correctly at ' + fullUrl);
        }
        throw new Error('Invalid server response format.');
      }

      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        const initialMode = data.user.role === 'customer' ? 'customer' : 'admin';
        setViewMode(initialMode);
        setActiveTab('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error(`Login error at ${url}:`, err);
      setError(`Connection Error: ${err.message}`);
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
        addNotification(`${item.name} saved`, 'success');
        fetchData();
        setEditingItem(null);
      } else {
        const data = await res.json();
        addNotification(data.message || 'Failed to save item', 'warning');
      }
    } catch (err) {
      addNotification('Connection error', 'warning');
    }
  };

  const handlePlaceOrder = async (orderData: any) => {
    setLoading(true);
    try {
      const url = editingOrder ? `${API_BASE_URL}/api/orders/${editingOrder._id}` : `${API_BASE_URL}/api/orders`;
      const method = editingOrder ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
        setEditingOrder(null);
        addNotification('Order processed!', 'success');
        setActiveTab('dashboard');
        fetchData();
        return true;
      } else {
        const data = await res.json();
        addNotification(data.message || 'Failed to save order', 'warning');
        return false;
      }
    } catch (err) {
      addNotification('Connection error', 'warning');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FDFCFB' }}>
      <View style={{ backgroundColor: '#1c1917', padding: 2 }}>
        <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>CafeSync Debug Mode - Health: {health ? health.status : 'Checking...'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Header 
          user={user} 
          health={health} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />

        <View className="flex-1">
          {activeTab === 'auth' && !user && (
            <Auth 
              name={name} setName={setName}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              loading={loading} error={error} success={success}
              handleLogin={handleLogin} handleRegister={handleRegister}
              health={health}
            />
          )}

          {user && (
            <View className="flex-1 flex-row">
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

              <View className="flex-1 p-4">
                {viewMode === 'customer' ? (
                  <CustomerView 
                    activeTab={activeTab}
                    menuItems={menuItems} 
                    orders={orders}
                    reservations={reservations}
                    tables={tables}
                    payments={payments}
                    cart={cart} setCart={setCart} 
                    editingOrder={editingOrder} setEditingOrder={setEditingOrder}
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
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-6">
                      <View>
                        <Text className="text-2xl font-black text-stone-800 capitalize">{activeTab}</Text>
                        <Text className="text-stone-400 text-xs font-medium mt-1">
                          CafeSync Management Console
                        </Text>
                      </View>
                      {['menu', 'inventory'].includes(activeTab) && (
                        <TouchableOpacity 
                          onPress={() => setShowAddItemModal(true)}
                          className="bg-stone-900 px-5 py-3 rounded-2xl flex-row items-center gap-2 shadow-lg"
                        >
                          <Plus size={18} color="white" strokeWidth={2.5} />
                          <Text className="text-white font-bold text-xs uppercase">Add New</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {activeTab === 'dashboard' && <Dashboard payments={payments} orders={orders} reservations={reservations} tables={tables} menuItems={menuItems} setActiveTab={setActiveTab} />}
                    {activeTab === 'menu' && <MenuManagement menuItems={menuItems} token={token} onUpdateMenu={fetchData} onEditItem={(item) => { setEditingItem(item); setShowAddItemModal(true); }} />}
                    {activeTab === 'orders' && <OrderManagement orders={orders} token={token} onUpdateOrder={fetchData} />}
                    {activeTab === 'inventory' && <InventoryManagement menuItems={menuItems} token={token} onUpdate={fetchData} />}
                    {activeTab === 'reservations' && <ReservationManagement reservations={reservations} orders={orders} tables={tables} token={token} onUpdate={fetchData} />}
                    {activeTab === 'payments' && <PaymentManagement payments={payments} token={token} />}
                    {activeTab === 'staff' && <StaffManagement token={token} currentUser={user} />}
                    {activeTab === 'feedback' && <FeedbackManagement feedback={feedback} />}
                    {activeTab === 'about' && <About />}
                  </View>
                )}
              </View>
            </View>
          )}

          <AddItemModal 
            isOpen={showAddItemModal} 
            onClose={() => { setShowAddItemModal(false); setEditingItem(null); }} 
            onSave={handleAddItem}
            initialData={editingItem}
          />

          {/* Notifications stack */}
          <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
            {notifications.map(n => (
              <View key={n.id} style={{
                backgroundColor: n.type === 'success' ? '#ecfdf5' : n.type === 'warning' ? '#fffbeb' : 'white',
                padding: 12,
                borderRadius: 12,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: n.type === 'success' ? '#d1fae5' : n.type === 'warning' ? '#fef3c7' : '#f5f5f4',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#1c1917', flex: 1 }}>{n.message}</Text>
                <TouchableOpacity onPress={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}>
                  <X size={14} color="#78716c" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
