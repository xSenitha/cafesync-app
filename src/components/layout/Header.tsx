import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Coffee, Menu, X, Monitor, User } from 'lucide-react-native';

interface HeaderProps {
  user: any;
  health: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  viewMode: 'admin' | 'customer';
  setViewMode: (mode: 'admin' | 'customer') => void;
}

export function Header({ user, health, isSidebarOpen, setIsSidebarOpen, viewMode, setViewMode }: HeaderProps) {
  return (
    <View className="bg-white/80 border-b border-stone-100 px-4 sm:px-6 py-3 sm:py-4 flex-row justify-between items-center z-50">
      <View className="flex-row items-center gap-2 sm:gap-3">
        {user && (
          <TouchableOpacity 
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-stone-100 rounded-xl"
          >
            {isSidebarOpen ? <X size={20} color="#57534e" /> : <Menu size={20} color="#57534e" />}
          </TouchableOpacity>
        )}
        <View className="bg-amber-800 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-amber-900/20">
          <Coffee size={20} color="white" strokeWidth={2.5} />
        </View>
        <View>
          <Text className="text-base sm:text-xl font-black text-stone-800 leading-tight">CafeSync</Text>
          <Text className="text-[8px] sm:text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-0.5">Management</Text>
        </View>
      </View>
      
      <View className="flex-row items-center gap-2 sm:gap-6">
        {user && (user.role === 'admin' || user.role === 'manager' || user.role === 'staff') && (
          <TouchableOpacity 
            onPress={() => setViewMode(viewMode === 'admin' ? 'customer' : 'admin')}
            className="flex-row items-center gap-2 px-2 sm:px-4 py-2 bg-stone-100 rounded-xl"
          >
            <Monitor size={14} color="#57534e" />
            <Text className="hidden md:flex text-[10px] sm:text-xs font-black uppercase tracking-wider text-stone-600">
              {viewMode === 'admin' ? 'Customer' : 'Admin'}
            </Text>
          </TouchableOpacity>
        )}
        {health && (
          <View className="hidden sm:flex items-end">
            <View className="flex-row items-center gap-1.5">
              <View className={`w-1.5 h-1.5 rounded-full ${health.database === 'Connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></View>
              <Text className="text-[9px] sm:text-[10px] font-bold uppercase text-stone-400 tracking-wider">Live</Text>
            </View>
            <Text className={`text-[8px] sm:text-[9px] font-black uppercase ${health.database === 'Connected' ? 'text-emerald-600' : 'text-red-500'}`}>
              {health.database === 'Connected' ? 'Online' : 'Offline'}
            </Text>
          </View>
        )}
        {user && (
          <View className="flex-row items-center gap-2 sm:gap-4 pl-3 sm:pl-6 border-l border-stone-100">
            <View className="items-end">
              <Text className="text-[10px] sm:text-sm font-black text-stone-800 leading-none">{user.name.split(' ')[0]}</Text>
              <Text className="text-[8px] sm:text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-0.5">{user.role}</Text>
            </View>
            <View className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-900 rounded-xl sm:rounded-2xl items-center justify-center shadow-lg shadow-stone-900/20">
              <Text className="text-white font-black text-xs sm:text-sm">
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

