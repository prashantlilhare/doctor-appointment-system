import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App.jsx';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/index.js';

export default function AdminLoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleChoice, setRoleChoice] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await api.login({ email, password });
    setLoading(false);
    if (res.token) {
      login(res.token);
      setRoleChoice(true);
    } else {
      setError(res.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleRole = (role) => {
    if (role === 'doctor') navigate('/admin');
    else navigate('/');
    onClose();
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!roleChoice ? (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-display text-2xl text-gray-800">Admin Login</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Access the admin dashboard</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">✕</button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@sovindcare.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
                </div>
                <button type="submit" disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all mt-1 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="spinner" /> Logging in...</> : '🔐 Login'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">✅</div>
              <h2 className="font-display text-2xl text-gray-800 mb-1">Welcome Back!</h2>
              <p className="text-gray-400 text-sm mb-8">How would you like to continue?</p>
              <div className="flex gap-4">
                <button onClick={() => handleRole('patient')}
                  className="flex-1 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold py-4 rounded-xl transition-all">
                  👤 As Patient
                </button>
                <button onClick={() => handleRole('doctor')}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl transition-all shadow-sm shadow-teal-200">
                  👨‍⚕️ As Doctor
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
