import { motion } from 'motion/react';
import { Coffee, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  success: string | null;
  handleLogin: () => void;
  handleRegister: () => void;
}

export function Auth({ 
  name, setName, email, setEmail, password, setPassword, 
  loading, error, success, handleLogin, handleRegister 
}: AuthProps) {
  return (
    <div className="max-w-md mx-auto mt-12 sm:mt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-100"
      >
        <div className="text-center mb-10">
          <div className="inline-flex bg-amber-50 p-4 rounded-3xl text-amber-700 mb-4">
            <Coffee size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-800">Welcome Back</h2>
          <p className="text-stone-400 text-sm mt-2">Manage your cafe with precision and ease.</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-center gap-3"
          >
            <CheckCircle size={18} />
            {success}
          </motion.div>
        )}

        <div className="space-y-5">
          <div className="group">
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-2xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-700/5 focus:border-amber-700 transition-all placeholder:text-stone-300 font-medium"
            />
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-stone-900/10 active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : <><LogIn size={18} strokeWidth={2.5} /> Sign In</>}
            </button>
            <button 
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-white text-stone-900 border-2 border-stone-100 font-bold py-4 rounded-2xl hover:bg-stone-50 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Creating Account...' : 'Create New Account'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
