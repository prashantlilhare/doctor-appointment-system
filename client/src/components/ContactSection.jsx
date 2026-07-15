import React, { useState, useEffect } from 'react';

export default function ContactSection() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <section id="contact" className="py-12 lg:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

        <div>
          <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-2">Get In Touch</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            I'm Here For You.
          </h2>
          <p className="text-gray-500 text-base mb-10">
            Have a question or need to schedule a home visit? Here is all the information you need to reach me easily.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#0062FF] shrink-0 border border-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Service Area</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Providing home visits and consultations across local villages and surrounding communities.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#0062FF] shrink-0 border border-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Contact Number</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  <a href="tel:+15551234567" className="hover:text-[#0062FF] transition-colors">+1 (555) 123-4567</a><br />
                  <span className="text-gray-400">Available during working hours</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-[#F8FAFC] rounded-full flex items-center justify-center text-[#0062FF] shrink-0 border border-gray-100">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Email Address</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  <a href="mailto:contact@drlilhare.com" className="hover:text-[#0062FF] transition-colors">contact@drlilhare.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Box */}
        <div className="w-full h-[250px] bg-gray-100 rounded-[24px] overflow-hidden shadow-sm border border-gray-200 relative flex items-center justify-center">
          {!isOnline ? (
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium text-sm">Map unavailable offline</p>
            </div>
          ) : (
            <iframe
              title="Clinic Location"
              src="https://maps.google.com/maps?q=21.8093548,80.2365265&hl=en&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="absolute inset-0 z-10"
            ></iframe>
          )}
        </div>

      </div>
    </section>
  );
}
