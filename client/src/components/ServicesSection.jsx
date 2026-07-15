import React, { useState } from 'react';

const servicesData = [
  {
    title: "General Consultation",
    desc: "Comprehensive checkups and initial medical assessments for overall health.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    title: "Fever & Infection Treatment",
    desc: "Accurate diagnosis and rapid medical treatment for viral or bacterial infections.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )
  },
  {
    title: "Blood Pressure Management",
    desc: "Routine monitoring and medication management to maintain stable blood pressure.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Diabetes Consultation",
    desc: "Guidance on diet, medication, and lifestyle for managing blood sugar levels.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C12 2 6 8.582 6 13a6 6 0 1012 0c0-4.418-6-11-6-11z" />
      </svg>
    )
  },
  {
    title: "Home Visit Consultation",
    desc: "Convenient medical checkups provided directly at your home in nearby villages.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    title: "Injection & Dressing",
    desc: "Safe administration of prescribed injections and professional wound dressing.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    title: "Minor Illness Treatment",
    desc: "Effective care for colds, coughs, stomach issues, and other common illnesses.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Follow-up Care",
    desc: "Continuous health monitoring to ensure you are recovering properly.",
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
];

export default function ServicesSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="services" className="py-12 lg:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-2">Medical Services</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            How I Can Help You
          </h2>
          <p className="text-gray-500 text-base">
            Providing reliable and accessible healthcare services tailored for your everyday medical needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {servicesData.map((item, i) => (
            <div 
              key={i} 
              onClick={() => toggleExpand(i)}
              className="bg-white p-4 sm:p-6 rounded-[16px] sm:rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#EBF3FF] text-[#0062FF] rounded-full flex items-center justify-center mb-3 sm:mb-4 shrink-0 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
              <p className={`text-gray-500 text-xs sm:text-sm leading-relaxed transition-all duration-300 ${expandedIndex === i ? '' : 'line-clamp-2'}`}>
                {item.desc}
              </p>
              
              <div className={`mt-2 text-[#0062FF] text-xs font-semibold sm:hidden ${expandedIndex === i ? 'hidden' : 'block'}`}>
                Tap to read more
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
