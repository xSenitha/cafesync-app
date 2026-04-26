import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface OrderManagementProps {
  orders: any[];
  token: string | null;
  onUpdateOrder: () => void;
}

export function OrderManagement({ orders, token, onUpdateOrder }: OrderManagementProps) {
  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onUpdateOrder();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear order history? (Only Paid and Cancelled orders will be removed)',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/orders/clear`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (res.ok) {
                onUpdateOrder();
              }
            } catch (err) {
              console.error('Clear history error:', err);
            }
          }
        }
      ]
    );
  };

  return (
    <View className="space-y-6 flex-1">
      <View className="flex-row justify-end px-4">
        {orders.some(o => o.status === 'Paid' || o.status === 'Cancelled') && (
          <TouchableOpacity 
            onPress={clearHistory}
            className="flex-row items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl"
          >
            <Trash2 size={16} color="#57534e" />
            <Text className="text-stone-600 text-xs font-black uppercase tracking-widest">Clear History</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView className="flex-1 px-4">
        {orders.map((order: any) => (
          <View key={order._id} className="bg-white p-5 rounded-3xl border border-stone-100 mb-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-xs font-bold text-stone-800">#{order._id.slice(-6).toUpperCase()}</Text>
                <Text className="text-[10px] font-medium text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                order.status === 'Paid' ? 'bg-emerald-100' : 
                order.status === 'Pending' ? 'bg-amber-100' : 
                order.status === 'Ready' ? 'bg-blue-100' : 'bg-stone-100'
              }`}>
                <Text className={`text-[10px] font-black uppercase ${
                  order.status === 'Paid' ? 'text-emerald-700' : 
                  order.status === 'Pending' ? 'text-amber-700' : 
                  order.status === 'Ready' ? 'text-blue-700' : 'text-stone-700'
                }`}>
                  {order.status}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-bold text-stone-800">{order.customerName || `Table ${order.tableNumber}`}</Text>
              <View className="flex-row flex-wrap gap-1 mt-2">
                {order.items.map((item: any, idx: number) => (
                  <View key={idx} className="bg-stone-100 px-2 py-1 rounded">
                    <Text className="text-[9px] font-bold text-stone-600">
                      {item.menuItem?.name || 'Item'} x{item.quantity}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="text-[10px] font-medium text-stone-400 mt-2">{order.orderType}</Text>
            </View>

            <View className="flex-row justify-between items-center pt-4 border-t border-stone-50">
              <Text className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</Text>
              <View className="flex-row gap-2">
                {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                  <TouchableOpacity onPress={() => updateStatus(order._id, 'Paid')} className="p-2 bg-emerald-50 rounded-lg">
                    <CheckCircle size={18} color="#10b981" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => updateStatus(order._id, 'Cancelled')} className="p-2 bg-red-50 rounded-lg">
                  <XCircle size={18} color="#f87171" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {orders.length === 0 && (
          <View className="py-20 items-center justify-center">
            <Text className="text-stone-400 font-bold uppercase tracking-widest">No orders found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
