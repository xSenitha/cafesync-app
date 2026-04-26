import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { CreditCard, CheckCircle, Clock, Search, Filter, Download } from 'lucide-react-native';

interface PaymentManagementProps {
  payments: any[];
  token: string | null;
}

export function PaymentManagement({ payments, token }: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.orderId?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount?.toString().includes(searchTerm)
  );

  return (
    <ScrollView className="flex-1 space-y-6">
      {/* Stats Overview */}
      <View className="flex-row flex-wrap gap-4">
        {[
          { label: 'Total Revenue', value: `Rs. ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}` },
          { label: 'Transactions', value: payments.length },
          { label: 'Avg. Transaction', value: `Rs. ${payments.length > 0 ? Math.round(payments.reduce((acc, p) => acc + p.amount, 0) / payments.length).toLocaleString() : 0}` }
        ].map((stat, idx) => (
          <View key={idx} className="w-[47%] bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
            <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</Text>
            <Text className="text-xl font-black text-stone-800">{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Filters & Search */}
      <View className="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm space-y-4">
        <View className="relative">
          <View className="absolute left-4 top-[14px] z-10">
            <Search size={18} color="#a8a29e" />
          </View>
          <TextInput 
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold"
            placeholder="Search payments..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-stone-50 rounded-2xl">
            <Filter size={16} color="#57534e" />
            <Text className="text-stone-600 text-xs font-black uppercase tracking-widest">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-6 py-3 bg-stone-900 rounded-2xl">
            <Download size={16} color="white" />
            <Text className="text-white text-xs font-black uppercase tracking-widest">Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payments List */}
      <View className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden mb-10">
        <View className="bg-stone-50 px-6 py-4 border-b border-stone-100">
          <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Recent Transactions</Text>
        </View>
        <View className="divide-y divide-stone-50">
          {filteredPayments.length === 0 ? (
            <View className="py-12 items-center">
              <View className="bg-stone-50 w-16 h-16 rounded-full items-center justify-center mb-4">
                <CreditCard size={32} color="#e7e5e4" />
              </View>
              <Text className="text-stone-400 text-xs font-bold uppercase tracking-widest">No transactions found</Text>
            </View>
          ) : (
            filteredPayments.map((payment: any) => (
              <View key={payment._id} className="px-6 py-5 flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-black text-stone-800">Order #{payment.orderId?._id?.slice(-6).toUpperCase() || 'N/A'}</Text>
                  <Text className="text-[10px] font-medium text-stone-400 mt-0.5">{new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</Text>
                  <View className="flex-row items-center gap-2 mt-1.5">
                    <View className="p-1.5 bg-stone-100 rounded-lg">
                      <CreditCard size={10} color="#57534e" />
                    </View>
                    <Text className="text-[10px] font-bold text-stone-500 uppercase">{payment.paymentMethod}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-black text-stone-800">Rs. {payment.amount.toLocaleString()}</Text>
                  <View className={`mt-1.5 px-3 py-1 rounded-full ${
                    payment.status === 'Completed' ? 'bg-emerald-100' : 
                    payment.status === 'Failed' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <Text className={`text-[8px] font-black uppercase ${
                      payment.status === 'Completed' ? 'text-emerald-700' : 
                      payment.status === 'Failed' ? 'text-red-700' : 'text-amber-700'
                    }`}>{payment.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
