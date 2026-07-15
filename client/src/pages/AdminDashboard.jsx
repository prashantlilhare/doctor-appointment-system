import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";
import { api } from "../api/index.js";
import StatusBadge from "../components/StatusBadge.jsx";

const todayStr = () => new Date().toISOString().split("T")[0];

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

// Confirmation Modal
function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  danger = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-8 border border-gray-100"
      >
        <h3 className="font-extrabold text-xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-8 font-medium">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold py-3.5 rounded-full text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-bold py-3.5 rounded-full text-sm transition-colors text-white shadow-lg ${danger ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-[#0062FF] hover:bg-blue-700 shadow-blue-600/20"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Sidebar nav items
const NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "appointments", icon: "📋", label: "All Appointments" },
  { id: "schedule", icon: "📅", label: "Schedule" },
  { id: "feedback", icon: "⭐", label: "Feedback" },
  { id: "history", icon: "📂", label: "History" },
  { id: "todo", icon: "📝", label: "Todo" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getDefaultSchedule = () =>
  DAYS.reduce(
    (acc, day) => ({
      ...acc,
      [day]: { enabled: true, from: "06:00", to: "22:00" },
    }),
    {}
  );

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filter, setFilter] = useState("Today");
  const [dateFilter, setDateFilter] = useState("");
  const [updating, setUpdating] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState(getDefaultSchedule);

  useEffect(() => {
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
        console.error("schedule fetch error", err);
        setSchedule(getDefaultSchedule());
      }
    };

    fetchSchedule();
  }, []);

  const handleSaveSchedule = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      for (const day of Object.keys(schedule)) {
        const value = schedule[day];

        await api.updateSchedule(day, {
          isAvailable: value.enabled,
          startTime: value.from,
          endTime: value.to,
        });
      }

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  // Todo state 
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("sovind_todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [todoInput, setTodoInput] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, fbs] = await Promise.all([
        api.getAllAppointments(),
        api.getAllFeedbackAdmin(),
      ]);
      setAppointments(
        Array.isArray(appts)
          ? appts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          : []
      );
      setFeedbacks(Array.isArray(fbs) ? fbs : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
      setFeedbacks([]);
    }
    setLoading(false);
  };

  const requestAction = (id, status) => {
    setConfirm({
      id,
      status,
      title:
        status === "Rejected"
          ? "Reject Appointment?"
          : status === "Completed"
            ? "Mark as Completed?"
            : "Accept Appointment?",
      message:
        status === "Rejected"
          ? "This will reject the appointment. The patient will be notified."
          : status === "Completed"
            ? "This will move the appointment to history."
            : "This will confirm the appointment for the patient.",
      danger: status === "Rejected",
      label: status,
    });
  };

  const confirmAction = async () => {
    try {
      const { id, status } = confirm;
      setConfirm(null);
      setUpdating(id + status);

      await api.updateAppointment(id, status);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const approveFb = async (id) => {
    await api.approveFeedback(id);
    await loadData();
  };

  const deleteFb = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await api.deleteFeedback(id);
      await loadData();
    }
  };

  const updateLocalSchedule = (day, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    const newTodos = [
      { id: Date.now(), text: todoInput.trim(), done: false },
      ...todos,
    ];
    setTodos(newTodos);
    localStorage.setItem("sovind_todos", JSON.stringify(newTodos));
    setTodoInput("");
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter((t) => t.id !== id);
    setTodos(newTodos);
    localStorage.setItem("sovind_todos", JSON.stringify(newTodos));
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(newTodos);
    localStorage.setItem("sovind_todos", JSON.stringify(newTodos));
  };

  // Stats
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const accepted = appointments.filter((a) => a.status === "Accepted").length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const todayAppts = appointments.filter((a) => isToday(a.date));
  const history = appointments.filter(
    (a) => a.status === "Completed" || a.status === "Rejected"
  );
  const upcoming = appointments
    .filter(
      (a) =>
        new Date(a.date) >= new Date() &&
        a.status !== "Rejected" &&
        a.status !== "Completed"
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const getFiltered = useCallback(() => {
    let base = appointments.filter(
      (a) => a.status !== "Completed" && a.status !== "Rejected"
    );
    if (filter === "Today") base = base.filter((a) => isToday(a.date));
    else if (filter !== "All") base = base.filter((a) => a.status === filter);
    if (dateFilter)
      base = base.filter((a) => a.date?.split("T")[0] === dateFilter);
    return base;
  }, [appointments, filter, dateFilter]);

  const filtered = getFiltered();
  const pendingFeedbacks = feedbacks.filter((f) => !f.approved).length;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full w-72 z-40 flex flex-col
    bg-white border-r border-gray-100
    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:h-screen`}
        >
          {/* Top Brand */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] shadow-sm bg-[#0062FF] p-2 flex items-center justify-center text-white font-bold text-xl">
                SL
              </div>
              <div className="leading-tight">
                <p className="text-lg font-extrabold text-gray-900">
                  Dr. S. Lilhare
                </p>
                <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto space-y-2">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-sm font-bold transition-all
          ${
            activeTab === item.id
              ? "bg-[#EBF3FF] text-[#0062FF]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>

                {item.id === "feedback" && pendingFeedbacks > 0 && (
                  <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full shadow-sm shadow-red-500/30">
                    {pendingFeedbacks}
                  </span>
                )}

                {item.id === "appointments" && pending > 0 && (
                  <span className="text-[10px] font-bold bg-yellow-400 text-white px-2 py-1 rounded-full shadow-sm shadow-yellow-400/30">
                    {pending}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">👤</span>
              Patient View
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="text-lg">🚪</span>
              Logout
            </button>
          </div>
        </aside>
      </>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-5">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>

              {/* Title Block */}
              <div className="leading-tight">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {NAV.find((n) => n.id === activeTab)?.label}
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#0062FF] hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div
                className="spinner"
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 4,
                  borderTopColor: "#0062FF",
                  borderColor: "#EBF3FF",
                }}
              />
              <p className="mt-6 text-sm font-bold text-gray-500">Loading data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8 pb-10">
                    {/* METRICS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: "Total", value: total, icon: "📊", bg: "bg-gray-50", text: "text-gray-900" },
                        { label: "Pending", value: pending, icon: "⏳", bg: "bg-yellow-50", text: "text-yellow-600" },
                        { label: "Accepted", value: accepted, icon: "✅", bg: "bg-[#EBF3FF]", text: "text-[#0062FF]" },
                        { label: "Completed", value: completed, icon: "🏁", bg: "bg-green-50", text: "text-green-600" },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className={`relative overflow-hidden rounded-[24px] p-6 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group`}
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-transform group-hover:scale-110 ${s.bg}`} />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${s.bg}`}>{s.icon}</div>
                            </div>
                            <h2 className={`text-4xl font-extrabold mb-1 ${s.text}`}>{s.value}</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LOWER GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* TODAY */}
                      <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-extrabold text-gray-900">📅 Today's Appointments</h3>
                          <span className="text-xs font-bold bg-[#EBF3FF] text-[#0062FF] px-3 py-1.5 rounded-full">{todayAppts.length} Today</span>
                        </div>
                        {todayAppts.length === 0 ? (
                          <div className="text-center py-12 bg-gray-50 rounded-[16px] border border-gray-100">
                            <div className="text-4xl mb-3">🌿</div>
                            <p className="text-gray-900 font-bold">No appointments for today</p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {todayAppts.map((a) => (
                              <div key={a._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[16px] bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all gap-4">
                                <div>
                                  <p className="font-bold text-gray-900 text-base">{a.name}</p>
                                  <p className="text-sm text-gray-500 font-medium mt-0.5">{a.symptoms}</p>
                                </div>
                                <StatusBadge status={a.status} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* UPCOMING */}
                      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-extrabold text-gray-900 mb-6">🗓 Upcoming</h3>
                        {upcoming.length === 0 ? (
                          <div className="text-center py-12 bg-gray-50 rounded-[16px] border border-gray-100">
                            <p className="text-gray-500 font-bold text-sm">No upcoming appointments</p>
                          </div>
                        ) : (
                          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                            {upcoming.map((a) => (
                              <div key={a._id} className="border-l-4 border-[#0062FF] pl-4 py-1">
                                <p className="font-bold text-gray-900">{a.name}</p>
                                <p className="text-sm font-medium text-gray-500 line-clamp-1">{a.symptoms}</p>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase">
                                  {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ALL APPOINTMENTS */}
                {activeTab === "appointments" && (
                  <div className="space-y-6 pb-10">
                    {/* STICKY FILTER BAR */}
                    <div className="sticky top-0 z-10 bg-white border border-gray-100 rounded-[20px] p-3 flex flex-wrap gap-2 shadow-sm items-center">
                      {["Today", "All", "Pending", "Accepted", "Rejected"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors
          ${filter === f ? "bg-[#0062FF] text-white shadow-md shadow-blue-600/20" : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-100"}`}
                        >
                          {f}
                        </button>
                      ))}

                      <div className="ml-auto flex items-center gap-3">
                        <input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-[12px] px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0062FF] transition-all"
                        />
                        {dateFilter && (
                          <button onClick={() => setDateFilter("")} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">Clear</button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                      {filtered.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-[24px] border border-gray-100">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
                          <p className="text-gray-900 font-extrabold text-xl mb-1">No appointments found</p>
                          <p className="text-gray-500 font-medium text-sm">Try changing your filters.</p>
                        </div>
                      ) : (
                        filtered.map((appt) => (
                          <AppointmentCard key={appt._id} appt={appt} updating={updating} onAction={requestAction} />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* SCHEDULE */}
                {activeTab === "schedule" && (
                  <div className="w-full max-w-2xl pb-10">
                    <p className="text-gray-500 font-medium text-sm mb-6">Toggle days on/off and set working hours for each day.</p>
                    <div className="space-y-4">
                      {DAYS.map((day) => (
                        <div
                          key={day}
                          className={`bg-white rounded-[20px] border p-5 transition-all shadow-sm ${
                            schedule[day]?.enabled ? "border-[#0062FF]/20 shadow-blue-900/5" : "border-gray-100 opacity-70"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <button
                                onClick={() => updateLocalSchedule(day, { ...schedule[day], enabled: !schedule[day]?.enabled })}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                                  schedule[day]?.enabled ? "bg-[#0062FF]" : "bg-gray-200"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    schedule[day]?.enabled ? "translate-x-6" : ""
                                  }`}
                                />
                              </button>
                              <span className="font-extrabold text-gray-900 text-base">{day}</span>
                            </div>

                            {schedule[day]?.enabled ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                <input
                                  type="time"
                                  value={schedule[day]?.from}
                                  onChange={(e) => updateLocalSchedule(day, { ...schedule[day], from: e.target.value })}
                                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-[12px] px-3 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0062FF] transition-all"
                                />
                                <span className="text-gray-400 text-xs font-bold uppercase hidden sm:block">to</span>
                                <input
                                  type="time"
                                  value={schedule[day]?.to}
                                  onChange={(e) => updateLocalSchedule(day, { ...schedule[day], to: e.target.value })}
                                  className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-[12px] px-3 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0062FF] transition-all"
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Day off</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleSaveSchedule}
                        disabled={isSaving}
                        className={`px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-all ${
                          isSaving ? "bg-gray-400 text-white cursor-not-allowed" : saveSuccess ? "bg-green-500 text-white shadow-green-500/20" : "bg-[#0062FF] hover:bg-blue-700 text-white shadow-blue-600/20 hover:-translate-y-0.5"
                        }`}
                      >
                        {isSaving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save Changes"}
                      </button>
                    </div>
                  </div>
                )}

                {/* FEEDBACK */}
                {activeTab === "feedback" && (
                  <div className="pb-10">
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-[24px] border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">⭐</div>
                        <p className="text-gray-900 font-extrabold text-xl">No feedback yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedbacks.map((fb) => (
                          <div key={fb._id} className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-[#EBF3FF] rounded-full flex items-center justify-center text-[#0062FF] font-extrabold text-lg">
                                    {fb.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-gray-900 text-base">{fb.name}</p>
                                    <div className="flex mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < fb.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm font-medium leading-relaxed bg-[#F8FAFC] rounded-[16px] p-4 mb-4 border border-gray-100">"{fb.message}"</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <p className="text-gray-400 text-xs font-bold uppercase">{new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                              <div className="flex gap-2">
                                <button onClick={() => deleteFb(fb._id)} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
                                  Delete
                                </button>
                                {fb.approved ? (
                                  <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1">✓ Approved</span>
                                ) : (
                                  <button onClick={() => approveFb(fb._id)} className="bg-[#0062FF] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm shadow-blue-600/20">
                                    Approve
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* HISTORY */}
                {activeTab === "history" && (
                  <div className="pb-10 max-w-5xl">
                    <p className="text-gray-500 font-medium text-sm mb-6">Completed or rejected appointments.</p>
                    {history.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-[24px] border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📂</div>
                        <p className="text-gray-900 font-extrabold text-xl">No history yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {history.map((appt) => (
                          <div key={appt._id} className="bg-white rounded-[20px] border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-extrabold text-gray-900 text-base">{appt.name}</h3>
                                {appt.visitType === "Home Visit" && (
                                  <span className="bg-blue-100 text-[#0062FF] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                    🏠 Home Visit
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">
                                {appt.phone} • {new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                              <p className="text-gray-600 font-medium text-sm mt-2">{appt.symptoms}</p>
                            </div>
                            <StatusBadge status={appt.status} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TODO */}
                {activeTab === "todo" && (
                  <div className="max-w-2xl pb-10">
                    <p className="text-gray-500 font-medium text-sm mb-6">Simple notes for your daily tasks.</p>
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                      <input
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        placeholder="Add a new task... (press Enter)"
                        className="flex-1 bg-white border border-gray-200 rounded-[16px] px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0062FF] transition-all"
                      />
                      <button onClick={addTodo} className="bg-[#0062FF] hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-[16px] text-sm transition-colors shadow-md shadow-blue-600/20">
                        Add Task
                      </button>
                    </div>
                    {todos.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-[24px] border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
                        <p className="text-gray-900 font-extrabold text-xl">All caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todos.map((todo) => (
                          <div key={todo.id} className="bg-white rounded-[16px] border border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${todo.done ? "bg-[#0062FF] border-[#0062FF] text-white" : "border-gray-300 hover:border-[#0062FF]"}`}
                            >
                              {todo.done && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </button>
                            <span className={`flex-1 text-sm font-medium ${todo.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                              {todo.text}
                            </span>
                            <button onClick={() => deleteTodo(todo.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {todos.filter((t) => t.done).length > 0 && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => {
                            const n = todos.filter((t) => !t.done);
                            setTodos(n);
                            localStorage.setItem("sovind_todos", JSON.stringify(n));
                          }}
                          className="text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
                        >
                          Clear Completed
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            title={confirm.title}
            message={confirm.message}
            confirmLabel={confirm.label}
            danger={confirm.danger}
            onConfirm={confirmAction}
            onCancel={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AppointmentCard({ appt, updating, onAction }) {
  const isUpdating = (s) => updating === appt._id + s;

  const isToday = (date) => {
    const t = new Date();
    const d = new Date(date);
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };

  return (
    <motion.div layout className="relative overflow-hidden rounded-[24px] p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute left-0 top-0 h-full w-[6px] ${appt.visitType === "Home Visit" ? "bg-blue-500" : appt.status === "Accepted" ? "bg-green-500" : "bg-[#0062FF]"}`} />

      <div className="flex flex-col sm:flex-row justify-between items-start mb-5 pl-2 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{appt.name}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">{appt.phone}</p>
          <p className={`text-xs font-bold uppercase tracking-wide mt-2 ${isToday(appt.date) ? "text-[#0062FF]" : "text-gray-400"}`}>
            {isToday(appt.date) ? "Today" : new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={appt.status} />
          {appt.visitType === "Home Visit" && (
            <div className="bg-blue-50 border border-blue-100 text-[#0062FF] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
              <span className="text-sm">🏠</span> Home Visit Requested
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6 pl-2">
        <div className="bg-[#F8FAFC] rounded-[16px] p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Symptoms</p>
          <p className="text-sm font-medium text-gray-900">{appt.symptoms}</p>
        </div>
        <div className="bg-[#F8FAFC] rounded-[16px] p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Address</p>
          <p className="text-sm font-medium text-gray-900">{appt.address}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pl-2">
        {appt.status === "Pending" && (
          <>
            <button
              onClick={() => onAction(appt._id, "Accepted")}
              disabled={isUpdating("Accepted")}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#0062FF] hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-60"
            >
              {isUpdating("Accepted") ? "Processing..." : "Accept"}
            </button>
            <button
              onClick={() => onAction(appt._id, "Rejected")}
              disabled={isUpdating("Rejected")}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm disabled:opacity-60"
            >
              {isUpdating("Rejected") ? "Processing..." : "Reject"}
            </button>
          </>
        )}
        {appt.status === "Accepted" && (
          <button
            onClick={() => onAction(appt._id, "Completed")}
            disabled={isUpdating("Completed")}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-green-500 hover:bg-green-600 text-white transition-colors shadow-sm disabled:opacity-60"
          >
            {isUpdating("Completed") ? "Processing..." : "Mark Complete"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
