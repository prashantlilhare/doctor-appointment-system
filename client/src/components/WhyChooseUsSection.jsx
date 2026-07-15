import React from 'react';

const features = [
  {
    title: "Patient-First Approach",
    desc: "Your health is the priority. I ensure dedicated consultation time for every patient.",
  },
  {
    title: "Honest & Transparent",
    desc: "Clear communication regarding your health, diagnosis, and treatment options.",
  },
  {
    title: "Accessible Care",
    desc: "Providing reliable medical care to those who need it, including remote areas.",
  },
  {
    title: "Experienced Practice",
    desc: "Over 15 years of diagnosing and treating a wide variety of medical conditions.",
  }
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-[#0062FF] font-bold tracking-wider uppercase text-sm mb-2">Why Choose Me</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Healthcare Built on <br className="hidden sm:block"/> Trust & Empathy.
            </h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              I believe that going to the doctor shouldn't be stressful. My goal is to provide expert medical care in a comfortable, honest, and highly professional manner.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="bg-[#F8FAFC] p-5 rounded-[20px] border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#EBF3FF] text-[#0062FF] flex items-center justify-center mb-3">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{feat.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
             <div className="bg-[#0062FF] rounded-[32px] p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 relative z-10">Don't Delay Your Health.</h3>
                <p className="text-blue-100 mb-8 relative z-10 text-sm sm:text-base leading-relaxed">
                  Early diagnosis and proper treatment are the keys to a fast recovery. Schedule your consultation today.
                </p>
                <button 
                  onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
                  className="relative z-10 bg-white text-[#0062FF] font-bold text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                >
                  Book Appointment Now
                </button>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
