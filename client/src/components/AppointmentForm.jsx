import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/index.js";

const today = new Date().toISOString().split("T")[0];

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    symptoms: "",
    date: "",
    condition: "Normal",
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
          condition: "Normal",
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

  // 🔥 CLEAN INPUT STYLE
  const inputClass =
    "w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm " +
    "focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent " +
    "transition-all placeholder:text-gray-400" +
    "focus:ring-2 focus:ring-cyan-400 focus:bg-white";

  const labelClass = "text-sm font-medium text-gray-600 mb-1 block";

  return (
    <div className="bg-white rounded-3xl  border border-gray-100 overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
      {/* 🔥 GLOW FIXED */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-100 blur-3xl opacity-30 pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </div>

            <h3 className="font-display text-2xl text-gray-800 mb-2">
              Appointment Booked 🎉
            </h3>

            <p className="text-gray-500 text-sm mb-8">
              Your slot is confirmed. Track anytime.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setSuccess(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full transition"
              >
                Book Again
              </button>

              <a
                href="/track"
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-full hover:border-teal-400 hover:text-teal-600 transition"
              >
                Track →
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* 🔥 HEADER */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
              <h2 className="font-display text-2xl text-gray-800 mb-1">
                Book Appointment
              </h2>
              <p className="text-gray-500 text-sm">Quick & simple booking</p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mx-6 mt-5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            {/* FORM */}
           <form
  onSubmit={handleSubmit}
  className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 
  bg-gradient-to-br from-[#ECFEFF]/70 via-white/40 to-[#F0FDFA]/60 
  backdrop-blur-2xl border border-white/40 
  rounded-3xl shadow-2xl relative overflow-hidden"
>

  {/* subtle glow background */}
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full pointer-events-none" />
  <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-200/20 blur-3xl rounded-full pointer-events-none" />

  {/* NAME */}
  <div>
    <label className={labelClass}>Full Name</label>
    <input
      value={form.name}
      onChange={(e) => set("name", e.target.value)}
      required
      placeholder="👤 Enter full name"
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-xl
        border-0 outline-none
        shadow-md shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        text-gray-700 placeholder-gray-400
      "
    />
  </div>

  {/* PHONE (10 DIGIT FIX) */}
  <div>
    <label className={labelClass}>Phone</label>
    <input
      value={form.phone}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
        set("phone", val);
      }}
      required
      placeholder="📞 10 digit mobile number"
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-xl
        border-0 outline-none
        shadow-md shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        text-gray-700 placeholder-gray-400
      "
    />
  </div>

  {/* SYMPTOMS */}
  <div className="md:col-span-2">
    <label className={labelClass}>Symptoms</label>
    <textarea
      value={form.symptoms}
      onChange={(e) => set("symptoms", e.target.value)}
      required
      rows={3}
      placeholder="🤒 Fever, headache, cold..."
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-2xl
        border-0 outline-none
        shadow-lg shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        resize-none
        text-gray-700 placeholder-gray-400
      "
    />
  </div>

  {/* DATE */}
  <div>
    <label className={labelClass}>Date</label>
    <input
      type="date"
      value={form.date}
      min={today}
      onChange={(e) => set("date", e.target.value)}
      required
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-xl
        border-0 outline-none
        shadow-md shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        cursor-pointer
        text-gray-700
      "
    />
  </div>

  {/* CONDITION */}
  <div>
    <label className={labelClass}>Condition</label>
    <select
      value={form.condition}
      onChange={(e) => set("condition", e.target.value)}
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-xl
        border-0 outline-none
        shadow-md shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        cursor-pointer
        text-gray-700
      "
    >
      <option value="Normal">🟢 Normal</option>
      <option value="Urgent">🔴 Urgent</option>
    </select>
  </div>

  {/* ADDRESS */}
  <div className="md:col-span-2">
    <label className={labelClass}>Address</label>
    <input
      value={form.address}
      onChange={(e) => set("address", e.target.value)}
      required
      placeholder="🏠 Village, City, Street..."
      className="
        w-full px-4 py-3 rounded-2xl
        bg-gray-100/40 backdrop-blur-xl
        border-0 outline-none
        shadow-md shadow-black/10
        focus:ring-2 focus:ring-cyan-300
        text-gray-700 placeholder-gray-400
      "
    />
  </div>

  {/* BUTTON */}
  <div className="md:col-span-2">
    <button
      type="submit"
      disabled={loading}
      className="
        w-full py-4 rounded-2xl font-semibold
        bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500
        text-white shadow-lg
        hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200
        flex items-center justify-center gap-2
      "
    >
      {loading ? "Booking..." : "📅 Book Appointment"}
    </button>
  </div>

</form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
