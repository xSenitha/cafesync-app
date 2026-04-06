import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Shield, Mail, User, ShieldCheck, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface StaffManagementProps {
  token: string | null;
}

export function StaffManagement({ token }: StaffManagementProps) {
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
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
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
  };

  if (loading) return <div className="p-12 text-center text-stone-400">Loading staff...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-100 p-2 rounded-xl text-stone-600">
                        <User size={18} />
                      </div>
                      <p className="text-sm font-black text-stone-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                      <Mail size={14} className="text-stone-300" />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select 
                        value={u.role}
                        onChange={(e) => updateRole(u._id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-700' :
                          u.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                          'bg-stone-100 text-stone-700'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                      {u.role === 'admin' ? <ShieldCheck size={14} className="text-amber-500" /> : <Shield size={14} className="text-stone-300" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteUser(u._id)}
                      className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
