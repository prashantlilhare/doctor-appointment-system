import React from 'react';
import docai from '../assets/doc-ai.webp';

export default function HeroSection() {
  const handleScrollToBook = () => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0062FF] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-[#0062FF] animate-pulse"></span>
            Accepting Appointments
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
            Expert Medical Care, <br />
            <span className="text-[#0062FF]">Wherever You Are.</span>
          </h1>
          
          <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
            Providing accessible, honest, and high-quality healthcare. Whether in-clinic or at your doorstep in nearby villages, your health is my priority.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleScrollToBook}
              className="bg-[#0062FF] hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Appointment
            </button>
            <button 
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-full text-base font-bold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              Learn More
            </button>
          </div>

          <div className="mt-12 flex flex-row items-center gap-6 sm:gap-8 border-t border-gray-200 pt-8">
             <div className="flex flex-col">
               <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">15+</p>
               <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Years Experience</p>
             </div>
             <div className="w-px h-8 sm:h-10 bg-gray-200"></div>
             <div className="flex flex-col">
               <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-1">
                 <svg className="w-6 h-6 text-[#0062FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                 </svg>
               </p>
               <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Home Visits</p>
             </div>
             <div className="w-px h-8 sm:h-10 bg-gray-200"></div>
             <div className="flex flex-col">
               <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-1">
                 <svg className="w-6 h-6 text-[#0062FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </p>
               <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Trusted Care</p>
             </div>
          </div>
        </div>

        {/* Right Image Composition */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-gray-100 rounded-[24px] overflow-hidden shadow-lg border-4 border-white">
              <img 
                src={docai} 
                alt="Dr. S. Lilhare" 
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-4 sm:-left-12 bg-white p-4 sm:p-5 rounded-[16px] shadow-lg flex items-center gap-3 border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-[#0062FF] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">15+ Experience</p>
                <p className="text-xs font-semibold text-gray-500">Dr. S. Lilhare</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
