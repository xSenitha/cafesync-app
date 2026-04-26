import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Calendar, Users, Clock, CheckCircle, XCircle, Phone, User, Trash2, Edit2, Save, X } from 'lucide-react-native';
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
    Alert.alert(
      'Delete Reservation',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
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
          }
        }
      ]
    );
  };

  const addTable = async () => {
    if (!newTableNumber || !newTableCapacity) return;
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
    Alert.alert(
      'Delete Table',
      'Are you sure you want to delete this table?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
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
          }
        }
      ]
    );
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
    if (table.currentStatus) return table.currentStatus;
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
      return diffHours < 2;
    });
    if (hasReservation) return 'Reserved';
    return 'Available';
  };

  const handleStatusChange = (table: any) => {
    Alert.alert(
      'Set Table Status',
      `Table ${table.number} - Choose status:`,
      [
        { text: 'Available', onPress: () => updateTableStatus(table._id, 'Available') },
        { text: 'Occupied', onPress: () => updateTableStatus(table._id, 'Occupied') },
        { text: 'Reserved', onPress: () => updateTableStatus(table._id, 'Reserved') },
        { text: 'Cleaning', onPress: () => updateTableStatus(table._id, 'Cleaning') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 px-4 py-4 space-y-8">
      {/* Table Management Section */}
      <View className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden mb-8">
        <View className="p-8 border-b border-stone-100">
          <Text className="text-xl font-black text-stone-800">Table Layout</Text>
          <Text className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Manage restaurant seating</Text>
          
          <View className="flex-row items-center gap-4 mt-4 flex-wrap">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-[8px] font-black text-stone-400 uppercase">Available</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-amber-500" />
              <Text className="text-[8px] font-black text-stone-400 uppercase">Occupied</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-blue-500" />
              <Text className="text-[8px] font-black text-stone-400 uppercase">Reserved</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 bg-stone-50 p-2 rounded-2xl border border-stone-100 mt-6">
            <View className="flex-1 flex-row items-center gap-2 px-3">
              <Text className="text-[8px] font-black text-stone-400 uppercase">#</Text>
              <TextInput 
                value={newTableNumber}
                onChangeText={setNewTableNumber}
                placeholder="Table"
                keyboardType="numeric"
                className="flex-1 p-0 text-sm font-black text-stone-800"
              />
            </View>
            <View className="w-px h-6 bg-stone-200" />
            <View className="flex-1 flex-row items-center gap-2 px-3">
              <Users size={12} color="#a8a29e" />
              <TextInput 
                value={newTableCapacity}
                onChangeText={setNewTableCapacity}
                placeholder="Seats"
                keyboardType="numeric"
                className="flex-1 p-0 text-sm font-black text-stone-800"
              />
            </View>
            <TouchableOpacity 
              onPress={addTable}
              className="bg-stone-900 px-4 py-2 rounded-xl"
            >
              <Text className="text-white text-[10px] font-black uppercase">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4 flex-row flex-wrap gap-3">
          {tables.map((table) => {
            const status = getTableStatus(table);
            const isEditing = editingTable === table._id;

            return (
              <View key={table._id} className={`bg-white border rounded-2xl p-4 items-center gap-1 w-[22%] mb-2 ${
                status === 'Occupied' ? 'border-amber-200' : 
                status === 'Reserved' ? 'border-blue-200' : 
                status === 'Cleaning' ? 'border-purple-200' :
                'border-stone-100'
              }`}>
                {isEditing ? (
                  <View className="items-center gap-2 w-full">
                    <TextInput 
                      value={editNumber}
                      onChangeText={setEditNumber}
                      keyboardType="numeric"
                      className="w-full bg-stone-50 border border-stone-100 rounded-lg text-xs font-black text-center"
                    />
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => updateTable(table._id)} className="p-1.5 bg-stone-900 rounded-lg">
                        <Save size={12} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingTable(null)} className="p-1.5 bg-stone-100 rounded-lg">
                        <X size={12} color="#78716c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity onPress={() => handleStatusChange(table)} className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
                      status === 'Occupied' ? 'bg-amber-100' : 
                      status === 'Reserved' ? 'bg-blue-100' : 
                      status === 'Cleaning' ? 'bg-purple-100' :
                      'bg-stone-50'
                    }`}>
                      <Text className="text-lg font-black">{table.number}</Text>
                    </TouchableOpacity>
                    <Text className="text-[8px] font-black text-stone-400 uppercase">{table.capacity} Seats</Text>
                    
                    <View className="flex-row gap-2 mt-2">
                      <TouchableOpacity onPress={() => startEditing(table)}>
                        <Edit2 size={10} color="#a8a29e" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteTable(table._id)}>
                        <Trash2 size={10} color="#f87171" />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Reservations List */}
      <View className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden mb-8">
        <View className="p-8 border-b border-stone-100 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-stone-800">Reservations</Text>
            <Text className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Guest bookings</Text>
          </View>
          <View className="bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
            <Text className="text-sm font-black text-stone-800">{reservations.length}</Text>
          </View>
        </View>

        <View className="p-4">
          {reservations.map((res: any) => (
            <View key={res._id} className="bg-stone-50/50 p-5 rounded-3xl border border-stone-100 mb-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="bg-white p-2 rounded-xl border border-stone-100">
                    <User size={18} color="#57534e" />
                  </View>
                  <View>
                    <Text className="text-sm font-black text-stone-800">{res.customerName}</Text>
                    <View className="flex-row items-center gap-1">
                      <Phone size={10} color="#a8a29e" />
                      <Text className="text-[10px] font-bold text-stone-400">{res.customerPhone}</Text>
                    </View>
                  </View>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  res.status === 'Confirmed' ? 'bg-emerald-100' : 
                  res.status === 'Cancelled' ? 'bg-red-100' : 
                  res.status === 'Completed' ? 'bg-blue-100' :
                  'bg-amber-100'
                }`}>
                  <Text className={`text-[8px] font-black uppercase ${
                    res.status === 'Confirmed' ? 'text-emerald-700' : 
                    res.status === 'Cancelled' ? 'text-red-700' : 
                    res.status === 'Completed' ? 'text-blue-700' :
                    'text-amber-700'
                  }`}>
                    {res.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-4 mb-4">
                <View className="flex-row items-center gap-1.5">
                  <Users size={12} color="#a8a29e" />
                  <Text className="text-[10px] font-bold text-stone-600">{res.numberOfGuests} Guests</Text>
                </View>
                <View className="bg-amber-50 px-2 py-0.5 rounded-md">
                  <Text className="text-[8px] font-black text-amber-700 uppercase">Table #{res.tableNumber}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 mb-4">
                <View className="flex-row items-center gap-1.5">
                  <Calendar size={12} color="#a8a29e" />
                  <Text className="text-[10px] font-black text-stone-800">{new Date(res.reservationTime).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={12} color="#a8a29e" />
                  <Text className="text-[10px] font-black text-stone-800">
                    {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-end gap-2 pt-4 border-t border-stone-100">
                {res.status === 'Pending' && (
                  <TouchableOpacity onPress={() => updateStatus(res._id, 'Confirmed')} className="p-2 bg-amber-50 rounded-xl">
                    <CheckCircle size={18} color="#d97706" />
                  </TouchableOpacity>
                )}
                {res.status === 'Confirmed' && (
                  <TouchableOpacity onPress={() => updateStatus(res._id, 'Completed')} className="p-2 bg-emerald-50 rounded-xl">
                    <CheckCircle size={18} color="#10b981" />
                  </TouchableOpacity>
                )}
                {(res.status === 'Pending' || res.status === 'Confirmed') && (
                  <TouchableOpacity onPress={() => updateStatus(res._id, 'Cancelled')} className="p-2 bg-red-50 rounded-xl">
                    <XCircle size={18} color="#f87171" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteReservation(res._id)} className="p-2 bg-stone-100 rounded-xl">
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {reservations.length === 0 && (
            <View className="py-12 items-center">
              <Text className="text-stone-400 font-bold uppercase tracking-widest">No reservations</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
