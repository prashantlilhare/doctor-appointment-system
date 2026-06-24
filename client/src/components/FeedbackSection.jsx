import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/index.js';

export default function FeedbackSection() {
  const [form, setForm] = useState({ name: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [fbLoading, setFbLoading] = useState(true);

  const scrollRef = useRef();

  useEffect(() => {
    setFbLoading(true);
    api.getAllFeedback()
      .then(data => {
        setTestimonials(Array.isArray(data) ? data : []);
        setFbLoading(false);
      })
      .catch(() => setFbLoading(false));
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
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -width : width,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative py-24 overflow-hidden">

      {/* 🔥 ICE LATTE BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5f2] via-[#f1ece6] to-[#e9e2dc]" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-200/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3">
            Patient Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-gray-900 mb-4">
            Trusted by the Community
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Don't just take our word for it. Read authentic experiences from patients who have found relief and reliable care with us.
          </p>
        </div>

        {/* SCROLL BUTTONS */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-white/40 shadow hover:scale-105 transition"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur border border-white/40 shadow hover:scale-105 transition"
          >
            →
          </button>
        </div>

        {/* TESTIMONIALS */}
        {fbLoading ? (
          <div className="flex justify-center py-10">
            <div className="spinner" />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-400">No feedback yet</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 "
            style={{ scrollbarWidth: "none" }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="min-w-[280px] md:min-w-[340px] bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-3 shadow-lg hover:shadow-xl transition"
              >

                {/* STARS */}
                <div className="flex mb-1">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className={`${idx < t.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>

                {/* TEXT */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed whitespace-pre-line break-words overflow-y-auto h-[90px] ">
                  "{t.message}"
                </p>

                {/* USER */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {t.name}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        )}

        {/* FORM */}
        <div className="mt-20 max-w-lg mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-[28px] p-8 shadow-xl">

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Share Your Experience
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your feedback helps us improve
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ✅
                </div>
                <p className="font-semibold text-gray-800 mb-1">Thank you!</p>
                <p className="text-gray-500 text-sm mb-4">Pending approval</p>
                <button onClick={() => setSubmitted(false)} className="text-teal-600 text-sm">
                  Submit again →
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4">

                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  className="px-4 py-3 rounded-xl bg-white/70 backdrop-blur border border-white/40 focus:ring-2 focus:ring-teal-400 outline-none"
                />

                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Your experience..."
                  required
                  rows={3}
                  className="px-4 py-3 rounded-xl bg-white/70 backdrop-blur border border-white/40 focus:ring-2 focus:ring-teal-400 outline-none resize-none"
                />

                {/* RATING */}
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: r }))}
                      className={`text-2xl transition ${r <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2
                    bg-gradient-to-r from-teal-600 to-cyan-500 shadow-lg transition duration-200
                    ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-xl"}
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>

              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}