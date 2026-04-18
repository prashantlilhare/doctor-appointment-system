import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { api } from '../api/index.js';

export default function Track() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const res = await api.trackAppointments(phone);

const data =
  res?.appointments ||
  res?.data ||
  res ||
  [];

setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    }
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* 🔥 HERO STYLE HEADER */}
      <div className="relative m-4 md:m-6 rounded-3xl overflow-hidden">

        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-500 to-teal-700"></div>

        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center text-white">

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
              📍
            </div>

            <h1 className="font-display text-3xl md:text-4xl mb-2">
              Track Your Appointment
            </h1>

            <p className="text-white/80 text-sm">
              Enter your phone number to check your queue & status.
            </p>
          </motion.div>

        </div>
      </div>

      {/* 🔥 SEARCH BOX */}
      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10">

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleTrack}
          className="flex gap-3 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-3"
        >
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
          >
            {loading ? <><span className="spinner" /> Searching...</> : 'Search'}
          </button>
        </motion.form>
      </div>

      {/* 🔥 RESULTS */}
      <div className="max-w-3xl mx-auto px-4 py-16">

        <AnimatePresence>
          {searched && appointments !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >

              {appointments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-gray-700 font-medium mb-1">No appointments found</p>
                  <p className="text-gray-400 text-sm">Try another phone number.</p>
                </div>
              ) : (

                <div className="flex flex-col gap-5">

                  <p className="text-xs text-gray-400 font-medium">
                    {appointments.length} appointment(s) found
                  </p>

                  {appointments.map((appt, i) => (
                    <motion.div
                      key={appt._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`rounded-3xl p-6 shadow-lg border backdrop-blur-xl 
                      ${appt.condition === 'Urgent'
                          ? 'bg-red-50/60 border-red-200'
                          : 'bg-white/70 border-white/40'
                        }`}
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{appt.name}</h3>
                          <p className="text-gray-400 text-xs">{appt.phone}</p>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-end">
                          {appt.condition === 'Urgent' && (
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                              🔴 Urgent
                            </span>
                          )}
                          <StatusBadge status={appt.status} />
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-2 gap-4 text-sm">

                        <div className="bg-white/60 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Appointment Date</p>
                          <p className="text-gray-700 font-medium text-xs">
                            {new Date(appt.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="bg-white/60 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Booked On</p>
                          <p className="text-gray-700 font-medium text-xs">
                            {new Date(appt.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="col-span-2 bg-white/60 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Symptoms</p>
                          <p className="text-gray-700 text-sm">{appt.symptoms}</p>
                        </div>

                        <div className="col-span-2 bg-white/60 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Address</p>
                          <p className="text-gray-700 text-sm">{appt.address}</p>
                        </div>

                      </div>
                    </motion.div>
                  ))}

                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}