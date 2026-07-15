import React, { useState, useEffect } from "react";
import { api } from "../api/index.js";

export default function TestimonialsSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const fetchFeedback = async () => {
    try {
      const data = await api.getFeedback();
      const approved = data.filter((d) => d.status === "Approved");
      setFeedbacks(approved);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await api.submitFeedback(form);
      setSubmitting(false);
      if (res.feedback) {
        setMsg({ type: "success", text: "Thank you! Your feedback is under review." });
        setForm({ name: "", email: "", rating: 5, comment: "" });
      } else {
        setMsg({ type: "error", text: res.message || "Failed to submit" });
      }
    } catch {
      setSubmitting(false);
      setMsg({ type: "error", text: "Network error." });
    }
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "AN";
  };

  return (
    <section id="testimonials" className="py-12 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-3">Patient Testimonials</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Hear From Our Patients
          </h2>
          <p className="text-gray-500 text-lg">
            Real experiences from people who trusted us with their health.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-blue-200 border-t-[#0062FF] rounded-full animate-spin"></div></div>
        ) : feedbacks.length === 0 ? (
           <div className="text-center py-10 text-gray-500">No reviews yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {feedbacks.slice(0, 6).map((fb) => (
              <div key={fb._id} className="bg-[#F8FAFC] p-8 rounded-[32px] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow">
                <div className="flex text-yellow-400 text-lg mb-4">
                  {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">"{fb.comment}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center font-bold shadow-sm">
                    {getInitials(fb.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{fb.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Review Form */}
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-gray-100">
           <div className="text-center mb-8">
             <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
             <p className="text-gray-500 mt-2">Your feedback helps us improve our care.</p>
           </div>
           
           {msg.text && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-bold text-center ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg.text}
            </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="grid md:grid-cols-2 gap-5">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Name</label>
                 <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none transition-all" placeholder="John Doe"/>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Email</label>
                 <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none transition-all" placeholder="john@example.com"/>
               </div>
             </div>
             
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Rating</label>
               <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none transition-all">
                 <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                 <option value="4">⭐⭐⭐⭐ (4/5)</option>
                 <option value="3">⭐⭐⭐ (3/5)</option>
                 <option value="2">⭐⭐ (2/5)</option>
                 <option value="1">⭐ (1/5)</option>
               </select>
             </div>

             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Review</label>
               <textarea required rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none transition-all resize-none" placeholder="How was your visit?"></textarea>
             </div>

             <button type="submit" disabled={submitting} className={`w-full py-4 rounded-full font-bold text-white bg-gray-900 hover:bg-black transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
               {submitting ? 'Submitting...' : 'Submit Review'}
             </button>
           </form>
        </div>

      </div>
    </section>
  );
}
