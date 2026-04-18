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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
      >
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-semibold py-2.5 rounded-xl text-sm transition-all text-white ${danger ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"}`}
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

  // Schedule state
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem("sovind_schedule");
    if (saved) return JSON.parse(saved);
    return DAYS.reduce(
      (acc, d) => ({
        ...acc,
        [d]: { enabled: d !== "Sunday", from: "09:00", to: "18:00" },
      }),
      {},
    );
  });

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
          : [],
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

  const saveSchedule = (newSched) => {
    setSchedule(newSched);
    localStorage.setItem("sovind_schedule", JSON.stringify(newSched));
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
      t.id === id ? { ...t, done: !t.done } : t,
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
    (a) => a.status === "Completed" || a.status === "Rejected",
  );
  const upcoming = appointments
    .filter(
      (a) =>
        new Date(a.date) >= new Date() &&
        a.status !== "Rejected" &&
        a.status !== "Completed",
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  const getFiltered = useCallback(() => {
    let base = appointments.filter(
      (a) => a.status !== "Completed" && a.status !== "Rejected",
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
    <div className="min-h-screen flex bg-gradient-to-br from-[#f8f5f2] via-[#fdfaf6] to-[#f1ece6]">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 h-full w-72 z-40 flex flex-col
    bg-white/60 backdrop-blur-2xl border-r border-white/40
    shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static md:h-screen`}
        >
          {/* Top Brand */}
          <div className="p-6 border-b border-gray-100/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-md">
                S
              </div>

              <div className="leading-tight">
                <p className="text-[15px] font-semibold text-gray-800">
                  SovindCare
                </p>
                <p className="text-xs text-gray-400">Doctor Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto space-y-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
          ${
            activeTab === item.id
              ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100"
              : "text-gray-500 hover:bg-gray-50"
          }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>

                {item.id === "feedback" && pendingFeedbacks > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {pendingFeedbacks}
                  </span>
                )}

                {item.id === "appointments" && pending > 0 && (
                  <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                    {pending}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100/60 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              <span>👤</span>
              Patient View
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </aside>
      </>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top header */}

        <header
          className="
    sticky top-0 z-20
    bg-white/50 backdrop-blur-2xl
    border-b border-white/40
    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
  "
        >
          <div className="flex items-center justify-between px-5 md:px-8 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <div className="w-5 flex flex-col gap-1">
                  <span className="block h-0.5 bg-gray-600 rounded" />
                  <span className="block h-0.5 bg-gray-600 rounded w-3/4" />
                  <span className="block h-0.5 bg-gray-600 rounded" />
                </div>
              </button>

              {/* Title Block */}
              <div className="leading-tight">
                <h1 className="text-[16px] font-semibold text-gray-800">
                  {NAV.find((n) => n.id === activeTab)?.label}
                </h1>

                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Refresh Button (Apple pill style) */}
              <button
                onClick={loadData}
                className="
          px-4 py-2 rounded-full
          text-xs font-medium
          bg-teal-50 text-teal-700
          hover:bg-teal-100
          border border-teal-100
          transition-all
        "
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-300">
              <div
                className="spinner"
                style={{
                  width: 36,
                  height: 36,
                  borderWidth: 3,
                  borderTopColor: "#0d9488",
                  borderColor: "#e2e8f0",
                }}
              />
              <p className="mt-4 text-sm text-gray-400">Loading data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    {/* METRICS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      {[
                        {
                          label: "Total",
                          value: total,
                          icon: "📊",
                          color: "from-gray-50 to-white",
                          text: "text-gray-800",
                        },
                        {
                          label: "Pending",
                          value: pending,
                          icon: "⏳",
                          color: "from-yellow-50 to-white",
                          text: "text-yellow-600",
                        },
                        {
                          label: "Accepted",
                          value: accepted,
                          icon: "✅",
                          color: "from-teal-50 to-white",
                          text: "text-teal-600",
                        },
                        {
                          label: "Completed",
                          value: completed,
                          icon: "🏁",
                          color: "from-green-50 to-white",
                          text: "text-green-600",
                        },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className={`
            relative overflow-hidden
            rounded-2xl p-5
            border border-gray-100
            bg-gradient-to-br ${s.color}
            shadow-sm hover:shadow-lg
            transition-all duration-300
            hover:-translate-y-1
          `}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl">{s.icon}</span>
                            <span className="text-xs text-gray-400">
                              {s.label}
                            </span>
                          </div>

                          <h2 className={`text-3xl font-semibold ${s.text}`}>
                            {s.value}
                          </h2>

                          <p className="text-xs text-gray-400 mt-1">
                            Live hospital analytics
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* LOWER GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* TODAY */}
                      <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-sm font-semibold text-gray-700">
                            📅 Today’s Appointments
                          </h3>

                          <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                            {todayAppts.length}
                          </span>
                        </div>

                        {todayAppts.length === 0 ? (
                          <div className="text-center py-10 text-gray-400">
                            <div className="text-3xl mb-2">🌿</div>
                            No appointments for today
                          </div>
                        ) : (
                          <div className="space-y-3 h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                            {todayAppts.map((a) => (
                              <div
                                key={a._id}
                                className="
                  flex items-center justify-between
                  p-4 rounded-2xl
                  bg-white/70
                  border border-gray-100
                  hover:shadow-md
                  transition
                "
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {a.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {a.symptoms}
                                  </p>
                                </div>

                                <StatusBadge status={a.status} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* UPCOMING */}
                      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-5">
                          🗓 Upcoming 
                        </h3>

                        {upcoming.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center">
                            No upcoming appointments
                          </p>
                        ) : (
                          <div className="space-y-4 h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                            {upcoming.map((a) => (
                              <div
                                key={a._id}
                                className="border-l-2 border-teal-400 pl-3"
                              >
                                <p className="text-md font-medium text-gray-700">
                                  {a.name}
                                </p>
                                 <p className="text-sm font-md  text-gray-500">
                                  {a.symptoms}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(a.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
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
                  <div className="space-y-5">
                    {/* STICKY FILTER BAR */}
                    <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-3 flex flex-wrap gap-2 shadow-sm">
                      {["Today", "All", "Pending", "Accepted", "Rejected"].map(
                        (f) => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
          ${
            filter === f
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300"
          }`}
                          >
                            {f}
                          </button>
                        ),
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        <input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />

                        {dateFilter && (
                          <button
                            onClick={() => setDateFilter("")}
                            className="text-xs text-gray-400 hover:text-red-500"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* LIST CONTAINER (SCROLL FIX 🔥) */}
                    <div
                      className="
        max-h-[70vh]
        overflow-y-auto
        pr-2
        space-y-3
        scrollbar-thin scrollbar-thumb-gray-200
      "
                    >
                      {filtered.length === 0 ? (
                        <div className="text-center py-16 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100">
                          <p className="text-4xl mb-2">📭</p>
                          <p className="text-gray-500 font-medium">
                            No appointments found
                          </p>
                          <p className="text-gray-400 text-sm">
                            Try changing filters
                          </p>
                        </div>
                      ) : (
                        filtered.map((appt) => (
                          <div
                            key={appt._id}
                            className="
              bg-white/70
              backdrop-blur-xl
              border border-gray-100
              rounded-2xl
              shadow-sm
              hover:shadow-md
              transition
            "
                          >
                            <AppointmentCard
                              appt={appt}
                              updating={updating}
                              onAction={requestAction}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* SCHEDULE */}
                {activeTab === "schedule" && (
                  <div className="max-w-2xl">
                    <p className="text-gray-400 text-sm mb-6">
                      Toggle days on/off and set working hours for each day.
                    </p>
                    <div className="space-y-3">
                      {DAYS.map((day) => (
                        <div
                          key={day}
                          className={`
    bg-white/60 backdrop-blur-xl
    rounded-2xl border border-white/40
    p-4 transition-all
    shadow-sm hover:shadow-md
    ${schedule[day].enabled ? "ring-1 ring-teal-100" : "opacity-60"}
  `}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                saveSchedule({
                                  ...schedule,
                                  [day]: {
                                    ...schedule[day],
                                    enabled: !schedule[day].enabled,
                                  },
                                })
                              }
                              className={`w-11 h-6 rounded-full transition-all relative shrink-0  shadow-inner ${schedule[day].enabled ? "bg-teal-500" : "bg-gray-200"}`}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${schedule[day].enabled ? "translate-x-5" : ""}`}
                              />
                            </button>
                            <span className="font-medium text-gray-700 w-24 shrink-0 text-sm">
                              {day}
                            </span>
                            {schedule[day].enabled && (
                              <div className="flex items-center gap-2 text-sm">
                                <input
                                  type="time"
                                  value={schedule[day].from}
                                  onChange={(e) =>
                                    saveSchedule({
                                      ...schedule,
                                      [day]: {
                                        ...schedule[day],
                                        from: e.target.value,
                                      },
                                    })
                                  }
                                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <span className="text-gray-400 text-xs">
                                  to
                                </span>
                                <input
                                  type="time"
                                  value={schedule[day].to}
                                  onChange={(e) =>
                                    saveSchedule({
                                      ...schedule,
                                      [day]: {
                                        ...schedule[day],
                                        to: e.target.value,
                                      },
                                    })
                                  }
                                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                              </div>
                            )}
                            {!schedule[day].enabled && (
                              <span className="text-xs text-gray-400">
                                Day off
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                      ✅ Schedule saved automatically.
                    </p>
                  </div>
                )}

                {/* FEEDBACK */}
                {activeTab === "feedback" && (
                  <div className="overflow-y-auto h-[600px]">
                    {feedbacks.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <p className="text-4xl mb-3">⭐</p>
                        <p className="text-gray-500 font-medium">
                          No feedback yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {feedbacks.map((fb) => (
                          <div
                            key={fb._id}
                            className={`
    bg-white/70 backdrop-blur-xl
    rounded-2xl border border-white/40
    p-5 shadow-sm hover:shadow-md
    transition-all
  `}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-semibold text-sm">
                                  {fb.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">
                                    {fb.name}
                                  </p>
                                  <div className="flex mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-sm transition ${
                                          i < fb.rating
                                            ? "text-amber-400"
                                            : "text-gray-200"
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {fb.approved ? (
                                <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                  ✓ Approved
                                </span>
                              ) : (
                                <button
                                  onClick={() => approveFb(fb._id)}
                                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed  overflow-hidden whitespace-pre-line break-words bg-gray-50 rounded-xl p-3">
                              "{fb.message}"
                            </p>
                            <p className="text-gray-300 text-xs mt-2">
                              {new Date(fb.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* HISTORY */}
                {activeTab === "history" && (
                  <div>
                    <p className="text-gray-400 text-sm mb-5">
                      All completed appointments are shown here.
                    </p>
                    {history.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                        <p className="text-4xl mb-3">📂</p>
                        <p className="text-gray-500 font-medium">
                          No history yet
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Completed appointments will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {history.map((appt) => (
                          <div
                            key={appt._id}
                            className="
    bg-white/70 backdrop-blur-xl
    rounded-2xl border border-white/40
    p-5 flex flex-wrap items-center justify-between gap-3
    shadow-sm hover:shadow-md
    transition-all
  "
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-semibold text-gray-800 text-sm">
                                  {appt.name}
                                </h3>
                                {appt.condition === "Urgent" && (
                                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs">
                                {appt.phone} ·{" "}
                                {new Date(appt.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {appt.symptoms}
                              </p>
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
                  <div className="max-w-lg">
                    <p className="text-gray-400 text-sm mb-5">
                      Simple notes for your daily tasks.
                    </p>
                    <div className="flex gap-2 mb-5">
                      <input
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        placeholder="Add a task... (press Enter)"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                      />
                      <button
                        onClick={addTodo}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {todos.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="text-gray-400 text-sm">
                          No tasks yet. Add your first task above!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {todos.map((todo) => (
                          <div
                            key={todo.id}
                            className="
    bg-white/70 backdrop-blur-xl
    rounded-xl border border-white/40
    px-4 py-3 flex items-center gap-3
    shadow-sm hover:shadow-md
    transition-all
  "
                          >
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${todo.done ? "bg-teal-500 border-teal-500 text-white" : "border-gray-300 hover:border-teal-400"}`}
                            >
                              {todo.done && <span className="text-xs">✓</span>}
                            </button>
                            <span
                              className={`flex-1 text-sm ${todo.done ? "line-through text-gray-300" : "text-gray-700"}`}
                            >
                              {todo.text}
                            </span>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {todos.filter((t) => t.done).length > 0 && (
                      <button
                        onClick={() => {
                          const n = todos.filter((t) => !t.done);
                          setTodos(n);
                          localStorage.setItem(
                            "sovind_todos",
                            JSON.stringify(n),
                          );
                        }}
                        className="mt-4 text-xs text-gray-400 hover:text-red-400 transition-colors"
                      >
                        🗑 Clear completed ({todos.filter((t) => t.done).length}
                        )
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
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

// Card
// function AppointmentCard({ appt, updating, onAction }) {
//   const isUpdating = (s) => updating === appt._id + s;

//   return (
//     <motion.div
//       layout
//       className="
//         p-5 rounded-2xl
//         bg-white/70 backdrop-blur-xl
//         border border-white/40
//         shadow-sm hover:shadow-lg
//         transition-all duration-300
//       "
//     >
//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-3 mb-4">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 flex-wrap">
//             <h3 className="text-sm font-semibold text-gray-800">{appt.name}</h3>

//             {appt.condition === "Urgent" && (
//               <span
//                 className="
//                 text-xs px-2 py-0.5 rounded-full
//                 bg-red-50 text-red-600
//                 border border-red-100
//               "
//               >
//                 🔴 Urgent
//               </span>
//             )}

//             {/* {isToday(appt.date) && (
//               <span
//                 className="
//                 text-xs px-2 py-0.5 rounded-full
//                 bg-teal-50 text-teal-700
//                 border border-teal-100
//               "
//               >
//                 Today
//               </span>
//             )} */}

//    <p
//   className={`text-xs ${
//     isToday(appt.date) ? "text-teal-600 font-medium" : "text-gray-400"
//   }`}
// >
//   {isToday(appt.date)
//     ? "Today"
//     : new Date(appt.date).toLocaleDateString("en-IN", {
//         month: "short",
//         day: "numeric",
//       })}
// </p>


//           </div>
//           <p className="text-xs text-gray-400">{appt.phone}</p>
//         </div>

//         <StatusBadge status={appt.status} />
//       </div>

//       {/* DETAILS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//         <div className="bg-gray-50/60 rounded-xl p-3 border border-gray-100">
//           <p className="text-[11px] text-gray-400 mb-1">Symptoms</p>
//           <p className="text-sm text-gray-700">{appt.symptoms}</p>
//         </div>

//         <div className="bg-gray-50/60 rounded-xl p-3 border border-gray-100">
//           <p className="text-[11px] text-gray-400 mb-1">Address</p>
//           <p className="text-sm text-gray-700">{appt.address}</p>
//         </div>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex flex-wrap gap-2">
//         {appt.status === "Pending" && (
//           <>
//             <button
//               onClick={() => onAction(appt._id, "Accepted")}
//               disabled={isUpdating("Accepted")}
//               className="
//                 px-4 py-2 rounded-xl text-xs font-medium
//                 bg-teal-600 text-white
//                 hover:bg-teal-700
//                 transition
//                 disabled:opacity-60
//               "
//             >
//               {isUpdating("Accepted") ? "Processing..." : "Accept"}
//             </button>

//             <button
//               onClick={() => onAction(appt._id, "Rejected")}
//               disabled={isUpdating("Rejected")}
//               className="
//                 px-4 py-2 rounded-xl text-xs font-medium
//                 bg-red-50 text-red-600
//                 border border-red-100
//                 hover:bg-red-100
//                 transition
//                 disabled:opacity-60
//               "
//             >
//               {isUpdating("Rejected") ? "Processing..." : "Reject"}
//             </button>
//           </>
//         )}

//         {appt.status === "Accepted" && (
//           <button
//             onClick={() => onAction(appt._id, "Completed")}
//             disabled={isUpdating("Completed")}
//             className="
//               px-4 py-2 rounded-xl text-xs font-medium
//               bg-green-600 text-white
//               hover:bg-green-700
//               transition
//               disabled:opacity-60
//             "
//           >
//             {isUpdating("Completed") ? "Processing..." : "Mark Complete"}
//           </button>
//         )}
//       </div>
//     </motion.div>
//   );
// }


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
    <motion.div
      layout
      className="
        relative overflow-hidden
        rounded-2xl p-5
        bg-gradient-to-br from-slate-50 via-white to-slate-100
        border border-slate-200
        shadow-md hover:shadow-xl
        transition-all duration-300
      "
    >
      {/* LEFT ACCENT */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          appt.condition === "Urgent"
            ? "bg-red-500"
            : appt.status === "Accepted"
            ? "bg-green-500"
            : "bg-teal-500"
        }`}
      />

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 pl-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {appt.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1">{appt.phone}</p>

          {/* DATE */}
          <p
            className={`text-[11px] mt-1 ${
              isToday(appt.date)
                ? "text-teal-600 font-medium"
                : "text-slate-400"
            }`}
          >
            {isToday(appt.date)
              ? "Today"
              : new Date(appt.date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
          </p>
        </div>

        {/* RIGHT SIDE BADGES */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusBadge status={appt.status} />

          {appt.condition === "Urgent" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
             🔴 URGENT
            </span>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-3 mb-5 pl-2">
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <p className="text-[11px] text-slate-400 mb-1 uppercase">
            Symptoms
          </p>
          <p className="text-sm text-slate-700">{appt.symptoms}</p>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <p className="text-[11px] text-slate-400 mb-1 uppercase">
            Address
          </p>
          <p className="text-sm text-slate-700">{appt.address}</p>
        </div>
      </div>

      {/* ACTIONS (your original style kept) */}
      <div className="flex flex-wrap gap-2 pl-2">
        {appt.status === "Pending" && (
          <>
            <button
              onClick={() => onAction(appt._id, "Accepted")}
              disabled={isUpdating("Accepted")}
              className="
                px-4 py-2 rounded-xl text-xs font-medium
                bg-teal-600 text-white
                hover:bg-teal-700
                transition
                disabled:opacity-60
              "
            >
              {isUpdating("Accepted") ? "Processing..." : "Accept"}
            </button>

            <button
              onClick={() => onAction(appt._id, "Rejected")}
              disabled={isUpdating("Rejected")}
              className="
                px-4 py-2 rounded-xl text-xs font-medium
                bg-red-50 text-red-600
                border border-red-100
                hover:bg-red-100
                transition
                disabled:opacity-60
              "
            >
              {isUpdating("Rejected") ? "Processing..." : "Reject"}
            </button>
          </>
        )}

        {appt.status === "Accepted" && (
          <button
            onClick={() => onAction(appt._id, "Completed")}
            disabled={isUpdating("Completed")}
            className="
              px-4 py-2 rounded-xl text-xs font-medium
              bg-green-600 text-white
              hover:bg-green-700
              transition
              disabled:opacity-60
            "
          >
            {isUpdating("Completed") ? "Processing..." : "Mark Complete"}
          </button>
        )}
      </div>
    </motion.div>
  );
}