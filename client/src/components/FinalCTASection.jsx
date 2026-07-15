import React from 'react';
import docai from '../assets/doc-ai.webp';

export default function FinalCTASection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0062FF] rounded-[40px] overflow-hidden flex flex-col md:flex-row items-center shadow-[0_20px_50px_rgba(0,98,255,0.2)]">
          
          <div className="p-12 md:p-16 flex-1 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Your Health Deserves <br/> Expert Care.
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-md mx-auto md:mx-0">
              Take the first step towards a healthier life. Schedule your consultation with Dr. John Doe today and experience medical care that puts you first.
            </p>
            <button 
              onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-[#0062FF] font-extrabold text-lg px-10 py-5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Book Your Appointment
            </button>
          </div>

          <div className="hidden md:block w-[400px] h-[450px] relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0062FF] z-10"></div>
            <img src={docai} alt="Doctor CTA" className="w-full h-full object-cover object-top opacity-90"/>
          </div>

        </div>
      </div>
    </section>
  );
}
