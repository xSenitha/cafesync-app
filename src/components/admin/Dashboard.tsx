import { ShoppingCart, Calendar, Coffee, TrendingUp, Users, Clock, Plus, Utensils, AlertTriangle, Box } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, TeamMember, QuickAction } from '../ui/DashboardUI';

interface DashboardProps {
  payments: any[];
  orders: any[];
  reservations: any[];
  menuItems: any[];
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ payments, orders, reservations, menuItems, setActiveTab }: DashboardProps) {
  const lowStockItems = menuItems.filter(item => item.stockQuantity <= (item.lowStockThreshold || 10));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Sales" value={`Rs. ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<TrendingUp size={18} className="sm:w-5 sm:h-5" />} color="bg-emerald-500" />
        <StatCard label="Orders" value={orders.filter(o => o.status !== 'Paid' && o.status !== 'Cancelled').length} icon={<ShoppingCart size={18} className="sm:w-5 sm:h-5" />} color="bg-amber-500" />
        <StatCard label="Booking" value={reservations.filter(r => r.status === 'Confirmed').length} icon={<Calendar size={18} className="sm:w-5 sm:h-5" />} color="bg-blue-500" />
        <StatCard label="Menu" value={menuItems.length} icon={<Coffee size={18} className="sm:w-5 sm:h-5" />} color="bg-purple-500" />
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-amber-600">
              <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-amber-900 font-black text-sm sm:text-base">Inventory Alert</h3>
              <p className="text-amber-700 text-xs sm:text-sm font-medium">
                {lowStockItems.length} items are running low.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('inventory')}
            className="w-full sm:w-auto bg-amber-600 text-white px-6 py-2.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20"
          >
            Manage Stock
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-stone-800">Revenue Overview</h3>
              <p className="text-stone-400 text-[10px] sm:text-xs font-medium mt-1">Daily earnings for the past week</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-100 w-fit">
              <button className="px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-white text-stone-800 rounded-lg shadow-sm border border-stone-100">Weekly</button>
              <button className="px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[200px] sm:h-[300px] w-full">
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
                  dy={10}
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
                  cursor={{ stroke: '#f5f5f4', strokeWidth: 2 }}
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-stone-800 flex items-center gap-2">
                <Clock size={20} className="text-amber-600" /> Recent Activity
              </h3>
              <p className="text-stone-400 text-xs font-medium mt-1">Latest customer transactions</p>
            </div>
            <button onClick={() => setActiveTab('orders')} className="bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-all">View All</button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between p-5 bg-stone-50/50 rounded-3xl border border-stone-100 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 group-hover:border-amber-200 transition-colors">
                    <ShoppingCart size={20} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-800">Table #{order.tableNumber || 'N/A'}</p>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</p>
                  <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full mt-1 inline-block ${
                    order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <h3 className="text-xl font-black text-stone-800 mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Plus size={20} />} label="New Order" onClick={() => setActiveTab('orders')} color="bg-stone-900" />
            <QuickAction icon={<Utensils size={20} />} label="Update Menu" onClick={() => setActiveTab('menu')} color="bg-amber-600" />
            <QuickAction icon={<Calendar size={20} />} label="Book Table" onClick={() => setActiveTab('reservations')} color="bg-stone-900" />
            <QuickAction icon={<Users size={20} />} label="Staff Duty" onClick={() => setActiveTab('staff')} color="bg-stone-900" />
          </div>
        </div>
      </div>
    </div>
  );
}
