import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/index.js";
import { Link } from "react-router-dom";

const today = new Date().toISOString().split("T")[0];

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    symptoms: "",
    date: "",
    visitType: "Clinic Visit",
    address: "",
    location: { lat: "", lng: "" },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          location: {
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
          },
        }));
        setLocLoading(false);
      },
      () => setLocLoading(false),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.createAppointment(form);
      setLoading(false);
      if (res.appointment) {
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          symptoms: "",
          date: "",
          visitType: "Clinic Visit",
          address: "",
          location: { lat: "", lng: "" },
        });
      } else {
        setError(res.message || "Something went wrong.");
      }
    } catch {
      setLoading(false);
      setError("Network error.");
    }
  };

  const inputClass =
    "w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-2.5 md:py-3.5 text-sm font-medium " +
    "focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent " +
    "transition-all placeholder:text-gray-400 outline-none text-gray-900";

  const labelClass = "text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block pl-1";

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#EBF3FF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#0062FF]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              </svg>
            </div>
            <h3 className="font-extrabold text-2xl text-gray-900 mb-2">Appointment Booked 🎉</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Your slot is confirmed. Track anytime.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => setSuccess(false)} className="bg-[#0062FF] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors shadow-md">
                Book Again
              </button>
              <Link to="/track" className="bg-white border-2 border-gray-200 text-gray-700 font-bold px-8 py-3.5 rounded-full hover:border-[#0062FF] hover:text-[#0062FF] transition-colors">
                Track Status
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 md:p-8 pb-3 md:pb-4 border-b border-gray-100">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 mb-1">Book Appointment</h2>
              <p className="text-gray-500 font-medium text-xs md:text-sm">Fill in your details below</p>
            </div>

            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-100 rounded-[16px] text-sm text-red-600 font-medium flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 bg-white relative">
              
              <div>
                <label className={labelClass}>Full Name</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="John Doe" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input value={form.phone} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); set("phone", val); }} required placeholder="10 digit mobile number" className={inputClass} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Symptoms</label>
                <textarea value={form.symptoms} onChange={(e) => set("symptoms", e.target.value)} required rows={1} placeholder="Fever, headache, cold..." className={`${inputClass} resize-none`} />
              </div>

              <div>
                <label className={labelClass}>Date</label>
                <input type="date" value={form.date} min={today} onChange={(e) => set("date", e.target.value)} required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Visit Type</label>
                <select value={form.visitType} onChange={(e) => set("visitType", e.target.value)} className={inputClass}>
                  <option value="Clinic Visit">🏥 Clinic Visit</option>
                  <option value="Home Visit">🏠 Home Visit</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)} required placeholder="Village, City, Street..." className={inputClass} />
              </div>

              <div className="md:col-span-2 mt-2 md:mt-4">
                <button type="submit" disabled={loading} className={`w-full py-3 md:py-4 rounded-full font-bold text-white shadow-lg shadow-blue-600/20 bg-[#0062FF] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"}`}>
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Booking...</>
                  ) : ("Make Appointment")}
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
