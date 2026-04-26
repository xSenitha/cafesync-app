import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { Star, Send, X } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface FeedbackFormProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
}

export function FeedbackForm({ orderId, onClose, onSuccess, token }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, rating, comment })
      });
      if (res.ok) {
        onSuccess();
        onClose();
        Alert.alert('Success', 'Thank you for your feedback!');
      }
    } catch (err) {
      console.error('Feedback error:', err);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!orderId}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center p-4">
        <View className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
          <TouchableOpacity 
            onPress={onClose} 
            className="absolute top-6 right-6 p-2 bg-stone-50 rounded-full"
          >
            <X size={20} color="#a8a29e" />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View className="bg-amber-50 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Star size={32} color="#d97706" fill="#d97706" />
            </View>
            <Text className="text-2xl font-black text-stone-800">Rate Your Experience</Text>
            <Text className="text-stone-400 text-sm font-medium mt-1">How was your meal at CafeSync?</Text>
          </View>

          <View className="space-y-6">
            <View className="flex-row justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  className="p-2"
                >
                  <Star 
                    size={32} 
                    color={star <= rating ? '#f59e0b' : '#e7e5e4'} 
                    fill={star <= rating ? '#f59e0b' : 'none'} 
                    strokeWidth={2.5} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="space-y-2">
              <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Your Comments</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Tell us what you liked or how we can improve..."
                multiline
                numberOfLines={4}
                className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-6 text-sm font-bold text-stone-800 min-h-[120px]"
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`w-full bg-stone-900 py-4 rounded-2xl flex-row items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-base">Submit Feedback</Text>
                  <Send size={18} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

