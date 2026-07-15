import React from 'react';

const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Experienced Care",
    desc: "Over 10 years of clinical excellence."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Easy Appointment Booking",
    desc: "Book online in seconds, hassle-free."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Personalized Treatment",
    desc: "Healthcare tailored to your unique needs."
  }
];

export default function QuickTrustSection() {
  return (
    <section className="py-12 bg-white relative z-20 -mt-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FF] text-[#0062FF] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
