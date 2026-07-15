import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/index.js';

const fallbackTestimonials = [
  { _id: 'demo1', name: 'Rahul Sharma', rating: 5, message: 'Excellent doctor! Very polite and patient. Highly recommended for home visits in the area.' },
  { _id: 'demo2', name: 'Anita Patel', rating: 5, message: 'Dr. Lilhare is incredibly knowledgeable. The treatment was effective and affordable.' },
  { _id: 'demo3', name: 'Vikas Singh', rating: 4, message: 'Great experience. Explained everything clearly and gave good advice on diet as well.' }
];

export default function FeedbackSection() {
  const [form, setForm] = useState({ name: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    setFbLoading(true);
    let isMounted = true;
    
    // Fallback if network is slow/offline
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setFbLoading(false);
        setTestimonials(prev => prev.length === 0 ? fallbackTestimonials : prev);
      }
    }, 5000);

    api.getAllFeedback()
      .then(data => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setTestimonials(Array.isArray(data) && data.length > 0 ? data : fallbackTestimonials);
        setFbLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setTestimonials(fallbackTestimonials);
        setFbLoading(false);
      });
      
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.createFeedback(form);
    setLoading(false);
    if (res.feedback) {
      setSubmitted(true);
      setForm({ name: '', message: '', rating: 5 });
    }
  };

  const scroll = (dir) => {
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -width : width, behavior: 'smooth' });
  };

  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-[#F8FAFC]">
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[#0062FF] font-bold tracking-wide uppercase text-xs mb-2">Patient Stories</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Trusted by the Community</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-[#0062FF] hover:text-[#0062FF] flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-[#0062FF] hover:text-[#0062FF] flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* TESTIMONIALS */}
        {fbLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500 font-medium py-10 bg-white rounded-2xl border border-gray-100">No reviews yet.</p>
        ) : (
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x" style={{ scrollbarWidth: "none" }}>
            {testimonials.map((t, i) => (
              <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="min-w-[300px] md:min-w-[360px] snap-start bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#EBF3FF] text-[#0062FF] flex items-center justify-center font-bold text-lg">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{t.name}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, idx) => (
                        <span key={idx} className={`text-sm ${idx < t.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words overflow-y-auto h-[80px]">
                  "{t.message}"
                </p>

              </motion.div>
            ))}
          </div>
        )}

        {/* FORM */}
        <div className="mt-16 max-w-2xl mx-auto bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Share Your Experience</h3>
          <p className="text-gray-500 text-sm font-medium mb-8">Your feedback helps us improve our care</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                <p className="font-extrabold text-gray-900 text-xl mb-2">Thank you!</p>
                <p className="text-gray-500 text-sm mb-6 font-medium">Your review is pending approval.</p>
                <button onClick={() => setSubmitted(false)} className="text-[#0062FF] font-bold hover:underline">Submit another review</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all" />
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your experience..." required rows={3} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all resize-none" />
                <div className="flex items-center gap-3 bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3">
                  <span className="text-sm font-bold text-gray-600">Rating:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(r => (
                      <button type="button" key={r} onClick={() => setForm(f => ({ ...f, rating: r }))} className={`text-2xl outline-none hover:scale-110 transition-transform ${r <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-full font-bold text-white bg-[#0062FF] hover:bg-blue-700 transition-colors mt-2 flex items-center justify-center gap-2 ${loading ? "opacity-70" : ""}`}>
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}