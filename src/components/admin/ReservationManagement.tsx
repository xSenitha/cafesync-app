import React from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, Phone, User, Trash2, Edit2, Save, X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface ReservationManagementProps {
  reservations: any[];
  orders: any[];
  tables: any[];
  token: string | null;
  onUpdate: () => void;
}

export function ReservationManagement({ reservations, orders, tables, token, onUpdate }: ReservationManagementProps) {
  const [newTableNumber, setNewTableNumber] = React.useState('');
  const [newTableCapacity, setNewTableCapacity] = React.useState('4');
  const [editingTable, setEditingTable] = React.useState<any>(null);
  const [editNumber, setEditNumber] = React.useState('');
  const [editCapacity, setEditCapacity] = React.useState('');

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

  const deleteReservation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Delete reservation error:', err);
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

  const updateTableStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
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
      console.error('Update table status error:', err);
    }
  };

  const updateTable = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          number: parseInt(editNumber),
          capacity: parseInt(editCapacity)
        })
      });
      if (res.ok) {
        setEditingTable(null);
        onUpdate();
      }
    } catch (err) {
      console.error('Update table error:', err);
    }
  };

  const startEditing = (table: any) => {
    setEditingTable(table._id);
    setEditNumber(table.number.toString());
    setEditCapacity(table.capacity.toString());
  };

  const getTableStatus = (table: any) => {
    // Manual status override if set
    if (table.status && table.status !== 'Available') return table.status;

    const num = table.number;
    const hasActiveOrder = orders.some(o => 
      o && o.tableNumber === num && 
      ['Pending', 'Preparing', 'Ready', 'Served'].includes(o.status)
    );
    if (hasActiveOrder) return 'Occupied';

    const now = new Date();
    const hasReservation = reservations.some(r => {
      if (!r || r.tableNumber !== num || r.status === 'Cancelled' || r.status === 'Completed') return false;
      const resTime = new Date(r.reservationTime);
      const diffMs = Math.abs(now.getTime() - resTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours < 2; // Within 2 hours
    });
    if (hasReservation) return 'Reserved';

    return 'Available';
  };

  return (
    <div className="space-y-8">
      {/* Table Management Section */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-stone-800">Table Layout</h3>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Manage restaurant seating capacity</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Reserved</span>
            </div>
          </div>
          <form onSubmit={addTable} className="flex flex-wrap items-center gap-3 bg-stone-50 p-2 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-2 px-3">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Table</span>
              <input 
                type="number"
                placeholder="#"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                className="w-16 bg-transparent border-none p-0 text-sm font-black text-stone-800 focus:ring-0"
                required
              />
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div className="flex items-center gap-2 px-3">
              <Users size={14} className="text-stone-400" />
              <input 
                type="number"
                placeholder="Seats"
                value={newTableCapacity}
                onChange={(e) => setNewTableCapacity(e.target.value)}
                className="w-16 bg-transparent border-none p-0 text-sm font-black text-stone-800 focus:ring-0"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-stone-900/10"
            >
              Add Table
            </button>
          </form>
        </div>

        <div className="p-8 bg-stone-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {tables.map((table) => {
              const status = getTableStatus(table);
              const isEditing = editingTable === table._id;

              return (
                <div key={table._id} className={`group relative bg-white border rounded-2xl p-5 flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all ${
                  status === 'Occupied' ? 'border-amber-200 bg-amber-50/10' : 
                  status === 'Reserved' ? 'border-blue-200 bg-blue-50/10' : 
                  status === 'Cleaning' ? 'border-purple-200 bg-purple-50/10' :
                  'border-stone-100'
                }`}>
                  {isEditing ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-lg border border-stone-100 w-full">
                        <span className="text-[8px] font-black text-stone-400 uppercase ml-1">#</span>
                        <input 
                          type="number"
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-sm font-black text-stone-800 focus:ring-0 text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-lg border border-stone-100 w-full">
                        <Users size={10} className="text-stone-400 ml-1" />
                        <input 
                          type="number"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-sm font-black text-stone-800 focus:ring-0 text-center"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={() => updateTable(table._id)}
                          className="p-1.5 bg-stone-900 text-white rounded-lg hover:bg-black transition-colors"
                        >
                          <Save size={12} />
                        </button>
                        <button 
                          onClick={() => setEditingTable(null)}
                          className="p-1.5 bg-stone-100 text-stone-500 rounded-lg hover:bg-stone-200 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-colors ${
                        status === 'Occupied' ? 'bg-amber-100 text-amber-600' : 
                        status === 'Reserved' ? 'bg-blue-100 text-blue-600' : 
                        status === 'Cleaning' ? 'bg-purple-100 text-purple-600' :
                        'bg-stone-50 text-stone-800'
                      }`}>
                        <span className="text-xl font-black">{table.number}</span>
                      </div>
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{table.capacity} Seats</span>
                      
                      <select 
                        value={status}
                        onChange={(e) => updateTableStatus(table._id, e.target.value)}
                        className={`text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg mt-2 border-none focus:ring-0 cursor-pointer shadow-sm ${
                          status === 'Occupied' ? 'bg-amber-100 text-amber-700' : 
                          status === 'Reserved' ? 'bg-blue-100 text-blue-700' : 
                          status === 'Cleaning' ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Cleaning">Cleaning</option>
                      </select>
                      
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditing(table)}
                          className="text-stone-400 hover:text-amber-600 transition-colors p-1 bg-white rounded-full shadow-sm border border-stone-100"
                          title="Edit Table"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => deleteTable(table._id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-stone-100"
                          title="Delete Table"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {tables.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                  <Users size={32} />
                </div>
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">No tables configured yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-stone-800">Active Reservations</h3>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Monitor and manage guest bookings</p>
          </div>
          <div className="bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total: </span>
            <span className="text-sm font-black text-stone-800">{reservations.length}</span>
          </div>
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
                        {new Date(res.reservationTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <Clock size={14} className="text-stone-400" />
                        {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                      res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                      res.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {res.status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(res._id, 'Confirmed')}
                          className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors"
                          title="Confirm Reservation"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {res.status === 'Confirmed' && (
                        <button 
                          onClick={() => updateStatus(res._id, 'Completed')}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {(res.status === 'Pending' || res.status === 'Confirmed') && (
                        <button 
                          onClick={() => updateStatus(res._id, 'Cancelled')}
                          className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                          title="Cancel Reservation"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteReservation(res._id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                        title="Delete Reservation"
                      >
                        <Trash2 size={18} />
                      </button>
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
