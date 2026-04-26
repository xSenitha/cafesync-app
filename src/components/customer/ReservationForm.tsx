import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Calendar, Users, Phone, User as UserIcon, Clock, CheckCircle, AlertCircle, X } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
  reservations: any[];
  orders: any[];
  tables: any[];
}

export function ReservationForm({ isOpen, onClose, onSuccess, token, reservations, orders, tables }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableNumber: 0,
    numberOfGuests: 2,
    reservationDate: new Date().toISOString().split('T')[0],
    reservationTime: new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'),
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isTableReserved = (num: number) => {
    if (!formData.reservationDate || !formData.reservationTime) return false;
    
    const selectedTime = new Date(`${formData.reservationDate}T${formData.reservationTime}`);
    const now = new Date();
    
    const isToday = selectedTime.toDateString() === now.toDateString();
    if (isToday && orders && Array.isArray(orders)) {
      const activeOrder = orders.find(o => 
        o && o.tableNumber === num && 
        ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
      );
      
      if (activeOrder) {
        const timeDiffMs = selectedTime.getTime() - now.getTime();
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        if (timeDiffHours < 2) return true;
      }
    }

    if (!reservations || !Array.isArray(reservations)) return false;

    return reservations.some(r => {
      if (!r || r.tableNumber !== num || r.status === 'Cancelled' || r.status === 'Completed') return false;
      
      const resTime = new Date(r.reservationTime);
      const diffMs = Math.abs(selectedTime.getTime() - resTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);
      
      return diffHours < 2;
    });
  };

  const availableTablesCount = tables.filter(t => !isTableReserved(t.number)).length;

  React.useEffect(() => {
    if (formData.tableNumber > 0 && isTableReserved(formData.tableNumber)) {
      setFormData(prev => ({ ...prev, tableNumber: 0 }));
    }
  }, [formData.reservationDate, formData.reservationTime, reservations, orders]);

  const handleSubmit = async () => {
    if (!formData.tableNumber) {
      Alert.alert('Error', 'Please select a table');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const reservationDateTime = new Date(`${formData.reservationDate}T${formData.reservationTime}`);
      
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          tableNumber: formData.tableNumber,
          numberOfGuests: formData.numberOfGuests,
          reservationTime: reservationDateTime,
          notes: formData.notes
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
          setFormData({
            customerName: '',
            customerPhone: '',
            tableNumber: 0,
            numberOfGuests: 2,
            reservationDate: new Date().toISOString().split('T')[0],
            reservationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            notes: ''
          });
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to book table');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[3rem] h-[90%] overflow-hidden">
          <View className="p-8 pb-4 flex-row justify-between items-center border-b border-stone-50">
            <View>
              <Text className="text-2xl font-black text-stone-800">Book a Table</Text>
              <Text className="text-stone-400 text-xs font-medium mt-1">Reserve your spot at CafeSync</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 bg-stone-50 rounded-full">
              <X size={24} color="#a8a29e" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-8" showsVerticalScrollIndicator={false}>
            {success ? (
              <View className="py-12 items-center">
                <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-6">
                  <CheckCircle size={40} color="#059669" />
                </View>
                <Text className="text-xl font-black text-stone-800">Reservation Confirmed!</Text>
                <Text className="text-stone-500 font-medium mt-2">We look forward to seeing you.</Text>
              </View>
            ) : (
              <View className="space-y-6">
                <View className="flex-row gap-4">
                  <View className="flex-1 space-y-2">
                    <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Name</Text>
                    <View className="flex-row items-center bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5">
                      <UserIcon size={18} color="#a8a29e" />
                      <TextInput
                        className="flex-1 ml-3 text-sm font-bold"
                        placeholder="Your Name"
                        value={formData.customerName}
                        onChangeText={(text) => setFormData({ ...formData, customerName: text })}
                      />
                    </View>
                  </View>
                  <View className="flex-1 space-y-2">
                    <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Phone</Text>
                    <View className="flex-row items-center bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5">
                      <Phone size={18} color="#a8a29e" />
                      <TextInput
                        className="flex-1 ml-3 text-sm font-bold"
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        value={formData.customerPhone}
                        onChangeText={(text) => setFormData({ ...formData, customerPhone: text })}
                      />
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 space-y-2">
                    <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Date (YYYY-MM-DD)</Text>
                    <View className="flex-row items-center bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5">
                      <Calendar size={18} color="#a8a29e" />
                      <TextInput
                        className="flex-1 ml-3 text-sm font-bold"
                        placeholder="2024-01-01"
                        value={formData.reservationDate}
                        onChangeText={(text) => setFormData({ ...formData, reservationDate: text })}
                      />
                    </View>
                  </View>
                  <View className="flex-1 space-y-2">
                    <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Time (HH:MM)</Text>
                    <View className="flex-row items-center bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3.5">
                      <Clock size={18} color="#a8a29e" />
                      <TextInput
                        className="flex-1 ml-3 text-sm font-bold"
                        placeholder="12:00"
                        value={formData.reservationTime}
                        onChangeText={(text) => setFormData({ ...formData, reservationTime: text })}
                      />
                    </View>
                  </View>
                </View>

                <View className="space-y-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Select Table</Text>
                      <Text className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest ml-1">
                        {availableTablesCount} Styles Available
                      </Text>
                    </View>
                    <View className="flex-row gap-3">
                      <View className="flex-row items-center gap-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-stone-100 border border-stone-200" />
                        <Text className="text-[8px] font-bold text-stone-400 uppercase">Free</Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-amber-100 border border-amber-200" />
                        <Text className="text-[8px] font-bold text-stone-400 uppercase">Busy</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {tables.map((table) => {
                      const reserved = isTableReserved(table.number);
                      const isSelected = formData.tableNumber === table.number;
                      return (
                        <TouchableOpacity
                          key={table._id}
                          disabled={reserved}
                          onPress={() => setFormData({ ...formData, tableNumber: table.number })}
                          className={`w-[15%] py-3 rounded-xl items-center border-2 ${
                            isSelected ? 'bg-stone-900 border-stone-900' : 
                            reserved ? 'bg-amber-50 border-amber-100 opacity-60' : 
                            'bg-stone-50 border-stone-100'
                          }`}
                        >
                          <Text className={`text-[8px] font-bold ${isSelected ? 'text-stone-400' : 'text-stone-300'}`}>T</Text>
                          <Text className={`text-[10px] font-black ${isSelected ? 'text-white' : (reserved ? 'text-amber-700' : 'text-stone-400')}`}>
                            {table.number}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View className="space-y-2">
                  <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Special Notes</Text>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold min-h-[100px]"
                    placeholder="Any special requests?"
                    textAlignVertical="top"
                  />
                </View>

                {error && (
                  <View className="flex-row items-center gap-2 p-4 bg-red-50 rounded-2xl">
                    <AlertCircle size={16} color="#dc2626" />
                    <Text className="text-red-600 text-xs font-bold flex-1">{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`bg-stone-900 py-5 rounded-3xl items-center mb-10 ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-sm font-black uppercase tracking-widest">Confirm Booking</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

