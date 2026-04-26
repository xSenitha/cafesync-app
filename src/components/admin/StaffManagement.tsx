import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, AlertButton } from 'react-native';
import { Trash2, Shield, Mail, User, ShieldCheck, ShieldAlert } from 'lucide-react-native';
import { API_BASE_URL } from '../../config';

interface StaffManagementProps {
  token: string | null;
  currentUser: any;
}

export function StaffManagement({ token, currentUser }: StaffManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      setError('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Update role error:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    Alert.alert(
      'Remove Staff',
      'Are you sure you want to remove this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if (res.ok) {
                fetchUsers();
              }
            } catch (err) {
              console.error('Delete user error:', err);
            }
          }
        }
      ]
    );
  };

  const handleRoleChange = (targetUser: any) => {
    const roles = getAvailableRoles(targetUser);
    const buttons: AlertButton[] = roles.map(role => ({
        text: role === 'customer' ? 'Member' : role.charAt(0).toUpperCase() + role.slice(1),
        onPress: () => updateRole(targetUser._id, role)
      }));
    
    Alert.alert(
      'Change Role',
      `Change role for ${targetUser.name}:`,
      buttons.concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const canManageUser = (targetUser: any) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'manager') {
      return targetUser.role === 'staff' || targetUser.role === 'customer';
    }
    return false;
  };

  const getAvailableRoles = (targetUser: any) => {
    if (currentUser?.role === 'admin') {
      return ['customer', 'staff', 'manager', 'admin'];
    }
    if (currentUser?.role === 'manager') {
      return ['customer', 'staff'];
    }
    return [targetUser.role];
  };

  if (loading) return (
    <View className="p-12 items-center">
      <ActivityIndicator color="#57534e" />
      <Text className="text-stone-400 mt-4">Loading staff...</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 px-4 py-4 space-y-6">
      <View className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden p-4">
        {users.map((u: any) => (
          <View key={u._id} className="bg-stone-50/50 p-5 rounded-3xl border border-stone-100 mb-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-white p-2 rounded-xl border border-stone-100">
                  <User size={18} color="#57534e" />
                </View>
                <View>
                  <View className="flex-row items-center">
                    <Text className="text-sm font-black text-stone-800">{u.name}</Text>
                    {u._id === currentUser?.id && (
                      <View className="bg-stone-800 px-1.5 py-0.5 rounded ml-2">
                        <Text className="text-[8px] text-white font-black uppercase">You</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center gap-1 mt-1">
                    <Mail size={12} color="#a8a29e" />
                    <Text className="text-[10px] font-bold text-stone-400">{u.email}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleRoleChange(u)}
                disabled={!canManageUser(u) || u._id === currentUser?.id}
                className={`px-3 py-1 rounded-full flex-row items-center gap-2 ${
                u.role === 'admin' ? 'bg-amber-100' :
                u.role === 'manager' ? 'bg-purple-100' :
                u.role === 'staff' ? 'bg-blue-100' :
                'bg-stone-100'
              }`}>
                <Text className={`text-[10px] font-black uppercase ${
                  u.role === 'admin' ? 'text-amber-700' :
                  u.role === 'manager' ? 'text-purple-700' :
                  u.role === 'staff' ? 'text-blue-700' :
                  'text-stone-700'
                }`}>
                  {u.role === 'customer' ? 'Member' : u.role}
                </Text>
                {u.role === 'admin' ? <ShieldCheck size={12} color="#f59e0b" /> : 
                 u.role === 'manager' ? <ShieldAlert size={12} color="#a855f7" /> :
                 <Shield size={12} color="#a8a29e" />}
              </TouchableOpacity>
            </View>

            {canManageUser(u) && u._id !== currentUser?.id && (
              <View className="flex-row justify-end pt-4 border-t border-stone-100">
                <TouchableOpacity onPress={() => deleteUser(u._id)} className="p-2 bg-red-50 rounded-xl">
                  <Trash2 size={18} color="#f87171" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
