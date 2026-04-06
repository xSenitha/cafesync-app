import { motion } from 'motion/react';
import { Box, AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface InventoryManagementProps {
  menuItems: any[];
  token: string | null;
  onUpdate: () => void;
}

export function InventoryManagement({ menuItems, token, onUpdate }: InventoryManagementProps) {
  const lowStockItems = menuItems.filter(item => item.stockQuantity <= (item.lowStockThreshold || 10));

  const updateField = async (itemId: string, field: string, value: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error(`Update ${field} error:`, err);
    }
  };

  return (
    <div className="space-y-8">
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-amber-900 font-black">Low Stock Alert</h3>
            <p className="text-amber-700 text-sm font-medium">
              {lowStockItems.length} items are currently below their threshold. Please restock soon.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <motion.div
            layout
            key={item._id}
            className="bg-white rounded-[2.5rem] border border-stone-100 p-6 shadow-sm flex flex-col hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                  <Box size={24} />
                </div>
                <div>
                  <h3 className="font-black text-stone-800">{item.name}</h3>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.category}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                item.stockQuantity <= (item.lowStockThreshold || 10) ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {item.stockQuantity} in stock
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl">
              <button 
                onClick={() => updateField(item._id, 'stockQuantity', Math.max(0, item.stockQuantity - 1))}
                className="p-2 bg-white border border-stone-100 rounded-xl text-stone-600 hover:bg-stone-50 transition-all shadow-sm active:scale-90"
              >
                <Minus size={18} />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quantity</p>
                <p className="text-xl font-black text-stone-800">{item.stockQuantity}</p>
              </div>
              <button 
                onClick={() => updateField(item._id, 'stockQuantity', item.stockQuantity + 1)}
                className="p-2 bg-white border border-stone-100 rounded-xl text-stone-600 hover:bg-stone-50 transition-all shadow-sm active:scale-90"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Low Stock Threshold</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-stone-600">{item.lowStockThreshold || 10}</p>
                  <button 
                    onClick={() => {
                      const newThreshold = prompt('Enter new low stock threshold:', (item.lowStockThreshold || 10).toString());
                      if (newThreshold && !isNaN(parseInt(newThreshold))) {
                        updateField(item._id, 'lowStockThreshold', parseInt(newThreshold));
                      }
                    }}
                    className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-amber-600 transition-all"
                    title="Change Threshold"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  const amount = prompt('Enter amount to add to stock:', '50');
                  if (amount && !isNaN(parseInt(amount))) {
                    updateField(item._id, 'stockQuantity', item.stockQuantity + parseInt(amount));
                  }
                }}
                className="bg-stone-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-stone-900/10"
              >
                Restock
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
