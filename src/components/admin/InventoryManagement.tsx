import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Box, AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface InventoryManagementProps {
  menuItems: any[];
  token: string | null;
  onUpdate: () => void;
}

export function InventoryManagement({ menuItems, token, onUpdate }: InventoryManagementProps) {
  const lowStockItems = menuItems.filter(item => item.stockQuantity <= (item.lowStockThreshold || 10));

  const updateField = async (itemId: string, field: string, value: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(`Update ${field} error:`, err);
    }
  };

  const handleRestock = (item: any) => {
    Alert.alert(
      'Restock',
      `Add 50 units to ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add 50', onPress: () => updateField(item._id, 'stockQuantity', item.stockQuantity + 50) }
      ]
    );
  };

  const handleThreshold = (item: any) => {
    Alert.alert(
      'Change Threshold',
      `Current threshold: ${item.lowStockThreshold || 10}\nChoose new threshold:`,
      [
        { text: '5', onPress: () => updateField(item._id, 'lowStockThreshold', 5) },
        { text: '10', onPress: () => updateField(item._id, 'lowStockThreshold', 10) },
        { text: '15', onPress: () => updateField(item._id, 'lowStockThreshold', 15) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <ScrollView className="space-y-8 flex-1 px-4 py-4">
      {lowStockItems.length > 0 && (
        <View className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex-row items-start gap-4 mb-6">
          <View className="bg-amber-100 p-3 rounded-2xl">
            <AlertTriangle size={24} color="#d97706" />
          </View>
          <View className="flex-1">
            <Text className="text-amber-900 font-black">Low Stock Alert</Text>
            <Text className="text-amber-700 text-sm font-medium">
              {lowStockItems.length} items are currently below their threshold.
            </Text>
          </View>
        </View>
      )}

      <View className="gap-6">
        {menuItems.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-[2.5rem] border border-stone-100 p-6 shadow-sm mb-4"
          >
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center">
                  <Box size={24} color="#a8a29e" />
                </View>
                <View>
                  <Text className="font-black text-stone-800">{item.name}</Text>
                  <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.category}</Text>
                </View>
              </View>
              <View className={`px-3 py-1 rounded-lg ${
                item.stockQuantity <= (item.lowStockThreshold || 10) ? 'bg-red-100' : 'bg-emerald-100'
              }`}>
                <Text className={`text-[10px] font-black uppercase tracking-widest ${
                item.stockQuantity <= (item.lowStockThreshold || 10) ? 'text-red-600' : 'text-emerald-600'
              }`}>
                  {item.stockQuantity} in stock
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-stone-50 p-4 rounded-2xl">
              <TouchableOpacity 
                onPress={() => updateField(item._id, 'stockQuantity', Math.max(0, item.stockQuantity - 1))}
                className="p-3 bg-white border border-stone-100 rounded-xl"
              >
                <Minus size={18} color="#57534e" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quantity</Text>
                <Text className="text-xl font-black text-stone-800">{item.stockQuantity}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => updateField(item._id, 'stockQuantity', item.stockQuantity + 1)}
                className="p-3 bg-white border border-stone-100 rounded-xl"
              >
                <Plus size={18} color="#57534e" />
              </TouchableOpacity>
            </View>

            <View className="mt-6 pt-6 border-t border-stone-50 flex-row justify-between items-center">
              <View>
                <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Threshold</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-bold text-stone-600">{item.lowStockThreshold || 10}</Text>
                  <TouchableOpacity 
                    onPress={() => handleThreshold(item)}
                    className="p-1"
                  >
                    <RefreshCw size={14} color="#a8a29e" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleRestock(item)}
                className="bg-stone-900 px-4 py-2 rounded-xl"
              >
                <Text className="text-white text-[10px] font-black uppercase tracking-widest">Restock</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
