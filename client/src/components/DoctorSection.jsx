import React from 'react';
import docai from '../assets/doc-ai.webp';

export default function DoctorSection() {
  return (
    <section id="about" className="py-12 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Image */}
        <div className="relative order-2 lg:order-1 hidden lg:flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-0 bg-[#0062FF] rounded-[24px] rotate-[-2deg] opacity-10"></div>
            <img 
              src={docai} 
              alt="Dr. S. Lilhare" 
              className="relative z-10 rounded-[24px] shadow-lg object-cover w-full h-[450px]"
            />
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="order-1 lg:order-2">
          <div className="mb-6">
            <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-2">About The Doctor</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Dr. S. Lilhare
            </h2>
            <p className="text-lg text-gray-600 mt-1 font-medium">General Physician</p>
          </div>

          <div className="space-y-4 text-gray-600 leading-relaxed text-base">
            <p>
              With over 15 years of clinical experience, Dr. S. Lilhare is a highly dedicated General Physician committed to offering honest, accessible, and high-quality medical care.
            </p>
            <p>
              Understanding the challenges faced by patients in nearby villages who cannot easily travel to a clinic, Dr. Lilhare specializes in providing comprehensive consultation and treatment through personalized home visits.
            </p>
            <p>
              This patient-first approach ensures that quality healthcare reaches those who need it most, directly at their doorstep.
            </p>
          </div>

          <div className="mt-8 flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-sm">15+ Years Exp.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-sm">Home Visit Service</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
