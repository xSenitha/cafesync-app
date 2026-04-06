import { motion } from 'motion/react';
import { Coffee, Trash2, Edit3 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface MenuManagementProps {
  menuItems: any[];
  token: string | null;
  onUpdateMenu: () => void;
  onEditItem: (item: any) => void;
}

export function MenuManagement({ menuItems, token, onUpdateMenu, onEditItem }: MenuManagementProps) {
  const handleDelete = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onUpdateMenu();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {menuItems.map((item: any) => (
        <motion.div 
          layout
          key={item._id} 
          className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
        >
          <div className="relative h-48 mb-4 overflow-hidden rounded-2xl bg-stone-100">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <Coffee size={48} strokeWidth={1.5} />
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-stone-800 shadow-sm">
              {item.category}
            </div>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-stone-800">{item.name}</h3>
            <p className="text-lg font-black text-amber-700">Rs. {item.price}</p>
          </div>
          <p className="text-xs text-stone-400 font-medium line-clamp-2 mb-4 h-8">{item.description}</p>
          <div className="flex items-center justify-between pt-4 border-t border-stone-50">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${item.stockQuantity > (item.lowStockThreshold || 10) ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{item.stockQuantity} in stock</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onEditItem(item)}
                className="text-stone-400 hover:text-amber-700 transition-colors"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(item._id)}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
