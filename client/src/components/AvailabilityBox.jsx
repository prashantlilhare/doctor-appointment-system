import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/index.js';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const getDefaultSchedule = () =>
  DAYS.reduce(
    (acc, day) => ({
      ...acc,
      [day]: { enabled: true, from: '06:00', to: '22:00' },
    }),
    {},
  );

// ✅ 12hr format helper
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
      obj[item.day] = {
        enabled: item.isAvailable,
        from: item.startTime,
        to: item.endTime,
      };
    });

    setSchedule(obj);
  } catch (err) {
    console.error("Schedule fetch error:", err);
    setSchedule(getDefaultSchedule());
  }
};

  useEffect(() => {
  fetchSchedule();

  const interval = setInterval(() => {
    fetchSchedule();
  }, 1500);

  return () => clearInterval(interval);
}, []);

  const today = DAYS[new Date().getDay()];
  const todayData = schedule[today];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">

      {/* 🔥 TOP */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Today's Availability</p>

          {todayData?.enabled ? (
            <p className="text-lg font-semibold text-teal-700">
              {formatTime(todayData.from)} – {formatTime(todayData.to)}
            </p>
          ) : (
            <p className="text-lg font-semibold text-red-500">Closed Today</p>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-teal-600 font-medium"
        >
          {open ? 'Hide ↑' : 'View All ↓'}
        </button>
      </div>

      {/* 🔽 EXPAND */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {DAYS.map(day => (
              <div key={day}
                className="flex justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">

                <span className="text-gray-600">{day}</span>

                {schedule[day]?.enabled ? (
                  <span className="text-teal-600 font-medium">
                    {formatTime(schedule[day]?.from)} – {formatTime(schedule[day]?.to)}
                  </span>
                ) : (
                  <span className="text-red-400">OFF</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}