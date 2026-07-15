import React, { useState } from 'react';

const faqs = [
  {
    q: "How do I book an appointment?",
    a: "Booking is simple. You can use the 'Book Appointment' form on this website to select your preferred date, or you can call our clinic directly."
  },
  {
    q: "Do you accept walk-in patients?",
    a: "While we prioritize scheduled appointments to ensure minimal waiting times, we do accept walk-ins for urgent non-life-threatening conditions."
  },
  {
    q: "What should I bring to my first visit?",
    a: "Please bring a valid ID, your medical history (if any), and a list of your current medications. If you have previous test results, bringing them is highly recommended."
  },
  {
    q: "Do you offer home visits?",
    a: "Yes, we offer home medical visits for elderly or severely ill patients who cannot travel to the clinic. Please call us to schedule a home visit."
  },
  {
    q: "How do I cancel or reschedule?",
    a: "You can call the clinic or use the 'Track Status' page to manage your appointment using your phone number."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-12 lg:py-24 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-3">FAQ</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-gray-100 rounded-[20px] bg-white overflow-hidden transition-all duration-300 ${openIdx === i ? 'shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'hover:shadow-sm'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIdx === i ? 'text-[#0062FF]' : 'text-gray-900'}`}>
                  {faq.q}
                </span>
                <span className={`transform transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-[#0062FF]' : 'text-gray-400'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`px-8 overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
