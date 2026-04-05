import { motion } from 'motion/react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

export function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all group ${
        active 
          ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10' 
          : 'text-stone-500 hover:bg-stone-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-amber-500' : 'group-hover:text-stone-900'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-amber-500 text-stone-900' : 'bg-amber-100 text-amber-700'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex items-center gap-5">
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-stone-200`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-stone-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

interface TeamMemberProps {
  name: string;
  id: string;
  role: string;
}

export function TeamMember({ name, id, role }: TeamMemberProps) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xs font-black border border-white/10 group-hover:bg-amber-500 group-hover:text-stone-900 transition-all">
          {name.split(' ')[0][0]}
        </div>
        <div>
          <p className="text-sm font-bold group-hover:text-amber-500 transition-colors">{name}</p>
          <p className="text-[10px] text-white/40 font-medium">{id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">{role}</p>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

export function QuickAction({ icon, label, onClick, color }: QuickActionProps) {
  return (
    <button 
      onClick={onClick}
      className={`${color} p-6 rounded-[2rem] text-white flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg active:scale-95 group`}
    >
      <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
