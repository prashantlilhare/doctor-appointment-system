import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import AppointmentForm from '../components/AppointmentForm.jsx';
import FeedbackSection from '../components/FeedbackSection.jsx';
import { useAuth } from '../App.jsx';
import AvailabilityBox from '../components/AvailabilityBox.jsx';
import sovindpfp from '../assets/sovind-pfp.webp';
import docai from '../assets/doc-ai.webp';
import fblogo from '../assets/fb-logo.webp';
import wplogo from '../assets/wp-logo.webp';
import iglogo from '../assets/ig-logo.webp';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    title: "General Consultation",
    desc: "Comprehensive checkups to monitor your overall health and well-being.",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    bg: "bg-blue-50/50", text: "text-blue-900"
  },
  {
    title: "Hypertension Care",
    desc: "Expert monitoring and management for blood pressure stability.",
    icon: (
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bg: "bg-red-50/50", text: "text-red-900"
  },
  {
    title: "Fever & Infections",
    desc: "Rapid diagnosis and treatment for viral and bacterial infections.",
    icon: (
      <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bg: "bg-yellow-50/50", text: "text-yellow-900"
  },
  {
    title: "Urgent Medical Care",
    desc: "Immediate medical attention for acute, non-life-threatening conditions.",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bg: "bg-red-100/50", text: "text-red-900"
  },
  {
    title: "Pediatric Wellness",
    desc: "Specialized, compassionate care for infants, children, and teens.",
    icon: (
      <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-pink-50/50", text: "text-pink-900"
  },
  {
    title: "Home Medical Visits",
    desc: "Convenient at-home consultations for the elderly and severely ill.",
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    bg: "bg-green-50/50", text: "text-green-900"
  },
  {
    title: "Vaccinations",
    desc: "Essential immunizations to protect you and your loved ones.",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    bg: "bg-purple-50/50", text: "text-purple-900"
  },
  {
    title: "Health Screenings",
    desc: "Routine diagnostic tests to detect potential health issues early.",
    icon: (
      <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    bg: "bg-teal-50/50", text: "text-teal-900"
  }
];

const trustMarqueeData = [
  { text: "2500+ Happy Patients", icon: "⭐" },
  { text: "Home Visit Available", icon: "🏡" },
  { text: "Emergency Care", icon: "🚨" },
  { text: "10+ Years Experience", icon: "🩺" }
];

const stats = [
  { value: "2,500+", label: 'Patients Served' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Urgent Support' },
];

const features = [
  { icon: '🩺', title: 'Expert Doctors', desc: 'Board-certified physicians available for in-person visits.' },
  { icon: '📅', title: 'Easy Scheduling', desc: 'Book your appointment in under 2 minutes, any time.' },
  { icon: '📱', title: 'Track Anytime', desc: 'Follow your appointment status using just your phone number.' },
];

const steps = [
  { step: '01', title: 'Book Appointment', desc: 'Fill out a simple form with your details and preferred date.' },
  { step: '02', title: 'Get Confirmed', desc: 'Our admin reviews and confirms your appointment quickly.' },
  { step: '03', title: 'Track in Real-time', desc: 'Use your phone number to check your appointment status anytime.' },
];
// 🔥 ONLY IMPORTANT PARTS SHOWN (structure upgraded)

export default function Home() {
  const aboutRef = useRef(null);
  const statsRef = useRef(null);

  const { openLogin } = useAuth();

  // 🔥 ONLY CHANGED PARTS — SAME FILE ME REPLACE KARNA

useEffect(() => {
  const ctx = gsap.context(() => {

    // 🔢 COUNT (SMOOTHER + SYMBOL FIX)
    gsap.utils.toArray(".stat-number").forEach(el => {
      const targetStr = el.getAttribute("data-value");
      const num = parseInt(targetStr.replace(/[^0-9]/g, ""), 10) || 0;
      const suffix = targetStr.replace(/[0-9]/g, "");
      
      let obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 2.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
        },
        onUpdate: () => {
          el.innerText = Math.floor(obj.val) + suffix;
        }
      });
    });
// 🔥 SYNC IMAGE + TEXT (FINAL FIX)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: aboutRef.current,
    start: "top 90%",   // jab thoda enter kare
    end: "bottom 80%",  // pura scroll range cover kare
    scrub: true,        // 🔥 EXACT scroll sync (no delay)
  }
});

// 🧑‍⚕️ IMAGE (PURE SCROLL SCALE)
tl.fromTo(".about-img",
  { scale: 0.1, opacity: 0 },   // starting small
  { scale: 1,opacity:1, ease: "none" },
  0
);

// 📖 TEXT (SYNC)
// TEXT (same timeline pe)
tl.from(".about-line", {
  opacity: 0,
  y: 10,
  stagger: 0.2,
  ease: "none"
}, 0);

  });

  return () => ctx.revert();
}, []);

  return (
    <div className="bg-[#f8fafc] text-gray-800">
      <Navbar />

{/* 🔥 HERO (ULTRA PREMIUM GLASS + IMAGE STYLE) */}
<section id="home" className="relative m-4 md:m-6 rounded-[32px] overflow-hidden">

  {/* BG */}
  <div className="absolute inset-0">
    <img 
      src="https://images.unsplash.com/photo-1582750433449-648ed127bb54"
      className="w-full h-full object-cover scale-105"
      alt="Hero background"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-teal-800/70 to-cyan-900/80" />
  </div>

  {/* glass glow */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>

  <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center text-white">

    {/* LEFT */}
    <div>
      <p className="text-white/70 font-medium mb-3 tracking-wide">
        Trusted  Doctor
      </p>

      <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tighter mb-6">
        Smart Healthcare <br />
        <span className="text-teal-300">At Your Doorstep</span>
      </h1>

      <p className="text-white/70 mb-8 max-w-md">
        Book, track & get treatment — simple and fast.
      </p>

      <div className="flex items-center -ml-5 flex-wrap gap-3">

        <button
          onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-white text-teal-700 px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition"
        >
          Book Appointment
        </button>

        <button
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-white/10 backdrop-blur border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition"
        >
          Services
        </button>

        <a href="tel:+15551234567"
          className="pulse-urgent bg-red-500 px-6 py-3 rounded-full font-semibold shadow">
          🚨 Emergency
        </a>
      </div>
    </div>

    {/* RIGHT CARD */}
    <div className="flex justify-center relative">

      <div className="absolute -top-5  bg-white text-gray-700 px-4 py-1 rounded-full text-xs shadow">
        🟢 Available Today
      </div>

      <div className="bg-white/10 backdrop-blur-2xl -ml-5 rounded-3xl p-6 w-80 shadow-2xl border border-white/20 hover:scale-105 transition">

        <div className="flex flex-col items-center text-center text-white">

          <img
            src={docai}
            className="w-24 h-24 rounded-full mb-4 border-4 border-white/30 object-cover"
            alt="Doctor profile"
          />

          <h3 className="text-lg font-semibold">Dr. John Doe</h3>
          <p className="text-sm text-white/70 mb-4">General Physician</p>

          <div className="flex flex-wrap justify-center gap-2 text-xs">

            <span className="bg-white/20 px-3 py-1 rounded-full">10+ yr Experience✨</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">👥 2500+</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">🏠 Home Visit</span>

          </div>
        </div>
      </div>
    </div>

  </div>
</section>


{/* 🔢 STATS (GLASS STYLE + COUNT FIX) */}
<section ref={statsRef} className="px-4 -mt-12 relative z-10">
  <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 grid grid-cols-3 text-center py-8">

    <div>
      <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter text-teal-600 stat-number" data-value="2500+">0</h2>
      <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-2">Patients</p>
    </div>

    <div>
      <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter text-teal-600 stat-number" data-value="98%">0%</h2>
      <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-2">Satisfaction %</p>
    </div>

    <div>
      <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter text-teal-600">24/7</h2>
      <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-2">Support</p>
    </div>

  </div>
</section>

{/* 🔥 TRUST BANNER */}
<section className="py-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm relative z-10">
  <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition duration-500">
     <div className="flex items-center gap-2 font-semibold text-gray-600 text-sm"><span className="text-teal-600 text-xl">⚕️</span> Verified Medical Practice</div>
     <div className="flex items-center gap-2 font-semibold text-gray-600 text-sm"><span className="text-teal-600 text-xl">🏆</span> 10+ Years Excellence</div>
     <div className="flex items-center gap-2 font-semibold text-gray-600 text-sm"><span className="text-teal-600 text-xl">🤝</span> Community Trusted</div>
     <div className="flex items-center gap-2 font-semibold text-gray-600 text-sm"><span className="text-teal-600 text-xl">⚡</span> 24/7 Emergency Care</div>
  </div>
</section>

{/* 🔥 SERVICES (PROFESSIONAL CARDS) */}
<section id="services" className="py-16 md:py-24 bg-white relative z-10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-10 md:mb-16">
      <p className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3">Our Expertise</p>
      <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-gray-900 mb-4">Healthcare Services</h2>
      <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">Comprehensive and compassionate medical care tailored for you and your family.</p>
      
      {/* 📱 Mobile Swipe Hint */}
      <div className="md:hidden mt-6 flex items-center justify-center gap-2 text-teal-500 font-semibold text-sm animate-pulse">
        <span>←</span>
        <span>Swipe to explore</span>
        <span>→</span>
      </div>
    </div>
    
    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-6 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible">
      {servicesData.map((item, i) => (
        <div key={i} className={`shrink-0 w-[85vw] md:w-auto snap-center p-6 md:p-8 rounded-[24px] md:rounded-[28px] border border-gray-100 ${item.bg} hover:shadow-xl hover:-translate-y-1 transition duration-300`}>
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 md:mb-6">
            {item.icon}
          </div>
          <h3 className={`text-xl font-display font-semibold tracking-tight mb-2 md:mb-3 ${item.text}`}>{item.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* 🔥 TRUST MARQUEE */}
<section className="py-12 bg-teal-900 overflow-hidden text-teal-50 relative z-10">
  <div className="group flex gap-12 w-max animate-marquee hover:[animation-play-state:paused]">
    {[...trustMarqueeData, ...trustMarqueeData, ...trustMarqueeData, ...trustMarqueeData].map((item, i) => (
      <div key={i} className="flex items-center gap-4 px-8 text-xl font-display font-bold tracking-tight">
        <span className="text-teal-400 text-2xl">{item.icon}</span>
        <span className="whitespace-nowrap">{item.text}</span>
      </div>
    ))}
  </div>
</section>


    {/* 🔥 ABOUT (STORY + IMAGE REVEAL) */}
<section id="about" ref={aboutRef} className="py-12 md:py-16 bg-[#ECFEFF] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">

    {/* 🧑‍⚕️ LEFT IMAGE */}
  <div className="relative flex justify-center items-center md:block">
  <div className="about-img w-60 h-60 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl items-center transition-all duration-700">
    <img
      src={docai}
      className="w-full h-full object-cover"
      alt="About Doctor"
      loading="lazy"
    />
  </div>

  {/* floating badge */}
  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 bg-teal-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
    10+ Years Experience
  </div>
</div>
    {/* 📖 RIGHT STORY */}
    <div className="space-y-6">
      <p className="about-line text-teal-600 font-bold tracking-widest uppercase text-xs">
        About Dr. John Doe
      </p>

      <h2 className="about-line text-4xl md:text-5xl text-gray-900 leading-[1.05] font-display font-extrabold tracking-tighter mb-4">
        Caring for Every Patient<br /> <span className="text-teal-700">Like Family.</span>
      </h2>

      <p className="about-line text-gray-600 leading-relaxed font-medium">
        With over a decade of clinical experience, Dr. J. Doe is dedicated to bringing high-quality, compassionate healthcare directly to the community. He began his medical journey serving patients in rural areas, bridging the gap in healthcare accessibility and earning the deep trust of countless families.
      </p>

      <p className="about-line text-gray-600 leading-relaxed font-medium">
        Today, patients travel from across regions—including neighboring states and districts—to seek his expertise. His strong professional network with leading specialists ensures that every patient receives comprehensive and reliable treatment plans.
      </p>

      <p className="about-line text-gray-600 leading-relaxed font-semibold border-l-4 border-teal-500 pl-4 py-1 italic">
        "My philosophy is simple: practical, evidence-based medicine delivered with genuine empathy. Healthcare should be trustworthy, accessible, and centered entirely around the patient's well-being."
      </p>

      <div className="about-line flex items-center gap-4 pt-2">
         <div className="text-sm">
           <p className="font-display font-bold text-gray-900 text-base">Dr. J. Doe</p>
           <p className="text-teal-600 font-medium">Chief Physician & Founder</p>
         </div>
      </div>
    </div>

  </div>
</section>

      {/* 🔥 BOOK */}
<section id="book" className="py-20 bg-[#ECFEFF]">
  <div className="max-w-3xl mx-auto space-y-6 px-4">

    {/* 🔥 AVAILABILITY */}
    <AvailabilityBox />

    {/* 🔥 FORM */}
    <AppointmentForm />

  </div>
</section>

      {/* 🔥 TESTIMONIAL */}
      <FeedbackSection />

      {/* 🔥 FOOTER (UPGRADED) */}
      <footer id="contact" className="bg-teal-900 text-teal-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12 border-b border-teal-800 pb-12">

          {/* Branding & Socials */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-extrabold tracking-tighter text-white mb-2 flex items-center gap-2">
              <span className="text-teal-400">✚</span> CareClinic
            </h3>
            <p className="text-teal-100/80 text-sm leading-relaxed max-w-xs">
              Providing compassionate, evidence-based medical care to the community. Your health and well-being are our highest priority.
            </p>
            <div className='flex items-center gap-4 pt-2'>
              <a href="#home" className="hover:opacity-80 transition-opacity"><img src={wplogo} alt="WhatsApp" loading="lazy" className="w-8 h-8 rounded-full" /></a>
              <a href="#home" className="hover:opacity-80 transition-opacity"><img src={iglogo} alt="Instagram" loading="lazy" className="w-8 h-8 rounded-full" /></a>
              <a href="#home" className="hover:opacity-80 transition-opacity"><img src={fblogo} alt="Facebook" loading="lazy" className="w-8 h-8 rounded-full" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <div className='flex flex-col space-y-3 text-teal-100/80 text-sm'>
              <a href="#home" className="hover:text-white transition-colors w-fit">Home</a>
              <a href="#services" className="hover:text-white transition-colors w-fit">Our Services</a>
              <a href="#about" className="hover:text-white transition-colors w-fit">About Doctor</a>
              <a href="#book" className="hover:text-white transition-colors w-fit">Book Appointment</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Our Services</h4>
            <div className='flex flex-col space-y-3 text-teal-100/80 text-sm'>
              <span className="cursor-default">General Consultation</span>
              <span className="cursor-default">Pediatric Care</span>
              <span className="cursor-default">Vaccination & Immunization</span>
              <span className="cursor-default">Hypertension Management</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <div className="space-y-4 text-teal-100/80 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-teal-400 text-lg">📍</span>
                <div>
                  <p className="font-medium text-white">CareClinic</p>
                  <p>123 Medical Boulevard,</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-400 text-lg">📞</span>
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <span className="text-teal-400 text-lg">🕒</span>
                <div>
                   <p className="text-white font-medium">Clinic Hours:</p>
                   <p>Mon - Sun: 6:00 AM - 10:00 PM</p>
                   <p className="text-teal-300 text-xs mt-1">24/7 Emergency Support Available</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 text-teal-100/60 text-xs'>
          <p>Copyright © {new Date().getFullYear()} CareClinic®. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}