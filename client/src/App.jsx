import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Track from './pages/Track.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AppInner() {
  const [token, setToken] = useState(localStorage.getItem('sovind_token') || '');
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const login = (tok) => {
    localStorage.setItem('sovind_token', tok);
    setToken(tok);
    setShowLogin(false);
  };

  const logout = () => {
    localStorage.removeItem('sovind_token');
    setToken('');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAdmin: !!token, openLogin: () => setShowLogin(true) }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Track />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
