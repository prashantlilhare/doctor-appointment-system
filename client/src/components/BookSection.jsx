import React from 'react';
import AvailabilityBox from './AvailabilityBox.jsx';
import AppointmentForm from './AppointmentForm.jsx';

export default function BookSection() {
  return (
    <section id="book" className="py-12 lg:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-2">Book A Visit</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            Schedule Your Appointment
          </h2>
          <p className="text-gray-500 text-base">
            Choose a suitable time and fill in your details. You will receive an immediate confirmation.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-6 lg:gap-12 items-start max-w-5xl mx-auto">
          {/* Left Column: Schedule Information */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <AvailabilityBox />
            
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm text-center lg:text-left">
               <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-center lg:justify-start gap-2">
                 <span className="text-[#0062FF]">🚨</span> Urgent Needs?
               </h4>
               <p className="text-gray-500 text-sm mb-4">If this is a severe medical emergency, please contact me immediately.</p>
               <a href="tel:+15551234567" className="block text-center bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">
                 Call +1 (555) 123-4567
               </a>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div>
            <AppointmentForm />
          </div>
        </div>

      </div>
    </section>
  );
}
