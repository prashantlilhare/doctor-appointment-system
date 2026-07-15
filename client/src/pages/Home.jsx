import React from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import StatsSection from '../components/StatsSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import DoctorSection from '../components/DoctorSection.jsx';
import BookSection from '../components/BookSection.jsx';
import FeedbackSection from '../components/FeedbackSection.jsx';
import ContactSection from '../components/ContactSection.jsx';
import TrustMarquee from '../components/TrustMarquee.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <DoctorSection />
      <BookSection />
      <div className="bg-[#F8FAFC]">
        <FeedbackSection />
      </div>
      <ContactSection />
      <TrustMarquee />
      <Footer />
    </div>
  );
}