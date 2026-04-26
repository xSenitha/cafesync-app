import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

export function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <TouchableOpacity 
      onPress={onClick}
      className={`w-full flex-row items-center justify-between px-4 py-3.5 rounded-2xl ${
        active 
          ? 'bg-stone-900 shadow-xl shadow-stone-900/10' 
          : 'bg-transparent'
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View className={`${active ? 'text-amber-500' : 'text-stone-500'}`}>
          {icon}
        </View>
        <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-stone-500'}`}>{label}</Text>
      </View>
      {badge !== undefined && badge > 0 && (
        <View className={`px-2 py-0.5 rounded-full ${active ? 'bg-amber-500' : 'bg-amber-100'}`}>
          <Text className={`text-[10px] font-black ${active ? 'text-stone-900' : 'text-amber-700'}`}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <View className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-stone-100 shadow-sm flex-row items-center gap-3 sm:gap-5">
      <View className={`${color} p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-stone-200`}>
        {icon}
      </View>
      <View>
        <Text className="text-[9px] sm:text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</Text>
        <Text className="text-lg sm:text-xl font-black text-stone-800 mt-0.5">{value}</Text>
      </View>
    </View>
  );
}

interface TeamMemberProps {
  name: string;
  id: string;
  role: string;
}

export function TeamMember({ name, id, role }: TeamMemberProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center border border-white/10">
          <Text className="text-xs font-black text-white">
            {name.split(' ')[0][0]}
          </Text>
        </View>
        <View>
          <Text className="text-sm font-bold text-white">{name}</Text>
          <Text className="text-[10px] text-white/40 font-medium">{id}</Text>
        </View>
      </View>
      <View className="text-right">
        <Text className="text-[10px] font-black text-amber-500 uppercase tracking-wider">{role}</Text>
      </View>
    </View>
  );
}

interface QuickActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

export function QuickAction({ icon, label, onClick, color }: QuickActionProps) {
  return (
    <TouchableOpacity 
      onPress={onClick}
      className={`${color} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] items-center justify-center gap-2 sm:gap-3 shadow-lg`}
    >
      <View className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
        {icon}
      </View>
      <Text className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white">{label}</Text>
    </TouchableOpacity>
  );
}

