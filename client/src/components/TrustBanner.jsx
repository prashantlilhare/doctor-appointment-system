import React from 'react';

export default function TrustBanner() {
  return (
    <section className="py-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 opacity-80">
         <div className="flex items-center gap-2 font-medium text-gray-600 text-sm"><span className="text-[#0062FF] text-lg">⚕️</span> Verified Medical Practice</div>
         <div className="flex items-center gap-2 font-medium text-gray-600 text-sm"><span className="text-[#0062FF] text-lg">🏆</span> 10+ Years Excellence</div>
         <div className="flex items-center gap-2 font-medium text-gray-600 text-sm"><span className="text-[#0062FF] text-lg">🤝</span> Community Trusted</div>
      </div>
    </section>
  );
}
