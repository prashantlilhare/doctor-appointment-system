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

  const inputClass = "w-full bg-[#F8FAFC] border border-gray-200 rounded-[16px] px-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0062FF] focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <AnimatePresence mode="wait">
          {!roleChoice ? (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Admin Login</h2>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Access the admin dashboard</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[16px] text-sm text-red-600 font-medium flex items-center gap-2">
                  <span className="text-lg">⚠️</span> {error} 
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block pl-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@careclinic.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block pl-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-full font-bold text-white bg-[#0062FF] hover:bg-blue-700 transition-colors mt-2 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 ${loading ? 'opacity-70' : 'hover:-translate-y-0.5'}`}>
                  {loading ? 'Logging in...' : 'Login Securely'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 text-center">
              <div className="w-20 h-20 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-500 text-sm mb-8 font-medium">How would you like to continue?</p>
              <div className="flex gap-4">
                <button onClick={() => handleRole('patient')} className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:border-[#0062FF] hover:text-[#0062FF] font-bold py-4 rounded-[20px] transition-colors">
                  👤 Patient
                </button>
                <button onClick={() => handleRole('doctor')} className="flex-1 bg-[#0062FF] hover:bg-blue-700 text-white font-bold py-4 rounded-[20px] transition-colors shadow-lg shadow-blue-600/20">
                  👨‍⚕️ Doctor
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
