import { CreditCard, CheckCircle, Clock, Search, Filter, Download } from 'lucide-react';
import { useState } from 'react';

interface PaymentManagementProps {
  payments: any[];
  token: string | null;
}

export function PaymentManagement({ payments, token }: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(p => 
    p.orderId?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-stone-800">
            Rs. {payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Transactions</p>
          <p className="text-2xl font-black text-stone-800">{payments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Avg. Transaction</p>
          <p className="text-2xl font-black text-stone-800">
            Rs. {payments.length > 0 ? Math.round(payments.reduce((acc, p) => acc + p.amount, 0) / payments.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Search by Order ID, Method or Amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-stone-50 text-stone-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-100 transition-all">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-stone-900/10">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Order Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                      <CreditCard size={32} />
                    </div>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-stone-800">#{payment._id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-medium text-stone-400">{new Date(payment.paidAt || payment.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-stone-800">Order #{payment.orderId?._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                      <p className="text-[10px] font-medium text-stone-400">
                        {payment.orderId?.customerName || `Table ${payment.orderId?.tableNumber || '?'}`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-stone-100 rounded-lg text-stone-600">
                          <CreditCard size={14} />
                        </div>
                        <span className="text-xs font-bold text-stone-600">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-stone-800">Rs. {payment.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        payment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                        payment.status === 'Failed' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
