import { motion } from 'motion/react';
import { Clock, CheckCircle, Play, Check } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface KitchenViewProps {
  orders: any[];
  token: string | null;
  onUpdateOrder: () => void;
}

export function KitchenView({ orders, token, onUpdateOrder }: KitchenViewProps) {
  const kitchenOrders = orders.filter(o => ['Pending', 'Preparing'].includes(o.status));

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onUpdateOrder();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-stone-800">Kitchen Display</h2>
          <p className="text-stone-400 text-sm font-medium mt-1">Manage active orders and preparation status.</p>
        </div>
        <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kitchenOrders.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[3rem] border border-stone-100 text-center">
            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200">
              <Clock size={48} />
            </div>
            <h3 className="text-2xl font-black text-stone-800">All caught up!</h3>
            <p className="text-stone-400 font-medium">No pending orders in the kitchen right now.</p>
          </div>
        ) : (
          kitchenOrders.map((order) => (
            <motion.div
              layout
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className={`p-6 ${order.status === 'Preparing' ? 'bg-amber-50' : 'bg-stone-50'} border-b border-stone-100 flex justify-between items-center`}>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Table {order.tableNumber}</p>
                  <h3 className="text-lg font-black text-stone-800">Order #{order._id.slice(-4).toUpperCase()}</h3>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  order.status === 'Preparing' ? 'bg-amber-200 text-amber-800' : 'bg-stone-200 text-stone-600'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="p-6 flex-1 space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-xs font-black text-stone-600">
                        {item.quantity}x
                      </span>
                      <span className="text-sm font-bold text-stone-800">{item.menuItem?.name || 'Item'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex gap-3">
                {order.status === 'Pending' ? (
                  <button
                    onClick={() => updateStatus(order._id, 'Preparing')}
                    className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-2xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                  >
                    <Play size={18} fill="currentColor" />
                    Start Prep
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(order._id, 'Ready')}
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Check size={18} strokeWidth={3} />
                    Mark Ready
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
