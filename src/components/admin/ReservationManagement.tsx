import React from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, Phone, User } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface ReservationManagementProps {
  reservations: any[];
  tables: any[];
  token: string | null;
  onUpdate: () => void;
}

export function ReservationManagement({ reservations, tables, token, onUpdate }: ReservationManagementProps) {
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const [newTableCapacity, setNewTableCapacity] = React.useState('4');

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

  const addTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          number: parseInt(newTableNumber),
          capacity: parseInt(newTableCapacity)
        })
      });
      if (res.ok) {
        setNewTableNumber('');
        onUpdate();
      }
    } catch (err) {
      console.error('Add table error:', err);
    }
  };

  const deleteTable = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Delete table error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Table Management Section */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-stone-800">Table Management</h3>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Manage your restaurant layout</p>
          </div>
          <form onSubmit={addTable} className="flex items-center gap-3">
            <input 
              type="number"
              placeholder="Table #"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="w-24 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />
            <input 
              type="number"
              placeholder="Capacity"
              value={newTableCapacity}
              onChange={(e) => setNewTableCapacity(e.target.value)}
              className="w-24 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />
            <button 
              type="submit"
              className="bg-stone-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Add Table
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {tables.map((table) => (
            <div key={table._id} className="group relative bg-stone-50 border border-stone-100 rounded-2xl p-4 flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Table</span>
              <span className="text-xl font-black text-stone-800">{table.number}</span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{table.capacity} Seats</span>
              
              <button 
                onClick={() => deleteTable(table._id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <XCircle size={12} />
              </button>
            </div>
          ))}
          {tables.length === 0 && (
            <div className="col-span-full py-8 text-center text-stone-400 text-xs font-bold uppercase tracking-widest">
              No tables configured yet.
            </div>
          )}
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100">
          <h3 className="text-lg font-black text-stone-800">Active Reservations</h3>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Monitor and manage guest bookings</p>
        </div>
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
    </div>
  );
}
