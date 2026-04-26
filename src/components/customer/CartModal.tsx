import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { X, ShoppingCart, Plus, Minus, Send, Trash2, Utensils, Calendar } from 'lucide-react-native';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  setCart: (cart: any[]) => void;
  onPlaceOrder: (orderData: any) => Promise<boolean> | void;
  reservations: any[];
  orders: any[];
  tables: any[];
  user: any | null;
  onBookTable: () => void;
  loading: boolean;
  editingOrder?: any | null;
  addNotification: (message: string, type: 'info' | 'success' | 'warning') => void;
}

export function CartModal({ isOpen, onClose, cart, setCart, onPlaceOrder, reservations, orders, tables, user, onBookTable, loading, editingOrder, addNotification }: CartModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [orderType, setOrderType] = useState<'Dine-In' | 'Takeaway' | 'Online'>('Dine-In');
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    if (editingOrder) {
      setOrderType(editingOrder.orderType || 'Dine-In');
      setTableNumber(editingOrder.tableNumber?.toString() || '');
      setStep(1);
    } else {
      setOrderType('Dine-In');
      setTableNumber('');
      setStep(1);
    }
  }, [editingOrder, isOpen]);

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
    const table = tables.find(t => t.number === num);
    if (table && table.currentStatus) return table.currentStatus;
    if (table && table.status && table.status !== 'Available') return table.status;

    if (!orders || !Array.isArray(orders)) return 'Available';

    const activeOrder = orders.find(o => 
      o && o.tableNumber === num && 
      ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
    );
    
    if (activeOrder) {
      const userId = user?.id || user?._id;
      if (activeOrder.user === userId) return 'Available';
      return 'Occupied';
    }

    if (!reservations || !Array.isArray(reservations)) return 'Available';

    const now = new Date();
    const hasReservation = reservations.some(r => {
      if (!r || r.tableNumber !== num || (r.status !== 'Confirmed' && r.status !== 'Pending')) return false;
      
      const resTime = new Date(r.reservationTime);
      const diffMs = resTime.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      
      return resTime.toDateString() === now.toDateString() && 
             (diffMinutes <= 30 && diffMinutes >= -120);
    });
    if (hasReservation) return 'Reserved';

    return 'Available';
  };

  useEffect(() => {
    if (tableNumber && getTableStatus(parseInt(tableNumber)) !== 'Available') {
      setTableNumber('');
    }
  }, [orders, reservations, tables]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#FDFCFB]">
        <View className="px-6 py-8 flex-row justify-between items-center bg-white border-b border-stone-100">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={step === 2 ? () => setStep(1) : onClose} className="p-2">
              {step === 2 ? <Plus size={28} color="#a8a29e" style={{ transform: [{ rotate: '45deg' }] }} /> : <X size={28} color="#a8a29e" />}
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black text-stone-800">
                {step === 1 ? 'Your Order' : 'Select Table'}
              </Text>
              <Text className="text-stone-400 text-[10px] font-medium">
                {step === 1 ? 'Review items and choose order type' : 'Choose an available table for your meal'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {step === 1 ? (
            <View className="space-y-6">
              {cart.length === 0 ? (
                <View className="py-20 items-center justify-center">
                  <View className="bg-stone-50 w-24 h-24 rounded-full items-center justify-center mb-6">
                    <Trash2 size={48} color="#e7e5e4" />
                  </View>
                  <Text className="text-xl font-black text-stone-800">Your cart is empty</Text>
                  <TouchableOpacity onPress={onClose} className="mt-8">
                    <Text className="text-amber-700 font-black uppercase tracking-widest text-xs">Back to Menu</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="space-y-4">
                  {cart.map((item) => (
                    <View key={item._id} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm flex-row items-center gap-4">
                      <View className="w-20 h-20 rounded-2xl bg-stone-50 overflow-hidden">
                        {item.imageUrl ? (
                          <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <ShoppingCart size={24} color="#e7e5e4" />
                          </View>
                        )}
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-sm font-black text-stone-800" numberOfLines={1}>{item.name}</Text>
                        <Text className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Rs. {item.price.toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => removeItem(item._id)} className="mt-2">
                          <Text className="text-[8px] font-black text-red-400 uppercase tracking-widest">Remove</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <View className="items-end gap-2">
                        <View className="flex-row items-center bg-stone-50 p-1 rounded-xl border border-stone-100">
                          <TouchableOpacity onPress={() => updateQuantity(item._id, -1)} className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm">
                            <Minus size={14} color="#a8a29e" />
                          </TouchableOpacity>
                          <Text className="text-sm font-black text-stone-800 w-8 text-center">{item.quantity}</Text>
                          <TouchableOpacity onPress={() => updateQuantity(item._id, 1)} className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm">
                            <Plus size={14} color="#a8a29e" />
                          </TouchableOpacity>
                        </View>
                        <Text className="text-sm font-black text-stone-800">Rs. {(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View className="space-y-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-black text-stone-800 uppercase tracking-widest">Available Tables</Text>
                <TouchableOpacity onPress={onBookTable} className="flex-row items-center gap-1">
                  <Calendar size={12} color="#b45309" />
                  <Text className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Book for later</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {tables.map((table) => {
                  const status = getTableStatus(table.number);
                  const isUnavailable = status !== 'Available';
                  const isSelected = tableNumber === table.number.toString();
                  
                  return (
                    <TouchableOpacity
                      key={table._id}
                      disabled={isUnavailable}
                      onPress={() => setTableNumber(table.number.toString())}
                      className={`w-[23%] py-4 rounded-2xl items-center border-2 ${
                        isSelected ? 'bg-stone-900 border-stone-900' : 
                        status === 'Occupied' ? 'bg-red-50 border-red-100 opacity-60' :
                        status === 'Reserved' ? 'bg-amber-50 border-amber-100 opacity-60' :
                        status === 'Cleaning' ? 'bg-purple-50 border-purple-100 opacity-60' :
                        'bg-white border-stone-100'
                      }`}
                    >
                      <Text className={`text-[8px] font-bold uppercase ${isSelected ? 'text-stone-400' : 'text-stone-300'}`}>Table</Text>
                      <Text className={`text-[12px] font-black ${isSelected ? 'text-white' : 'text-stone-800'}`}>{table.number}</Text>
                      <Text className={`text-[7px] font-medium text-center ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                        {status === 'Occupied' ? 'Occupied' : status === 'Reserved' ? 'Reserved' : status === 'Cleaning' ? 'Cleaning' : `${table.capacity} Seats`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        <View className="p-6 bg-white border-t border-stone-100">
          <View className="space-y-6 mb-6">
            {step === 1 && (
              <View className="space-y-3">
                <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Order Type</Text>
                <View className="flex-row gap-2">
                  {(['Dine-In', 'Takeaway', 'Online'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        setOrderType(type);
                        if (type !== 'Dine-In') setTableNumber('');
                      }}
                      className={`flex-1 py-3 items-center rounded-xl border-2 ${
                        orderType === type ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-100'
                      }`}
                    >
                      <Text className={`text-[9px] font-black uppercase tracking-widest ${orderType === type ? 'text-white' : 'text-stone-400'}`}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View className="space-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Amount</Text>
                <Text className="text-2xl font-black text-amber-700">Rs. {total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={step === 1 ? handleNextStep : handlePlaceOrder}
            disabled={loading || (step === 1 && cart.length === 0) || (step === 2 && orderType === 'Dine-In' && !tableNumber)}
            className={`w-full bg-stone-900 py-5 rounded-[2rem] items-center flex-row justify-center gap-3 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white text-sm font-black uppercase tracking-widest">
                  {step === 1 ? (orderType === 'Dine-In' ? 'Next: Select Table' : 'Confirm & Place Order') : (editingOrder ? 'Update Order' : 'Confirm & Place Order')}
                </Text>
                <Send size={18} color="white" />
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={step === 2 ? () => setStep(1) : onClose}
            className="w-full items-center py-4 mt-2"
          >
            <Text className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">
              {step === 2 ? 'Back to Items' : 'Continue Shopping'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

