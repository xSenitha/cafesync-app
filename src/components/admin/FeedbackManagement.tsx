import { motion } from 'motion/react';
import { Star, MessageSquare, Calendar, User } from 'lucide-react';

interface FeedbackManagementProps {
  feedback: any[];
}

export function FeedbackManagement({ feedback }: FeedbackManagementProps) {
  const averageRating = feedback.length > 0 
    ? (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-stone-800">Customer Feedback</h2>
          <p className="text-stone-400 text-sm font-medium mt-1">Monitor customer satisfaction and reviews.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Average Rating</p>
            <p className="text-2xl font-black text-stone-800">{averageRating} / 5.0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {feedback.map((f) => (
          <motion.div
            layout
            key={f._id}
            className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-black text-stone-800">{f.customerName || 'Anonymous'}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={i < f.rating ? '#d97706' : 'none'} 
                        className={i < f.rating ? 'text-amber-600' : 'text-stone-200'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={12} />
                {new Date(f.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-stone-50 p-6 rounded-3xl flex-1">
              <div className="flex gap-3">
                <MessageSquare size={18} className="text-stone-300 flex-shrink-0 mt-1" />
                <p className="text-sm font-bold text-stone-600 leading-relaxed italic">
                  "{f.comment || 'No comment provided.'}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {feedback.length === 0 && (
          <div className="col-span-full bg-white p-20 rounded-[3rem] border border-stone-100 text-center">
            <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-black text-stone-800">No feedback yet</h3>
            <p className="text-stone-400 font-medium">Customer reviews will appear here once they start coming in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
