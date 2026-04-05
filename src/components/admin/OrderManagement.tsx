import { ChevronRight } from 'lucide-react';

interface OrderManagementProps {
  orders: any[];
}

export function OrderManagement({ orders }: OrderManagementProps) {
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
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-700'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-stone-400 hover:text-stone-900 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
