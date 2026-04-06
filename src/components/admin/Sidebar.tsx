import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, ShoppingCart, Coffee, Calendar, CreditCard, Users, MessageSquare, LogOut, Info, Box } from 'lucide-react';
import { NavItem } from '../ui/DashboardUI';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orders: any[];
  reservations: any[];
  user: any;
  onSignOut: () => void;
  viewMode?: 'admin' | 'customer';
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, orders, reservations, user, onSignOut, viewMode }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -300,
          opacity: isSidebarOpen ? 1 : 0,
          width: isSidebarOpen ? '256px' : '0px'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed lg:relative lg:translate-x-0 lg:opacity-100 lg:w-64 z-50 lg:z-0 bg-white lg:bg-transparent h-[calc(100vh-80px)] lg:h-auto top-20 lg:top-0 left-0 p-6 lg:p-0 border-r lg:border-r-0 border-stone-100 overflow-hidden flex-shrink-0`}
      >
        <nav className="space-y-1.5 sticky top-24">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <div className="pt-6 pb-2 px-4">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Operations</p>
          </div>
          <NavItem icon={<ShoppingCart size={20} />} label="Orders" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} badge={orders.filter(o => o.status === 'Pending').length} />
          {viewMode !== 'customer' && (
            <NavItem icon={<Coffee size={20} />} label="Menu" active={activeTab === 'menu'} onClick={() => { setActiveTab('menu'); setIsSidebarOpen(false); }} />
          )}
          {user?.role === 'admin' && (
            <NavItem icon={<Box size={20} />} label="Inventory" active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} />
          )}
          <NavItem icon={<Calendar size={20} />} label="Reservations" active={activeTab === 'reservations'} onClick={() => { setActiveTab('reservations'); setIsSidebarOpen(false); }} badge={reservations.filter(r => r.status === 'Pending').length} />
          <NavItem icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} />
          
          <div className="pt-6 pb-2 px-4">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Management</p>
          </div>
          <NavItem icon={<Users size={20} />} label="Staff" active={activeTab === 'staff'} onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }} />
          <NavItem icon={<MessageSquare size={20} />} label="Feedback" active={activeTab === 'feedback'} onClick={() => { setActiveTab('feedback'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Info size={20} />} label="About" active={activeTab === 'about'} onClick={() => { setActiveTab('about'); setIsSidebarOpen(false); }} />
          
          <div className="pt-10">
            <button 
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </nav>
      </motion.aside>
    </>
  );
}
