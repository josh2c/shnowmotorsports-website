"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { shopItems } from "@/lib/site-data";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function Shop() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    registerGSAPPlugins();

    const ctx = gsap.context(() => {
      gsap.from(".shop-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="shop" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Gear Up" subtitle="Rep the crew." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {shopItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shop-card group block"
            >
              <div className="aspect-square rounded-lg bg-[var(--muted)] border border-white/5 overflow-hidden mb-3 relative">
                {/* Placeholder — replace with real product images */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                  <span className="text-4xl text-white/10 font-bold font-[family-name:var(--font-oswald)] uppercase">
                    {item.name.split(" ").pop()}
                  </span>
                </div>
                <div className="absolute inset-0 bg-[var(--accent-red)]/0 group-hover:bg-[var(--accent-red)]/10 transition-colors duration-300" />
              </div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {item.price}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Button href="#" variant="outline" size="lg" target="_blank" rel="noopener noreferrer">
            Visit Store
          </Button>
        </div>
      </div>
    </section>
  );
}
