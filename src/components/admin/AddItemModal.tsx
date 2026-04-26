import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Image, ActivityIndicator } from 'react-native';
import { X, Image as ImageIcon } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => Promise<void>;
  initialData?: any;
}

export function AddItemModal({ isOpen, onClose, onSave, initialData }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Beverage');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price?.toString() || '');
      setCategory(initialData.category || 'Beverage');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setStockQuantity(initialData.stockQuantity?.toString() || '50');
    } else {
      setName('');
      setPrice('');
      setCategory('Beverage');
      setDescription('');
      setImageUrl('');
      setStockQuantity('50');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    if (!name || !price || !category) return;

    setLoading(true);
    try {
      await onSave({
        ...initialData,
        name,
        price: parseFloat(price),
        category,
        description,
        imageUrl,
        stockQuantity: parseInt(stockQuantity),
        available: true
      });
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-[3rem] max-h-[90%]">
          <View className="p-8 border-b border-stone-100 flex-row justify-between items-center">
            <Text className="text-xl font-black text-stone-800">New Item</Text>
            <TouchableOpacity onPress={onClose} className="p-2 bg-stone-100 rounded-xl">
              <X size={20} color="#57534e" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-8 space-y-6">
            <View className="flex-row gap-4">
              <View className="flex-1 space-y-2">
                <Text className="text-[10px] font-black text-stone-400 uppercase">Name</Text>
                <TextInput 
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Latte" 
                  className="bg-stone-50 px-5 py-4 rounded-2xl border border-stone-100 font-bold"
                />
              </View>
              <View className="w-32 space-y-2">
                <Text className="text-[10px] font-black text-stone-400 uppercase">Price</Text>
                <TextInput 
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="numeric"
                  className="bg-stone-50 px-5 py-4 rounded-2xl border border-stone-100 font-bold"
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-[10px] font-black text-stone-400 uppercase">Category</Text>
              <View className="bg-stone-50 rounded-2xl border border-stone-100 p-1 flex-row flex-wrap">
                {['Beverage', 'Appetizer', 'Main Course', 'Dessert'].map((cat) => (
                  <TouchableOpacity 
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl mr-2 mb-2 ${category === cat ? 'bg-stone-900' : 'bg-transparent'}`}
                  >
                    <Text className={`text-[10px] font-black uppercase ${category === cat ? 'text-white' : 'text-stone-400'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-[10px] font-black text-stone-400 uppercase">Image URL</Text>
              <View className="flex-row items-center bg-stone-50 rounded-2xl border border-stone-100 px-5">
                <TextInput 
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://..." 
                  className="flex-1 py-4 font-bold"
                />
                <ImageIcon size={18} color="#d6d3d1" />
              </View>
              {imageUrl ? (
                <View className="mt-2 h-40 rounded-2xl overflow-hidden bg-stone-50">
                  <Image source={{ uri: imageUrl }} className="w-full h-full object-cover" />
                </View>
              ) : null}
            </View>

            <View className="space-y-2">
              <Text className="text-[10px] font-black text-stone-400 uppercase">Description</Text>
              <TextInput 
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                placeholder="Delicious coffee..." 
                className="bg-stone-50 px-5 py-4 rounded-2xl border border-stone-100 font-bold h-24"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              className="bg-stone-900 py-5 rounded-2xl shadow-xl shadow-stone-900/10 items-center justify-center mb-8"
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <Text className="text-white font-black uppercase tracking-widest text-sm">Save Menu Item</Text>
              )}
            </TouchableOpacity>
            <View className="h-20" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

