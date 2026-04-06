import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => Promise<void>;
  initialData?: any;
}

export function AddItemModal({ isOpen, onClose, onSave, initialData }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Beverage');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price?.toString() || '');
      setCategory(initialData.category || 'Beverage');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setStockQuantity(initialData.stockQuantity?.toString() || '50');
    } else {
      setName('');
      setPrice('');
      setCategory('Beverage');
      setDescription('');
      setImageUrl('');
      setStockQuantity('50');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;

    setLoading(true);
    try {
      await onSave({
        ...initialData,
        name,
        price: parseFloat(price),
        category,
        description,
        imageUrl,
        stockQuantity: parseInt(stockQuantity),
        available: true
      });
      onClose();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

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
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="text-xl font-black text-stone-800">Add New Menu Item</h3>
              <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Item Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cappuccino" 
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Price (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium appearance-none"
                  >
                    <option value="Beverage">Beverage</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Initial Stock</label>
                  <input 
                    type="number" 
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="50" 
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Image URL</label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium pr-12" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300">
                    <ImageIcon size={20} />
                  </div>
                </div>
                {imageUrl && (
                  <div className="mt-2 relative h-32 rounded-2xl overflow-hidden border border-stone-100 bg-stone-50">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the item..." 
                  className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-900/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Menu Item'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
