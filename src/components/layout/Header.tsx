import { Coffee, Menu, X, Monitor, User } from 'lucide-react';

interface HeaderProps {
  user: any;
  health: any;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  viewMode: 'admin' | 'customer';
  setViewMode: (mode: 'admin' | 'customer') => void;
}

export function Header({ user, health, isSidebarOpen, setIsSidebarOpen, viewMode, setViewMode }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {user && (
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-2.5 rounded-xl text-white shadow-lg shadow-amber-900/20">
          <Coffee size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-stone-800 leading-none">CafeSync</h1>
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Management Suite</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user && (
          <button 
            onClick={() => setViewMode(viewMode === 'admin' ? 'customer' : 'admin')}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-black uppercase tracking-wider text-stone-600 transition-all"
          >
            <Monitor size={14} />
            {viewMode === 'admin' ? 'Customer View' : 'Admin View'}
          </button>
        )}
        {health && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">System Live</span>
            </div>
            <span className={`text-[9px] font-black uppercase ${health.database === 'Connected' ? 'text-emerald-600' : 'text-red-500'}`}>
              DB: {health.database}
            </span>
          </div>
        )}
        {user && (
          <div className="flex items-center gap-3 pl-6 border-l border-stone-100">
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold text-stone-800">{user.name}</p>
              <p className="text-[10px] font-medium text-stone-400 capitalize">{user.role}</p>
            </div>
            <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 border border-stone-200">
              <User size={18} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
