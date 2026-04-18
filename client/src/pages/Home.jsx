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
import sovindpfp from '../assets/sovind-pfp.png';
import sovindabout from '../assets/sovind-about.png';
import fblogo from '../assets/fb-logo.png';
import wplogo from '../assets/wp-logo.png';
import iglogo from '../assets/ig-logo.png';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  { title: "General Checkup", icon: "🩺", bg: "bg-blue-50", text: "text-blue-600" },
  { title: "BP Check", icon: "💓", bg: "bg-red-50", text: "text-red-500" },
  { title: "Fever", icon: "🤒", bg: "bg-yellow-50", text: "text-yellow-600" },
  { title: "Emergency", icon: "🚑", bg: "bg-red-100", text: "text-red-600" },
  { title: "Child Care", icon: "👶", bg: "bg-pink-50", text: "text-pink-500" },
  { title: "Home Visit", icon: "🏠", bg: "bg-green-50", text: "text-green-600" },
  { title: "Injection", icon: "💉", bg: "bg-purple-50", text: "text-purple-600" },
  { title: "Consultation", icon: "📋", bg: "bg-teal-50", text: "text-teal-600" },
];

const servicesDataReverse = [...servicesData].reverse();

const stats = [
  { value: '2,500+', label: 'Patients Served' },
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

    // 🔢 COUNT (SMOOTHER)
    gsap.fromTo(".stat-number",
      { innerText: 0 },
      {
        innerText: (i, el) => el.getAttribute("data-value"),
        duration: 2.5,
        snap: { innerText: 1 },
        ease: "power1.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 90%",
        },
      }
    );
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
    />
    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-teal-800/70 to-cyan-900/80" />
  </div>

  {/* glass glow */}
  <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>

  <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center text-white">

    {/* LEFT */}
    <div>
      <p className="text-white/70 font-medium mb-3 tracking-wide">
        Trusted  Doctor
      </p>

      <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
        Smart Healthcare <br />
        <span className="text-teal-300">At Your Doorstep</span>
      </h1>

      <p className="text-white/70 mb-8 max-w-md">
        Book, track & get treatment — simple and fast.
      </p>

      <div className="flex flex-wrap gap-3">

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

        <a href="tel:+9302754600"
          className="pulse-urgent bg-red-500 px-6 py-3 rounded-full font-semibold shadow">
          🚨 Emergency
        </a>
      </div>
    </div>

    {/* RIGHT CARD */}
    <div className="flex justify-center relative">

      <div className="absolute -top-5 right-10 bg-white text-gray-700 px-4 py-1 rounded-full text-xs shadow">
        🟢 Available Today
      </div>

      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 w-80 shadow-2xl border border-white/20 hover:scale-105 transition">

        <div className="flex flex-col items-center text-center text-white">

          <img
            src={(sovindpfp)}
            className="w-24 h-24 rounded-full mb-4 border-4 border-white/30"
          />

          <h3 className="text-lg font-semibold">Dr. Sovind</h3>
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
      <h2 className="text-3xl font-bold text-teal-600 stat-number" data-value="2500">0</h2>
      <p className="text-sm text-gray-500">Patients</p>
    </div>

    <div>
      <h2 className="text-3xl font-bold text-teal-600 stat-number" data-value="98">0</h2>
      <p className="text-sm text-gray-500">Satisfaction %</p>
    </div>

    <div>
      <h2 className="text-3xl font-bold text-teal-600">24/7</h2>
      <p className="text-sm text-gray-500">Support</p>
    </div>

  </div>
</section>


{/* 🔥 SERVICES (INFINITE + PREMIUM UI) */}
<section id="services" className="py-20 overflow-hidden bg-[#ecfeff]">
  <h2 className="text-center text-3xl font-display mb-12">Our Services</h2>

  <div className="space-y-8">

