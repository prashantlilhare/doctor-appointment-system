import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-number").forEach(el => {
        const targetStr = el.getAttribute("data-value");
        const num = parseInt(targetStr.replace(/[^0-9]/g, ""), 10) || 0;
        const suffix = targetStr.replace(/[0-9]/g, "");
        
        let obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 2.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 90%",
          },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val) + suffix;
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="px-4 py-8 md:py-10 bg-white relative z-10 border-b border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-2 md:gap-6 text-center divide-x divide-gray-100">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0062FF] stat-number" data-value="2500+">0</h2>
          <p className="text-[10px] md:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">Patients</p>
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0062FF] stat-number" data-value="98%">0%</h2>
          <p className="text-[10px] md:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">Satisfaction</p>
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#0062FF]">24/7</h2>
          <p className="text-[10px] md:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">Support</p>
        </div>
      </div>
    </section>
  );
}
