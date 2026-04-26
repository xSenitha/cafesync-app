import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Coffee, ShoppingCart, Plus, Clock, Calendar, CreditCard, CheckCircle, AlertCircle, Star, MessageSquare, PlusCircle, Wallet, ShoppingBag, XCircle, Trash2 } from 'lucide-react-native';
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
  editingOrder: any | null;
  setEditingOrder: (order: any | null) => void;
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
  editingOrder, setEditingOrder,
  selectedCategory, setSelectedCategory, onPlaceOrder,
  token, user, onUpdate, setActiveTab, loading, addNotification
}: CustomerViewProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any | null>(null);

  const categories = ['All', ...(Array.isArray(menuItems) ? [...new Set(menuItems.map((item: any) => item.category))] : [])];
  const filteredItems = Array.isArray(menuItems) 
    ? (selectedCategory === 'All' ? menuItems : menuItems.filter((item: any) => item.category === selectedCategory))
    : [];

  const addToCart = (item: any) => {
    if (!Array.isArray(cart)) return;
    if (editingOrder) {
      setEditingOrder(null);
      setCart([]);
    }
    const existing = cart.find((c: any) => c && c._id === item._id);
    if (existing) {
      if (existing.quantity >= item.stockQuantity) {
        Alert.alert('Low Stock', `Only ${item.stockQuantity} items available in stock`);
        return;
      }
      setCart(cart.map((c: any) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      if (item.stockQuantity <= 0) {
        Alert.alert('Out of Stock', `Item out of stock`);
        return;
      }
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    addNotification(`${item.name} added to cart`, 'success');
  };

  const onCancelReservation = async (id: string) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
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
          }
        }
      ]
    );
  };

  const onClearOrderHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your order history? (Only Paid and Cancelled orders will be removed)',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: async () => {
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
          }
        }
      ]
    );
  };

  const handleEditOrder = (order: any) => {
    const cartItems = order.items.map((item: any) => ({
      ...item.menuItem,
      quantity: item.quantity,
      price: item.price
    }));
    setCart(cartItems);
    setEditingOrder(order);
    setShowCartModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
      case 'dashboard':
        return (
          <View className="space-y-6">
            <View className="px-1">
              <Text className="text-2xl font-black text-stone-800">Fresh Menu</Text>
              <Text className="text-stone-400 text-xs font-medium mt-1">Select your favorite items.</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat as string}
                  onPress={() => setSelectedCategory(cat as string)}
                  className={`px-6 py-3 rounded-2xl mr-3 ${
                    selectedCategory === cat 
                      ? 'bg-stone-900 shadow-lg' 
                      : 'bg-white border border-stone-100'
                  }`}
                >
                  <Text className={`text-[10px] font-black uppercase tracking-widest ${
                    selectedCategory === cat ? 'text-white' : 'text-stone-400'
                  }`}>
                    {cat as string}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View className="flex-row flex-wrap justify-between">
              {filteredItems.map((item: any) => (
                <View 
                  key={item._id}
                  className="bg-white p-4 rounded-[2.5rem] border border-stone-100 shadow-sm w-[48%] mb-4"
                >
                  <View className="h-32 mb-3 overflow-hidden rounded-2xl bg-stone-100">
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} className="w-full h-full object-cover" />
                    ) : (
                      <View className="w-full h-full flex items-center justify-center">
                        <Coffee size={32} color="#d6d3d1" />
                      </View>
                    )}
                  </View>
                  <Text className="text-sm font-black text-stone-800" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-sm font-black text-amber-700 mt-1">Rs. {item.price}</Text>
                  
                  <View className="flex-row items-center mt-2 mb-3">
                    <View className={`px-2 py-0.5 rounded-md ${
                      item.stockQuantity <= (item.lowStockThreshold || 10) ? 'bg-red-50' : 'bg-emerald-50'
                    }`}>
                      <Text className={`text-[8px] font-black uppercase ${
                        item.stockQuantity <= (item.lowStockThreshold || 10) ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        Stock: {item.stockQuantity}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => addToCart(item)}
                    disabled={item.stockQuantity <= 0}
                    className="w-full bg-stone-50 py-2.5 rounded-2xl flex-row items-center justify-center gap-2"
                  >
                    <Plus size={14} color={item.stockQuantity <= 0 ? '#d6d3d1' : '#1c1917'} />
                    <Text className="text-stone-800 text-[10px] font-bold">
                      {item.stockQuantity <= 0 ? 'Out of Stock' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      case 'orders':
        return (
          <View className="space-y-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-black text-stone-800">Orders</Text>
                <Text className="text-stone-400 text-xs font-medium mt-1">Track your active orders.</Text>
              </View>
              {orders.some((o: any) => o.status === 'Paid' || o.status === 'Cancelled') && (
                <TouchableOpacity 
                  onPress={onClearOrderHistory}
                  className="bg-stone-100 p-2 rounded-xl"
                >
                  <Trash2 size={18} color="#78716c" />
                </TouchableOpacity>
              )}
            </View>
            
            <View className="gap-4">
              {(!Array.isArray(orders) || orders.length === 0) ? (
                <View className="bg-white p-12 rounded-[2.5rem] border border-stone-100 items-center">
                  <View className="bg-stone-50 w-16 h-16 rounded-full items-center justify-center mb-6">
                    <Clock size={32} color="#e7e5e4" />
                  </View>
                  <Text className="text-lg font-black text-stone-800">No orders yet</Text>
                  <Text className="text-stone-400 text-xs mt-2">Start ordering from our menu!</Text>
                </View>
              ) : (
                orders.map((order: any) => (
                  <View key={order._id} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
                    <View className="flex-row items-center gap-4 mb-4">
                      <View className="bg-amber-50 p-3 rounded-2xl">
                        <ShoppingCart size={20} color="#b45309" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-black text-stone-800">Order #{order?._id ? order._id.slice(-6).toUpperCase() : 'N/A'}</Text>
                        <Text className="text-[10px] font-bold text-stone-400 mt-1">
                          {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                        </Text>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${
                        order.status === 'Paid' ? 'bg-emerald-100' : 
                        order.status === 'Cancelled' ? 'bg-red-100' : 
                        'bg-amber-100'
                      }`}>
                        <Text className={`text-[8px] font-black uppercase ${
                          order.status === 'Paid' ? 'text-emerald-700' : 
                          order.status === 'Cancelled' ? 'text-red-700' : 
                          'text-amber-700'
                        }`}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between pt-4 border-t border-stone-50">
                      <View>
                        <Text className="text-[10px] font-black text-stone-400 uppercase">Total</Text>
                        <Text className="text-lg font-black text-stone-800">Rs. {order.totalAmount}</Text>
                      </View>
                      
                      <View className="flex-row gap-2">
                        {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                          <>
                            <TouchableOpacity 
                              onPress={() => handleEditOrder(order)}
                              className="bg-amber-50 p-3 rounded-xl"
                            >
                              <Plus size={16} color="#b45309" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              onPress={() => setSelectedOrderForPayment(order)}
                              className="bg-stone-900 px-4 py-3 rounded-xl flex-row items-center gap-2"
                            >
                              <Wallet size={16} color="white" />
                              <Text className="text-white text-[10px] font-black uppercase">Pay</Text>
                            </TouchableOpacity>
                          </>
                        )}
                        {order.status === 'Paid' && (
                          <TouchableOpacity 
                            onPress={() => setShowFeedbackForm(order._id)}
                            className="bg-amber-50 p-3 rounded-xl"
                          >
                            <Star size={16} color="#d97706" fill="#d97706" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        );

      case 'reservations':
        const myReservations = Array.isArray(reservations) ? reservations.filter((res: any) => res && res.user === user?._id) : [];
        return (
          <View className="space-y-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-black text-stone-800">Reservations</Text>
                <Text className="text-stone-400 text-xs font-medium mt-1">Manage your bookings.</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setShowReservationForm(true)}
                className="bg-stone-900 p-3 rounded-xl"
              >
                <PlusCircle size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              {(!Array.isArray(myReservations) || myReservations.length === 0) ? (
                <View className="bg-white p-12 rounded-[2.5rem] border border-stone-100 items-center">
                  <View className="bg-stone-50 w-16 h-16 rounded-full items-center justify-center mb-6">
                    <Calendar size={32} color="#e7e5e4" />
                  </View>
                  <Text className="text-lg font-black text-stone-800">No reservations</Text>
                  <Text className="text-stone-400 text-xs mt-2">Book a table for your next visit.</Text>
                </View>
              ) : (
                myReservations.map((res: any) => (
                  <View key={res._id} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
                    <View className="flex-row items-center gap-4 mb-4">
                      <View className="bg-blue-50 p-3 rounded-2xl">
                        <Calendar size={20} color="#1d4ed8" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-black text-stone-800">Table #{res.tableNumber}</Text>
                        <Text className="text-[10px] font-bold text-stone-400 mt-1">
                          {new Date(res.reservationTime).toLocaleDateString()} at {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${
                        res.status === 'Confirmed' ? 'bg-emerald-100' : 
                        res.status === 'Cancelled' ? 'bg-red-100' : 
                        'bg-amber-100'
                      }`}>
                        <Text className={`text-[8px] font-black uppercase ${
                          res.status === 'Confirmed' ? 'text-emerald-700' : 
                          res.status === 'Cancelled' ? 'text-red-700' : 
                          'text-amber-700'
                        }`}>
                          {res.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between pt-4 border-t border-stone-50">
                      <View>
                        <Text className="text-[10px] font-black text-stone-400 uppercase">Guests</Text>
                        <Text className="text-lg font-black text-stone-800">{res.numberOfGuests} People</Text>
                      </View>
                      
                      {(res.status === 'Pending' || res.status === 'Confirmed') && (
                        <TouchableOpacity 
                          onPress={() => onCancelReservation(res._id)}
                          className="bg-red-50 p-3 rounded-xl"
                        >
                          <XCircle size={18} color="#f87171" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        );

      case 'payments':
        const pendingOrders = Array.isArray(orders) ? orders.filter((o: any) => o && o.status !== 'Paid' && o.status !== 'Cancelled') : [];
        return (
          <View className="space-y-8">
            {pendingOrders.length > 0 && (
              <View className="space-y-4">
                <Text className="text-xl font-black text-stone-800 px-1">Pending Payments</Text>
                <View className="gap-4">
                  {pendingOrders.map((order: any) => (
                    <View key={order._id} className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex-row items-center">
                      <View className="bg-amber-100 p-3 rounded-2xl mr-4">
                        <Clock size={20} color="#b45309" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-black text-stone-800">Order #{order?._id?.slice(-6).toUpperCase()}</Text>
                        <Text className="text-[10px] font-bold text-stone-400 uppercase">Rs. {order?.totalAmount}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => setSelectedOrderForPayment(order)}
                        className="bg-stone-900 p-4 rounded-2xl"
                      >
                        <CreditCard size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="space-y-4">
              <Text className="text-xl font-black text-stone-800 px-1">Payment History</Text>
              <View className="gap-4">
                {(!Array.isArray(payments) || payments.length === 0) ? (
                  <View className="bg-white p-12 rounded-[2.5rem] border border-stone-100 items-center">
                    <View className="bg-stone-50 w-16 h-16 rounded-full items-center justify-center mb-6">
                      <CreditCard size={32} color="#e7e5e4" />
                    </View>
                    <Text className="text-lg font-black text-stone-800">No payments</Text>
                  </View>
                ) : (
                  payments.map((payment: any) => (
                    <View key={payment._id} className="bg-white p-5 rounded-[2rem] border border-stone-100 flex-row items-center">
                      <View className="bg-emerald-50 p-3 rounded-2xl mr-4">
                        <CheckCircle size={20} color="#059669" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-black text-stone-800">Successful</Text>
                        <Text className="text-[10px] font-bold text-stone-400">{new Date(payment.createdAt).toLocaleString()}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm font-black text-stone-800">Rs. {payment.amount}</Text>
                        <Text className="text-[8px] font-black uppercase text-stone-400 mt-1">{payment.paymentMethod}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {renderContent()}
        <View className="h-24" />
      </ScrollView>

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

      {/* Floating Cart Button */}
      {cart.length > 0 && activeTab !== 'orders' && !showCartModal && (
        <TouchableOpacity
          onPress={() => setShowCartModal(true)}
          className="absolute bottom-8 right-6 bg-stone-900 px-6 py-5 rounded-full shadow-2xl flex-row items-center gap-3 border border-white/10 z-50"
        >
          <View className="relative">
            <ShoppingBag size={24} color="white" />
            <View className="absolute -top-2 -right-2 bg-amber-500 w-5 h-5 rounded-full items-center justify-center border-2 border-stone-900">
              <Text className="text-white text-[10px] font-black">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Fullscreen Cart Modal */}
      <CartModal 
        isOpen={showCartModal}
        onClose={() => { setShowCartModal(false); setEditingOrder(null); }}
        cart={cart}
        setCart={setCart}
        editingOrder={editingOrder}
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
    </View>
  );
}

