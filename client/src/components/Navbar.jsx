import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout, openLogin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 smooth scroll handler (IMPORTANT FIX)
  const handleScroll = (id) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">

        {/* 🔷 Logo */}
        <div
          onClick={() => handleScroll("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition">
            S
          </div>
          <span className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition">
            SovindCare
          </span>
        </div>

        {/* 🔷 Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          {[
            { name: 'Home', id: 'home' },
            { name: 'Services', id: 'services' },
            { name: 'About', id: 'about' },
            { name: 'Appointment', id: 'book' },
            { name: 'Track', path: '/track' },
            { name: 'Contact', id: 'contact' }
          ].map((item) =>
            item.path ? (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-sm font-medium text-gray-600 hover:text-teal-600 transition"
              >
                {item.name}
              </button>
            ) : (
              <button
                key={item.name}
                onClick={() => handleScroll(item.id)}
                className="relative text-sm font-medium text-gray-600 hover:text-teal-600 transition group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            )
          )}

          <div className="w-px h-6 bg-gray-200" />

          {/* 🔷 Admin Buttons */}
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow hover:scale-105 transition"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={openLogin}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow hover:shadow-lg hover:scale-105 transition"
            >
              Admin Login
            </button>
          )}
        </div>

        {/* 🔷 Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          ☰
        </button>
      </div>

      {/* 🔷 Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t px-6 py-5 flex flex-col gap-4 animate-fadeIn">

          {[
            { name: 'Home', id: 'home' },
            { name: 'Services', id: 'services' },
            { name: 'About', id: 'about' },
            { name: 'Appointment', id: 'book' },
            { name: 'Track', path: '/track' },
            { name: 'Contact', id: 'contact' }
          ].map((item) =>
            item.path ? (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                className="text-left text-gray-700 hover:text-teal-600"
              >
                {item.name}
              </button>
            ) : (
              <button
                key={item.name}
                onClick={() => handleScroll(item.id)}
                className="text-left text-gray-700 hover:text-teal-600"
              >
                {item.name}
              </button>
            )
          )}

          <div className="h-px bg-gray-200 my-2" />

          {isAdmin ? (
            <>
              <button
                onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                className="bg-teal-500 text-white py-2 rounded-lg"
              >
                Dashboard
              </button>

              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { openLogin(); setMenuOpen(false); }}
              className="bg-teal-500 text-white py-2 rounded-lg"
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}