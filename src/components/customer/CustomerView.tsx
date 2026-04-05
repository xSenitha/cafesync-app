import { motion } from 'motion/react';
import { Coffee, ShoppingCart, Utensils, Plus, Minus, ChevronRight } from 'lucide-react';

interface CustomerViewProps {
  menuItems: any[];
  cart: any[];
  setCart: (cart: any[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTable: number | null;
  setSelectedTable: (table: number | null) => void;
  onPlaceOrder: () => void;
}

export function CustomerView({ 
  menuItems, cart, setCart, selectedCategory, setSelectedCategory, 
  selectedTable, setSelectedTable, onPlaceOrder 
}: CustomerViewProps) {
  const categories = ['All', ...new Set(menuItems.map((item: any) => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter((item: any) => item.category === selectedCategory);

  const addToCart = (item: any) => {
    const existing = cart.find((c: any) => c._id === item._id);
    if (existing) {
      setCart(cart.map((c: any) => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find((c: any) => c._id === itemId);
    if (!existing) return;
    if (existing.quantity > 1) {
      setCart(cart.map((c: any) => c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter((c: any) => c._id !== itemId));
    }
  };

  const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-stone-800">Fresh Menu</h2>
            <p className="text-stone-400 text-sm font-medium mt-1">Select your favorite items and place an order.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100 shadow-sm">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Table</label>
            <select 
              value={selectedTable || ''} 
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select</option>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Table {n}</option>)}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat as string}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/10' 
                  : 'bg-white text-stone-400 hover:bg-stone-50 border border-stone-100'
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item: any) => (
            <motion.div 
              layout
              key={item._id}
              className="bg-white p-5 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-2xl bg-stone-100">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Coffee size={48} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black text-stone-800">{item.name}</h3>
                <p className="text-lg font-black text-amber-700">Rs. {item.price}</p>
              </div>
              <p className="text-xs text-stone-400 font-medium line-clamp-2 mb-6 h-8">{item.description}</p>
              <button 
                onClick={() => addToCart(item)}
                className="w-full bg-stone-50 text-stone-800 font-bold py-3 rounded-2xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                Add to Order
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm sticky top-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
              <ShoppingCart size={20} />
            </div>
            <h3 className="text-xl font-black text-stone-800">Your Order</h3>
          </div>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-stone-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                  <Utensils size={32} />
                </div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Cart is empty</p>
              </div>
            ) : (
              cart.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stone-800">{item.name}</p>
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Rs. {item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                    <button onClick={() => removeFromCart(item._id)} className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-stone-400 hover:text-stone-900">
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-black text-stone-800 w-4 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="p-1 hover:bg-white hover:shadow-sm rounded-lg transition-all text-stone-400 hover:text-stone-900">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-8 pt-8 border-t border-stone-100 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black text-stone-800">Rs. {total}</p>
              </div>
              <button 
                onClick={onPlaceOrder}
                className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-900/10 active:scale-95 flex items-center justify-center gap-2"
              >
                Place Order
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
