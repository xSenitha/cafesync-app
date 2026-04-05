import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="text-xl font-black text-stone-800">Add New Menu Item</h3>
              <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Item Name</label>
                  <input type="text" placeholder="e.g. Cappuccino" className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Price (Rs.)</label>
                  <input type="number" placeholder="0.00" className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Category</label>
                <select className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium appearance-none">
                  <option>Coffee</option>
                  <option>Tea</option>
                  <option>Bakery</option>
                  <option>Dessert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Description</label>
                <textarea rows={3} placeholder="Describe the item..." className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium resize-none"></textarea>
              </div>
              <button className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-900/10 active:scale-95">
                Save Menu Item
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
