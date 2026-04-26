import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Users, Info, Award, ShieldCheck } from 'lucide-react-native';
import { TeamMember } from '../ui/DashboardUI';

export function About() {
  return (
    <ScrollView className="flex-1 space-y-6">
      {/* About Section */}
      <View className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden">
        <View className="relative z-10">
          <View className="bg-amber-50 w-16 h-16 rounded-2xl items-center justify-center mb-8">
            <Info size={32} color="#b45309" />
          </View>
          <Text className="text-3xl font-black text-stone-800 mb-4">About CafeSync</Text>
          <Text className="text-stone-500 text-base leading-relaxed font-medium">
            CafeSync is a comprehensive management suite designed specifically for modern cafes and restaurants. 
            Our mission is to bridge the gap between back-of-house operations and front-of-house customer experiences through 
            seamless digital integration. From real-time order tracking to inventory precision, CafeSync empowers your team 
            to focus on what matters most: delivering exceptional culinary moments.
          </Text>
          
          <View className="gap-4 mt-8">
            <View className="flex-row gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100">
              <Award size={24} color="#d97706" />
              <View className="flex-1">
                <Text className="font-black text-stone-800 text-[10px] uppercase tracking-wider">Our Vision</Text>
                <Text className="text-[10px] text-stone-400 mt-1 font-medium">To become the global standard for boutique cafe management systems.</Text>
              </View>
            </View>
            <View className="flex-row gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100">
              <ShieldCheck size={24} color="#d97706" />
              <View className="flex-1">
                <Text className="font-black text-stone-800 text-[10px] uppercase tracking-wider">Our Values</Text>
                <Text className="text-[10px] text-stone-400 mt-1 font-medium">Precision, reliability, and human-centric design in every line of code.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Team Section */}
      <View className="bg-stone-900 p-8 rounded-[2.5rem] shadow-2xl space-y-8 mb-10">
        <View className="flex-row items-center gap-4">
          <View className="bg-amber-500/20 p-3 rounded-2xl">
            <Users size={28} color="#f59e0b" />
          </View>
          <View>
            <Text className="text-xl font-black text-white">Development Team</Text>
            <Text className="text-white/40 text-[10px] font-medium uppercase tracking-widest">The minds behind CafeSync</Text>
          </View>
        </View>
        
        <View className="space-y-6">
          <TeamMember name="Gihen H.S" id="IT24103788" role="Order Management" />
          <TeamMember name="Bandara P.M.A.N" id="IT24104140" role="Billing & Payments" />
          <TeamMember name="Kasfbi A.J" id="IT24102666" role="Menu & Inventory" />
          <TeamMember name="Peiris H.M.D" id="IT24100953" role="Table & Reservations" />
        </View>
        
        <View className="pt-8 border-t border-white/10 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">System Version</Text>
            <Text className="text-xs font-bold text-amber-500">v2.4.0 Static Build</Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Last Updated</Text>
            <Text className="text-xs font-bold text-stone-400">April 2026</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
