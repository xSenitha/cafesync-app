import React from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, Phone, User } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface ReservationManagementProps {
  reservations: any[];
  token: string | null;
  onUpdate: () => void;
}

export function ReservationManagement({ reservations, token, onUpdate }: ReservationManagementProps) {
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Update reservation error:', err);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100">
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Guest</th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Schedule</th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-stone-400 font-medium">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((res: any) => (
                <tr key={res._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-100 p-2 rounded-xl text-stone-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-stone-800">{res.customerName}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
                          <Phone size={10} />
                          {res.customerPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                        <Users size={14} className="text-stone-400" />
                        {res.numberOfGuests} Guests
                      </div>
                      <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                        Table #{res.tableNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <Calendar size={14} className="text-stone-400" />
                        {new Date(res.reservationDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <Clock size={14} className="text-stone-400" />
                        {new Date(res.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {res.status === 'Confirmed' && (
                        <>
                          <button 
                            onClick={() => updateStatus(res._id, 'Completed')}
                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(res._id, 'Cancelled')}
                            className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                            title="Cancel Reservation"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
