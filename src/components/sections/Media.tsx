"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  {
    title: "First Drift Session",
    description: "Where it all started — raw power on asphalt.",
    color: "from-red-900/40 to-black",
  },
  {
    title: "Team Formation",
    description: "Bringing together the best in the game.",
    color: "from-orange-900/40 to-black",
  },
  {
    title: "Competition Day",
    description: "Precision under pressure. No second chances.",
    color: "from-zinc-800/60 to-black",
  },
  {
    title: "Behind the Scenes",
    description: "The work nobody sees. The grind that builds champions.",
    color: "from-red-950/40 to-black",
  },
  {
    title: "Victory Lap",
    description: "When preparation meets opportunity.",
    color: "from-amber-900/30 to-black",
  },
];

export default function Media() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !scrollRef.current || !sectionRef.current) return;

    registerGSAPPlugins();

    const ctx = gsap.context(() => {
      const cards = scrollRef.current!.querySelectorAll(".media-card");
      gsap.from(cards, {
        scale: 0.9,
        opacity: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top 10%",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="media"
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
    >
      <div className="px-6 max-w-7xl mx-auto">
        <SectionHeading
          title="Highlights"
          subtitle="The moments that define us."
        />
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 pb-4"
      >
        {/* Left spacer for centering on desktop */}
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2)] hidden xl:block" />

        {highlights.map((item) => (
          <div
            key={item.title}
            className="media-card flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] snap-center"
          >
            <div
              className={`aspect-[16/10] rounded-lg bg-gradient-to-br ${item.color} border border-white/5 flex items-end p-6 md:p-8 relative overflow-hidden group cursor-pointer`}
            >
              {/* Placeholder visual — grid pattern */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

              <div className="relative z-10">
                <h3 className="font-[family-name:var(--font-oswald)] text-xl md:text-2xl font-bold uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/60 max-w-xs">
                  {item.description}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[var(--accent-red)]/0 group-hover:bg-[var(--accent-red)]/10 transition-colors duration-500" />
            </div>
          </div>
        ))}

        {/* Right spacer */}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  );
}
