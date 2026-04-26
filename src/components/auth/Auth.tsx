import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Coffee, LogIn, AlertCircle, CheckCircle, ActivityIndicator as StatusIndicator } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface AuthProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleLogin: () => void;
  handleRegister: () => void;
  health?: any;
}

export function Auth({ 
  name, setName, email, setEmail, password, setPassword, 
  loading, error, success, handleLogin, handleRegister,
  health
}: AuthProps) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-12">
      <View className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-stone-100">
        <View className="items-center mb-8">
          <View className="bg-amber-50 p-4 rounded-3xl mb-4">
            <Coffee size={32} color="#b45309" />
          </View>
          <Text className="text-3xl font-black text-stone-800 text-center">CafeSync</Text>
          <Text className="text-stone-400 text-sm mt-2 text-center mb-4">Manage your cafe with precision and ease.</Text>
          
          {/* Health Indicator */}
          <View className={`flex-row items-center gap-2 px-4 py-1.5 rounded-full border ${health ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
            <View className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <Text className={`text-[10px] font-bold ${health ? 'text-emerald-700' : 'text-amber-700'}`}>
              {health ? 'BACKEND CONNECTED' : `CONNECTING... ${API_BASE_URL || '(relative)'}`}
            </Text>
          </View>
        </View>
        
        {error && (
          <View className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex-row items-center gap-3">
            <AlertCircle size={18} color="#ef4444" />
            <Text className="text-red-600 text-xs font-bold flex-1">{error}</Text>
          </View>
        )}

        {success && (
          <View className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex-row items-center gap-3">
            <CheckCircle size={18} color="#10b981" />
            <Text className="text-emerald-600 text-xs font-bold flex-1">{success}</Text>
          </View>
        )}

        <View className="space-y-5">
          <View>
            <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Full Name</Text>
            <TextInput 
              value={name} 
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#d6d3d1"
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 text-stone-800 font-medium"
            />
          </View>
          <View>
            <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Email Address</Text>
            <TextInput 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Your Email"
              placeholderTextColor="#d6d3d1"
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 text-stone-800 font-medium"
            />
          </View>
          <View>
            <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Password</Text>
            <TextInput 
              value={password} 
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#d6d3d1"
              className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 text-stone-800 font-medium"
            />
          </View>
          <View className="gap-3 pt-4">
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className={`w-full bg-stone-900 h-16 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-stone-900/10 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <LogIn size={18} color="white" strokeWidth={2.5} />
                  <Text className="text-white font-bold">Sign In</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleRegister}
              disabled={loading}
              className={`w-full bg-white h-16 border-2 border-stone-100 rounded-2xl items-center justify-center ${loading ? 'opacity-50' : ''}`}
            >
              <Text className="text-stone-900 font-bold">
                {loading ? 'Creating Account...' : 'Create New Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

