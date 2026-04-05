import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Send, X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface FeedbackFormProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function FeedbackForm({ orderId, onClose, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, rating, comment })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Star size={32} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-black text-stone-800">Rate Your Experience</h3>
          <p className="text-stone-400 text-sm font-medium mt-1">How was your meal at CafeSync?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-2 transition-all ${star <= rating ? 'text-amber-500 scale-110' : 'text-stone-200'}`}
              >
                <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={2.5} />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Your Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or how we can improve..."
              className="w-full bg-stone-50 border border-stone-100 rounded-3xl p-6 text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[120px] resize-none"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Submit Feedback'}
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
