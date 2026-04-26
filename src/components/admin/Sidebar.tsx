import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LayoutDashboard, ShoppingCart, Coffee, Calendar, CreditCard, Users, MessageSquare, LogOut, Info, Box } from 'lucide-react-native';
import { NavItem } from '../ui/DashboardUI';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orders: any[];
  reservations: any[];
  user: any;
  onSignOut: () => void;
  viewMode?: 'admin' | 'customer';
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, orders, reservations, user, onSignOut, viewMode }: SidebarProps) {
  if (Platform.OS !== 'web' && !isSidebarOpen) return null;

  return (
    <>
      {isSidebarOpen && Platform.OS !== 'web' && (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-stone-900/20 z-40"
        />
      )}

      <View 
        className={`${isSidebarOpen ? 'flex' : 'hidden md:flex'} fixed lg:relative z-50 lg:z-0 bg-white lg:bg-transparent w-64 h-full p-6 lg:p-0 border-r lg:border-r-0 border-stone-100`}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="space-y-1.5">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
            
            <View className="pt-6 pb-2 px-4">
              <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Operations</Text>
            </View>
            <NavItem 
              icon={<ShoppingCart size={20} />} 
              label={viewMode === 'customer' ? "Order History" : "Orders (Admin)"} 
              active={activeTab === 'orders'} 
              onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} 
              badge={orders.filter(o => o.status === 'Pending').length} 
            />
            {viewMode !== 'customer' && (
              <NavItem icon={<Coffee size={20} />} label="Menu" active={activeTab === 'menu'} onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }} />
            )}
            {viewMode !== 'customer' && (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff') && (
              <NavItem icon={<Box size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} />
            )}
            <NavItem icon={<Calendar size={20} />} label="Reservations" active={activeTab === 'reservations'} onClick={() => { setActiveTab('reservations'); setIsSidebarOpen(false); }} badge={reservations.filter(r => r.status === 'Pending').length} />
            <NavItem icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} />
            
            <View className="pt-6 pb-2 px-4">
              <Text className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Management</Text>
            </View>
            {viewMode !== 'customer' && (user?.role === 'admin' || user?.role === 'manager') && (
              <NavItem icon={<Users size={20} />} label="Staff" active={activeTab === 'staff'} onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }} />
            )}
            {viewMode !== 'customer' && (
              <NavItem icon={<MessageSquare size={20} />} label="Feedback" active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }} />
            )}
            <NavItem icon={<Info size={20} />} label="About" active={activeTab === 'about'} onClick={() => { setActiveTab('about'); setIsSidebarOpen(false); }} />
            
            <View className="pt-10">
              <TouchableOpacity 
                onPress={onSignOut}
                className="w-full flex-row items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-50"
              >
                <LogOut size={20} color="#ef4444" />
                <Text className="text-sm font-bold text-red-500">Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

