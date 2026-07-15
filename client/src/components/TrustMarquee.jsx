import React from 'react';

const trustMarqueeData = [
  { text: "2500+ Happy Patients", icon: "⭐" },
  { text: "Home Visit Available", icon: "🏡" },
  { text: "Emergency Care", icon: "🚨" },
  { text: "15+ Years Experience", icon: "🩺" }
];

export default function TrustMarquee() {
  return (
    <section className="py-8 bg-[#0062FF] overflow-hidden text-white relative z-10">
      <div className="group flex gap-12 w-max animate-marquee hover:[animation-play-state:paused]">
        {[...trustMarqueeData, ...trustMarqueeData, ...trustMarqueeData, ...trustMarqueeData].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8 text-lg font-bold tracking-tight">
            <span className="text-xl">{item.icon}</span>
            <span className="whitespace-nowrap">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
