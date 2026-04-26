import { View, Text, ScrollView } from 'react-native';
import { Star, MessageSquare, Calendar, User } from 'lucide-react-native';

interface FeedbackManagementProps {
  feedback: any[];
}

export function FeedbackManagement({ feedback }: FeedbackManagementProps) {
  const averageRating = feedback.length > 0 
    ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <ScrollView className="flex-1 px-4 py-4 space-y-8">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-1">
          <Text className="text-2xl font-black text-stone-800">Feedback</Text>
          <Text className="text-stone-400 text-xs font-medium mt-1">Monitor satisfaction.</Text>
        </View>
        <View className="bg-white px-4 py-3 rounded-2xl border border-stone-100 shadow-sm flex-row items-center gap-4">
          <View className="bg-amber-50 p-2 rounded-xl">
            <Star size={20} color="#d97706" fill="#d97706" />
          </View>
          <View>
            <Text className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Avg</Text>
            <Text className="text-lg font-black text-stone-800">{averageRating}</Text>
          </View>
        </View>
      </View>

      <View className="gap-6">
        {feedback.map((f) => (
          <View
            key={f._id}
            className="bg-white rounded-[2.5rem] border border-stone-100 p-6 shadow-sm mb-4"
          >
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center">
                  <User size={20} color="#a8a29e" />
                </View>
                <View>
                  <Text className="font-black text-stone-800">{f.customerName || 'Anonymous'}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        color={i < f.rating ? '#d97706' : '#e7e5e4'}
                        fill={i < f.rating ? '#d97706' : 'transparent'} 
                      />
                    ))}
                  </View>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Calendar size={10} color="#a8a29e" />
                <Text className="text-[8px] font-black text-stone-400 uppercase tracking-widest">
                  {new Date(f.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View className="bg-stone-50 p-4 rounded-2xl">
              <View className="flex-row gap-2">
                <MessageSquare size={14} color="#d6d3d1" />
                <Text className="text-xs font-bold text-stone-600 leading-relaxed italic flex-1">
                  "{f.comment || 'No comment.'}"
                </Text>
              </View>
            </View>
          </View>
        ))}

        {feedback.length === 0 && (
          <View className="bg-white p-12 rounded-[3rem] border border-stone-100 items-center">
            <View className="bg-stone-50 w-16 h-16 rounded-full items-center justify-center mb-6">
              <MessageSquare size={32} color="#e7e5e4" />
            </View>
            <Text className="text-xl font-black text-stone-800">No feedback yet</Text>
            <Text className="text-stone-400 font-medium text-center mt-2">Customer reviews will appear here.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

