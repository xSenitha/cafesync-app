import { ShoppingCart, Calendar, Coffee, TrendingUp, Users, Clock, Plus, Utensils } from 'lucide-react';
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
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sales" value={`Rs. ${payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-emerald-500" />
        <StatCard label="Active Orders" value={orders.filter(o => o.status !== 'Paid' && o.status !== 'Cancelled').length} icon={<ShoppingCart size={20} />} color="bg-amber-500" />
        <StatCard label="Reservations" value={reservations.filter(r => r.status === 'Confirmed').length} icon={<Calendar size={20} />} color="bg-blue-500" />
        <StatCard label="Menu Items" value={menuItems.length} icon={<Coffee size={20} />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-stone-800">Revenue Overview</h3>
              <p className="text-stone-400 text-xs font-medium mt-1">Daily earnings for the past week</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-100">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider bg-white text-stone-800 rounded-lg shadow-sm border border-stone-100">Weekly</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
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
