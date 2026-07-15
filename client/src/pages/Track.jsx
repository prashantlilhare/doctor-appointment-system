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
      const data = res?.appointments || res?.data || res || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    }
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 🔥 HERO STYLE HEADER */}
      <div className="relative pt-20 pb-24 bg-white border-b border-gray-100">
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 bg-[#EBF3FF] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
              📍
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Track Your Appointment
            </h1>
            <p className="text-gray-500 font-medium">
              Enter your phone number to check your queue & status.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🔥 SEARCH BOX */}
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleTrack}
          className="flex flex-col sm:flex-row gap-3 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[24px] p-3"
        >
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="Enter your phone number..."
            className="flex-1 bg-[#F8FAFC] border border-gray-100 rounded-[16px] px-5 py-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#0062FF] font-medium text-gray-900 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0062FF] hover:bg-blue-700 text-white px-8 py-4 rounded-[16px] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md sm:w-auto w-full"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </motion.form>
      </div>

      {/* 🔥 RESULTS */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <AnimatePresence>
          {searched && appointments !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {appointments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[32px] shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
                  <p className="text-gray-900 font-extrabold text-xl mb-2">No appointments found</p>
                  <p className="text-gray-500 font-medium text-sm">Try checking another phone number.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {appointments.length} appointment(s) found
                  </p>
                  {appointments.map((appt, i) => (
                    <motion.div
                      key={appt._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-[24px] p-6 shadow-sm border ${appt.visitType === 'Home Visit' ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}
                    >
                      {/* TOP */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-xl">{appt.name}</h3>
                          <p className="text-gray-500 font-medium text-sm mt-1">{appt.phone}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:justify-end">
                          {appt.visitType === 'Home Visit' && (
                            <span className="bg-blue-100 text-[#0062FF] text-xs font-bold px-3 py-1.5 rounded-full">
                              🏠 Home Visit
                            </span>
                          )}
                          <StatusBadge status={appt.status} />
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#F8FAFC] border border-gray-100 rounded-[16px] p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Appointment Date</p>
                          <p className="text-gray-900 font-bold">
                            {new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="bg-[#F8FAFC] border border-gray-100 rounded-[16px] p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Booked On</p>
                          <p className="text-gray-900 font-bold">
                            {new Date(appt.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="sm:col-span-2 bg-[#F8FAFC] border border-gray-100 rounded-[16px] p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Symptoms</p>
                          <p className="text-gray-700 font-medium">{appt.symptoms}</p>
                        </div>
                        <div className="sm:col-span-2 bg-[#F8FAFC] border border-gray-100 rounded-[16px] p-4">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Address</p>
                          <p className="text-gray-700 font-medium">{appt.address}</p>
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