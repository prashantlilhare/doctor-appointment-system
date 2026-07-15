import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openLogin, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services' },
    { name: 'Contact', path: '/#contact' }
  ];

  const handleScrollTo = (e, target) => {
    e.preventDefault();
    setMenuOpen(false);
    if (target.startsWith('/#')) {
      if (window.location.pathname !== '/') {
        window.location.href = target;
        return;
      }
      const element = document.getElementById(target.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.href = target;
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Brand */}
        <Link to="/" onClick={(e) => handleScrollTo(e, '/#home')} className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-2 border-[#0062FF] rounded-full flex items-center justify-center text-[#0062FF] font-bold text-lg group-hover:bg-[#0062FF] group-hover:text-white transition-colors">
            SL
          </div>
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900'} transition-colors`}>
            Dr. S. Lilhare
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => handleScrollTo(e, link.path)}
              className="text-sm font-semibold text-gray-600 hover:text-[#0062FF] transition-colors"
            >
              {link.name}
            </a>
          ))}

          <Link
            to="/track"
            className="text-[#0062FF] bg-blue-50 hover:bg-blue-100 border border-blue-100 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
          >
            Track Status
          </Link>

          <button
            onClick={(e) => handleScrollTo(e, '/#book')}
            className="bg-[#0062FF] hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Appointment
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 border-t border-gray-100 flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => handleScrollTo(e, link.path)}
              className="text-base font-semibold text-gray-800"
            >
              {link.name}
            </a>
          ))}

          <Link
            to="/track"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-50 text-[#0062FF] px-6 py-3 rounded-full text-sm font-bold w-full mt-2 text-center border border-blue-100"
          >
            Track Status
          </Link>

          <button
            onClick={(e) => handleScrollTo(e, '/#book')}
            className="bg-[#0062FF] text-white px-6 py-3 rounded-full text-sm font-bold w-full mt-2"
          >
            Book Appointment
          </button>
        </div>
      )}
    </header>
  );
}