{/* ROW 1 → LEFT TO RIGHT */}
<div className="group flex gap-6 w-max animate-marquee hover:[animation-play-state:paused]">

  {[...servicesData, ...servicesData].map((item, i) => (
    <div key={i}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-xl border border-white/30
      ${item.bg} ${item.text}
      transition duration-300
      group-hover:opacity-40 hover:!opacity-100 hover:scale-110 hover:z-10`}>

      <span className="text-xl">{item.icon}</span>
      <span className="font-medium whitespace-nowrap">{item.title}</span>
    </div>
  ))}
</div>


{/* ROW 2 → RIGHT TO LEFT 🔥 */}
<div className="group flex gap-6 w-max animate-marquee-reverse hover:[animation-play-state:paused]">

  {[...servicesDataReverse, ...servicesDataReverse].map((item, i) => (
    <div key={i}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-xl border border-white/30
      ${item.bg} ${item.text}
      transition duration-300
      group-hover:opacity-40 hover:!opacity-100 hover:scale-110 hover:z-10`}>

      <span className="text-xl">{item.icon}</span>
      <span className="font-medium whitespace-nowrap">{item.title}</span>
    </div>
  ))}
</div>

  </div>
</section>


    {/* 🔥 ABOUT (STORY + IMAGE REVEAL) */}
<section id="about" ref={aboutRef} className="py-10 bg-[#ECFEFF] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

    {/* 🧑‍⚕️ LEFT IMAGE */}
  <div className="relative flex justify-center items-center md:block">
  <div className="about-img w-60 h-60 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl items-center transition-all duration-700">
    <img
      src={sovindabout}
      className="w-full h-full object-cover"
    />
  </div>

  {/* floating badge */}
  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 bg-teal-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
    10+ Years Experience
  </div>
</div>
    {/* 📖 RIGHT STORY */}
    <div className="space-y-4">
      <p className="about-line text-teal-600 text-4xl font-semibold tracking-wide">
        About Doctor
      </p>

      <h2 className="about-line  text-3xl md:text-4xl text-gray-800 leading-tight font-serif ">
        Caring for Every Patient,<br /> Like Family
      </h2>

      <p className="about-line text-gray-700 font-culpea "> <i>
       With over 10 years of medical experience, Dr. S.R. Lilhare began his journey by serving patients in rural areas where access to healthcare was limited. Through dedication and compassionate care, he earned the trust of people across nearby villages.
      </i></p>

      <p className="about-line text-gray-700">
  <i> Over time, his reputation grew, and today patients visit him not only locally but also from regions like Chhattisgarh, Nagpur, Gondia, and surrounding areas. He has strong professional connections with medical representatives and specialists, ensuring well-informed and reliable treatment. </i>
      </p>

      <p className="about-line text-gray-700"> <i>
    Dr. Sovind Ram Lilhare is known for his practical approach in treating common illnesses and his commitment to providing trustworthy and accessible healthcare to every patient. </i>
      </p>

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
      <footer id="contact" className="bg-teal-900 text-white  px-10 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-semibold mb-3">SovindCare</h3>
            <p className="text-gray-400 text-sm">Trusted healthcare for every home.</p>
           <div className='flex items-center gap-5'>
            {/* wp */}
             <div className=' rounded-full w-10 h-10 flex items-center justify-center mt-4'>
              <a href="#home"><img src={wplogo} alt="" />
            </a>
            </div>
            {/* fb */}
            <div className='rounded-full w-12 h-12 flex items-center justify-center mt-4'>
              <a href="#home">
              <img src={iglogo} alt="" />
            </a>
            </div>

            {/* ig */}
            <div className='rounded-full w-10 h-10 flex items-center justify-center mt-4'>
              <a href="#home">
              <img src={fblogo} alt="" />
            </a>
            </div>
           </div>
          </div>

          <div className='flex flex-col' >
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#services">Service</a>
            <a href="#about">About</a>
            
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p>📞 9755277464</p>
            <p>📍 Village Bagadara ,</p>
            <p className='ml-6'>Ward no. 05</p>
            <p className='ml-6'>Balaghat</p>
          </div>

        </div>
        <div className='flex items-center justify-center mt-20 -mb-10' >
          <p>Copyright © 2026 All Rights Reserved by SovindCare®</p>
        </div>
      </footer>
    </div>
  );
}