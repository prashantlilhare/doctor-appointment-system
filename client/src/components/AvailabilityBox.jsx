import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/index.js';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const getDefaultSchedule = () =>
  DAYS.reduce((acc, day) => ({ ...acc, [day]: { enabled: true, from: '06:00', to: '22:00' } }), {});

const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  let hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

export default function AvailabilityBox() {
  const [schedule, setSchedule] = useState(getDefaultSchedule);
  const [open, setOpen] = useState(false);

  const fetchSchedule = async () => {
    try {
      const data = await api.getSchedule();
      const obj = { ...getDefaultSchedule() };
      data.forEach((item) => {
        obj[item.day] = { enabled: item.isAvailable, from: item.startTime, to: item.endTime };
      });
      setSchedule(obj);
    } catch (err) {
      console.error("Schedule fetch error:", err);
      setSchedule(getDefaultSchedule());
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const today = DAYS[new Date().getDay()];
  const todayData = schedule[today];

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden transition-all hover:shadow-md">
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Working Hours</p>
          {todayData?.enabled ? (
            <p className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {formatTime(todayData.from)} – {formatTime(todayData.to)}
            </p>
          ) : (
            <p className="text-lg font-extrabold text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Closed Today
            </p>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="text-sm text-[#0062FF] font-bold bg-[#EBF3FF] px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
          {open ? 'Hide' : 'Full Schedule'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-2 overflow-hidden">
            {DAYS.map(day => (
              <div key={day} className={`flex justify-between items-center text-sm rounded-xl px-4 py-3 border ${day === today ? 'bg-[#F8FAFC] border-blue-100' : 'bg-white border-gray-50'}`}>
                <span className={`font-bold ${day === today ? 'text-[#0062FF]' : 'text-gray-600'}`}>{day}</span>
                {schedule[day]?.enabled ? (
                  <span className="font-semibold text-gray-800">
                    {formatTime(schedule[day]?.from)} – {formatTime(schedule[day]?.to)}
                  </span>
                ) : (
                  <span className="text-red-500 font-bold">Closed</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}