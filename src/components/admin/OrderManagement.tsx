import { ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface OrderManagementProps {
  orders: any[];
  token: string | null;
  onUpdateOrder: () => void;
}

export function OrderManagement({ orders, token, onUpdateOrder }: OrderManagementProps) {
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
    <div className="bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-100">
            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Order ID</th>
            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Customer/Table</th>
            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {orders.map((order: any) => (
            <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-xs font-bold text-stone-800">#{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-[10px] font-medium text-stone-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-stone-800">{order.customerName || `Table ${order.tableNumber}`}</p>
                <p className="text-[10px] font-medium text-stone-400">{order.orderType}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-black text-stone-800">Rs. {order.totalAmount}</p>
              </td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                  order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                  order.status === 'Ready' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-700'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                    <button onClick={() => updateStatus(order._id, 'Paid')} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Mark as Paid">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => updateStatus(order._id, 'Cancelled')} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors" title="Cancel Order">
                    <XCircle size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
