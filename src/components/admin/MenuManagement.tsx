import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Coffee, Trash2, Edit3 } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface MenuManagementProps {
  menuItems: any[];
  token: string | null;
  onUpdateMenu: () => void;
  onEditItem: (item: any) => void;
  user?: any;
}

export function MenuManagement({ menuItems, token, onUpdateMenu, onEditItem, user }: MenuManagementProps) {
  const handleDelete = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                onUpdateMenu();
              }
            } catch (err) {
              console.error('Delete error:', err);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 px-4">
      <View className="flex-row flex-wrap gap-4 justify-between">
        {menuItems.map((item: any) => (
          <View 
            key={item._id} 
            className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm w-[48%] mb-4"
          >
            <View className="relative h-32 mb-4 overflow-hidden rounded-2xl bg-stone-100 items-center justify-center">
              {item.imageUrl ? (
                <Image 
                  source={{ uri: item.imageUrl }} 
                  className="w-full h-full"
                  resizeMode="cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Coffee size={32} color="#d6d3d1" strokeWidth={1.5} />
              )}
              <View className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                <Text className="text-[8px] font-black text-stone-800 uppercase">{item.category}</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-sm font-black text-stone-800 flex-1 mr-1" numberOfLines={1}>{item.name}</Text>
            </View>
            <Text className="text-xs font-black text-amber-700 mb-2">Rs. {item.price}</Text>
            
            <Text className="text-[10px] text-stone-400 font-medium h-8 mb-4" numberOfLines={2}>{item.description}</Text>
            
            <View className="flex-row items-center justify-between pt-3 border-t border-stone-50">
              <View className="flex-row items-center gap-1.5">
                <View className={`w-1.5 h-1.5 rounded-full ${item.stockQuantity > (item.lowStockThreshold || 10) ? 'bg-emerald-500' : 'bg-red-500'}`}></View>
                <Text className="text-[8px] font-bold text-stone-500 uppercase tracking-wider">{item.stockQuantity}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => onEditItem(item)}>
                  <Edit3 size={16} color="#a8a29e" />
                </TouchableOpacity>
                {user?.role !== 'staff' && (
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Trash2 size={16} color="#f87171" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

