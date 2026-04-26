import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ShoppingCart, Calendar, Coffee, TrendingUp, Users, Clock, Plus, Utensils, AlertTriangle, Box } from 'lucide-react-native';
import { StatCard, TeamMember, QuickAction } from '../ui/DashboardUI';
import * as Recharts from 'recharts';

// Extract Recharts components with safety for native
const AreaChart = Recharts.AreaChart || (() => null);
const Area = Recharts.Area || (() => null);
const XAxis = Recharts.XAxis || (() => null);
const YAxis = Recharts.YAxis || (() => null);
const CartesianGrid = Recharts.CartesianGrid || (() => null);
const Tooltip = Recharts.Tooltip || (() => null);
const ResponsiveContainer = Recharts.ResponsiveContainer || (() => null);

interface DashboardProps {
  payments: any[];
  orders: any[];
  reservations: any[];
  tables: any[];
  menuItems: any[];
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ payments, orders, reservations, tables, menuItems, setActiveTab }: DashboardProps) {
  const lowStockItems = menuItems.filter(item => item.stockQuantity <= (item.lowStockThreshold || 10));

  const getTableStatus = (table: any) => {
    if (table.currentStatus) return table.currentStatus;
    const num = table.number;
    const hasActiveOrder = orders.some(o => 
      o.tableNumber === num && 
      ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
    );
    if (hasActiveOrder) return 'Occupied';

    const now = new Date();
    const hasReservation = reservations.some(r => {
      if (r.tableNumber !== num || (r.status !== 'Confirmed' && r.status !== 'Pending')) return false;
      const resTime = new Date(r.reservationTime);
      const diffMs = Math.abs(now.getTime() - resTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours < 2; // Within 2 hours
    });
    if (hasReservation) return 'Reserved';

    return 'Available';
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="space-y-8 p-4">
        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-3 sm:gap-4">
          <View className="flex-1 min-w-[45%]">
            <StatCard label="Total Sales" value={`Rs. ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<TrendingUp size={18} color="white" />} color="bg-emerald-500" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <StatCard label="Orders" value={orders.filter(o => o.status !== 'Paid' && o.status !== 'Cancelled').length} icon={<ShoppingCart size={18} color="white" />} color="bg-amber-500" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <StatCard label="Booking" value={reservations.filter(r => r.status === 'Confirmed').length} icon={<Calendar size={18} color="white" />} color="bg-blue-500" />
          </View>
          <View className="flex-1 min-w-[45%]">
            <StatCard label="Menu" value={menuItems.length} icon={<Coffee size={18} color="white" />} color="bg-purple-500" />
          </View>
        </View>

        {lowStockItems.length > 0 && (
          <View className="bg-amber-50 border border-amber-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex-column sm:flex-row items-start sm:items-center justify-between gap-4">
            <View className="flex-row items-center gap-3 sm:gap-4">
              <View className="bg-amber-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                <AlertTriangle size={20} color="#b45309" />
              </View>
              <View>
                <Text className="text-amber-900 font-black text-sm sm:text-base">Inventory Alert</Text>
                <Text className="text-amber-700 text-xs sm:text-sm font-medium">
                  {lowStockItems.length} items are running low.
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setActiveTab('inventory')}
              className="w-full sm:w-auto bg-amber-600 px-6 py-2.5 sm:py-2 rounded-xl"
            >
              <Text className="text-white text-center text-[10px] sm:text-xs font-black uppercase tracking-wider">Manage Stock</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Revenue Chart - Web Only */}
        {Platform.OS === 'web' && ResponsiveContainer && (
          <View className="bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-stone-100 shadow-sm">
            <View className="flex-column sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <View>
                <Text className="text-lg sm:text-xl font-black text-stone-800">Revenue Overview</Text>
                <Text className="text-stone-400 text-[10px] sm:text-xs font-medium mt-1">Daily earnings for the past week</Text>
              </View>
            </View>
            <View style={{ height: 200, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payments.slice(-7).map((p, i) => ({ name: `Day ${i+1}`, value: p.amount }))}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b45309" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#b45309" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1c1917', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#fbbf24' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#b45309" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </View>
          </View>
        )}

        <View className="flex-column gap-8">
          {/* Table Status Overview */}
          <View className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <Text className="text-xl font-black text-stone-800">Table Status</Text>
                <Text className="text-stone-400 text-xs font-medium mt-1">Current floor occupancy</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2 mb-4">
              <View className="flex-row items-center gap-1.5 mr-3">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Available</Text>
              </View>
              <View className="flex-row items-center gap-1.5 mr-3">
                <View className="w-2 h-2 rounded-full bg-amber-500" />
                <Text className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Occupied</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-blue-500" />
                <Text className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Reserved</Text>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {tables.map((table: any) => {
                const status = getTableStatus(table);
                return (
                  <View 
                    key={table._id} 
                    className={`w-[22%] aspect-square rounded-2xl items-center justify-center gap-1 border-2 ${
                      status === 'Occupied' ? 'bg-amber-50 border-amber-100' :
                      status === 'Reserved' ? 'bg-blue-50 border-blue-100' :
                      'bg-stone-50 border-stone-100'
                    }`}
                  >
                    <Text className={`text-sm font-black ${
                      status === 'Occupied' ? 'text-amber-600' :
                      status === 'Reserved' ? 'text-blue-600' :
                      'text-stone-400'
                    }`}>{table.number}</Text>
                    <Text className={`text-[7px] font-black uppercase tracking-tighter ${
                      status === 'Occupied' ? 'text-amber-600' :
                      status === 'Reserved' ? 'text-blue-600' :
                      'text-stone-400'
                    }`}>{status}</Text>
                  </View>
                );
              })}
              {tables.length === 0 && (
                <View className="py-8 items-center justify-center w-full">
                  <Text className="text-stone-400 text-[10px] font-black uppercase tracking-widest">No tables configured</Text>
                </View>
              )}
            </View>
          </View>

          {/* Recent Orders */}
          <View className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-8">
              <View>
                <View className="flex-row items-center gap-2">
                  <Clock size={20} color="#b45309" />
                  <Text className="text-xl font-black text-stone-800">Recent Activity</Text>
                </View>
                <Text className="text-stone-400 text-xs font-medium mt-1">Latest customer transactions</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveTab('orders')} className="bg-stone-50 px-4 py-2 rounded-xl">
                <Text className="text-xs font-bold text-stone-600">View All</Text>
              </TouchableOpacity>
            </View>
            <View className="space-y-4">
              {orders.slice(0, 4).map((order: any) => (
                <View key={order._id} className="flex-row items-center justify-between p-5 bg-stone-50/50 rounded-3xl border border-stone-100">
                  <View className="flex-row items-center gap-4">
                    <View className="bg-white p-3 rounded-2xl border border-stone-200">
                      <ShoppingCart size={20} color="#a8a29e" />
                    </View>
                    <View>
                      <Text className="text-sm font-black text-stone-800">Table #{order.tableNumber || 'N/A'}</Text>
                      <Text className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{new Date(order.createdAt).toLocaleTimeString()}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</Text>
                    <View className={`px-3 py-1 rounded-full mt-1 ${
                      order.status === 'Paid' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      <Text className={`text-[9px] font-black uppercase ${
                        order.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm mb-4">
            <Text className="text-xl font-black text-stone-800 mb-8">Quick Actions</Text>
            <View className="flex-row flex-wrap gap-4">
              <View className="flex-1 min-w-[45%]">
                <QuickAction icon={<Plus size={20} color="white" />} label="New Order" onClick={() => setActiveTab('orders')} color="bg-stone-900" />
              </View>
              <View className="flex-1 min-w-[45%]">
                <QuickAction icon={<Utensils size={20} color="white" />} label="Update Menu" onClick={() => setActiveTab('menu')} color="bg-amber-600" />
              </View>
              <View className="flex-1 min-w-[45%]">
                <QuickAction icon={<Calendar size={20} color="white" />} label="Book Table" onClick={() => setActiveTab('reservations')} color="bg-stone-900" />
              </View>
              <View className="flex-1 min-w-[45%]">
                <QuickAction icon={<Users size={20} color="white" />} label="Staff Duty" onClick={() => setActiveTab('staff')} color="bg-stone-900" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
