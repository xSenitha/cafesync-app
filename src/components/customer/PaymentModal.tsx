import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { CreditCard, X, CheckCircle, AlertCircle, Smartphone, Landmark } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  token: string | null;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, order, token, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'Card' | 'Mobile' | 'Bank'>('Card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalAmount,
          paymentMethod: method
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Payment failed');
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
        <View className="bg-white rounded-t-[3rem] h-[80%] overflow-hidden">
          <View className="p-8 pb-4 flex-row justify-between items-center border-b border-stone-50">
            <View>
              <Text className="text-2xl font-black text-stone-800">Checkout</Text>
              <Text className="text-stone-400 text-xs font-medium mt-1">Complete your payment</Text>
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
                <Text className="text-xl font-black text-stone-800">Payment Successful!</Text>
                <Text className="text-stone-500 font-medium mt-2">Thank you for your order.</Text>
              </View>
            ) : (
              <View className="space-y-6">
                <View className="bg-stone-50 p-6 rounded-3xl border border-stone-100 flex-row justify-between items-center">
                  <Text className="text-xs font-black text-stone-400 uppercase tracking-widest">Amount to Pay</Text>
                  <Text className="text-2xl font-black text-stone-800">Rs. {order?.totalAmount}</Text>
                </View>

                <View className="space-y-4">
                  <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Select Payment Method</Text>
                  <View className="flex-row gap-3">
                    <TouchableOpacity 
                      onPress={() => setMethod('Card')}
                      className={`flex-1 p-4 rounded-2xl border items-center gap-2 ${
                        method === 'Card' ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'
                      }`}
                    >
                      <CreditCard size={20} color={method === 'Card' ? '#b45309' : '#a8a29e'} />
                      <Text className={`text-[10px] font-black uppercase ${method === 'Card' ? 'text-amber-700' : 'text-stone-400'}`}>Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setMethod('Mobile')}
                      className={`flex-1 p-4 rounded-2xl border items-center gap-2 ${
                        method === 'Mobile' ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'
                      }`}
                    >
                      <Smartphone size={20} color={method === 'Mobile' ? '#b45309' : '#a8a29e'} />
                      <Text className={`text-[10px] font-black uppercase ${method === 'Mobile' ? 'text-amber-700' : 'text-stone-400'}`}>Mobile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setMethod('Bank')}
                      className={`flex-1 p-4 rounded-2xl border items-center gap-2 ${
                        method === 'Bank' ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'
                      }`}
                    >
                      <Landmark size={20} color={method === 'Bank' ? '#b45309' : '#a8a29e'} />
                      <Text className={`text-[10px] font-black uppercase ${method === 'Bank' ? 'text-amber-700' : 'text-stone-400'}`}>Bank</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {method === 'Card' && (
                  <View className="space-y-4 p-5 bg-stone-50 rounded-3xl border border-stone-100">
                    <View className="space-y-2">
                      <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Number</Text>
                      <TextInput 
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold"
                        keyboardType="number-pad"
                      />
                    </View>
                    <View className="flex-row gap-4">
                      <View className="flex-1 space-y-2">
                        <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Expiry Date</Text>
                        <TextInput 
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold"
                        />
                      </View>
                      <View className="flex-1 space-y-2">
                        <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">CVV</Text>
                        <TextInput 
                          placeholder="***"
                          secureTextEntry
                          maxLength={3}
                          className="w-full px-4 py-3 bg-white border border-stone-100 rounded-xl text-sm font-bold"
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {error && (
                  <View className="flex-row items-center gap-2 p-4 bg-red-50 rounded-2xl">
                    <AlertCircle size={16} color="#dc2626" />
                    <Text className="text-red-600 text-xs font-bold flex-1">{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handlePayment}
                  disabled={loading}
                  className={`bg-stone-900 py-5 rounded-3xl items-center mb-10 ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-sm font-black uppercase tracking-widest">
                      Pay Rs. {order?.totalAmount}
                    </Text>
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

