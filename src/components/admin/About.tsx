import { Users, Info, Award, ShieldCheck } from 'lucide-react';
import { TeamMember } from '../ui/DashboardUI';

export function About() {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center text-amber-700 mb-8">
            <Info size={32} />
          </div>
          <h2 className="text-4xl font-black text-stone-800 mb-6">About CafeSync</h2>
          <p className="text-stone-500 text-lg leading-relaxed font-medium">
            CafeSync is a comprehensive management suite designed specifically for modern cafes and restaurants. 
            Our mission is to bridge the gap between back-of-house operations and front-of-house customer experiences through 
            seamless digital integration. From real-time order tracking to inventory precision, CafeSync empowers your team 
            to focus on what matters most: delivering exceptional culinary moments.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
            <div className="flex gap-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="text-amber-600"><Award size={24} /></div>
              <div>
                <h4 className="font-black text-stone-800 text-sm uppercase tracking-wider">Our Vision</h4>
                <p className="text-xs text-stone-400 mt-1 font-medium">To become the global standard for boutique cafe management systems.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="text-amber-600"><ShieldCheck size={24} /></div>
              <div>
                <h4 className="font-black text-stone-800 text-sm uppercase tracking-wider">Our Values</h4>
                <p className="text-xs text-stone-400 mt-1 font-medium">Precision, reliability, and human-centric design in every line of code.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-50 rounded-full blur-3xl -z-0 opacity-50"></div>
      </div>

      {/* Team Section */}
      <div className="bg-stone-900 p-8 sm:p-12 rounded-[2.5rem] text-white shadow-2xl shadow-stone-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-amber-500/20 p-3 rounded-2xl">
              <Users size={28} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Project Development Team</h3>
              <p className="text-white/40 text-sm font-medium">The minds behind CafeSync's innovation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <TeamMember name="Gihen H.S" id="IT24103788" role="Order Management" />
            <TeamMember name="Bandara P.M.A.N" id="IT24104140" role="Billing & Payments" />
            <TeamMember name="Kasfbi A.J" id="IT24102666" role="Menu & Inventory" />
            <TeamMember name="Peiris H.M.D" id="IT24100953" role="Table & Reservations" />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">System Version</p>
            <p className="text-sm font-bold text-amber-500">v2.4.0 Stable Build</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Last Updated</p>
            <p className="text-sm font-bold text-stone-400">April 2026</p>
          </div>
        </div>
        
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
