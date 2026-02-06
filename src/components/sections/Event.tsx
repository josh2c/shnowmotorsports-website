"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { eventDetails } from "@/lib/site-data";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Button from "@/components/ui/Button";

export default function Event() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    registerGSAPPlugins();

    const ctx = gsap.context(() => {
      gsap.from(".event-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="event"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--muted)] to-[var(--background)]" />

      {/* Top/bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-red)]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-red)]/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center event-content">
        <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent-red)] font-semibold mb-4">
          Upcoming Event
        </p>

        <h2 className="font-[family-name:var(--font-oswald)] text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight uppercase mb-6">
          {eventDetails.name}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[var(--muted-foreground)] text-lg mb-12">
          <span>{eventDetails.displayDate}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>{eventDetails.displayTime}</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span>{eventDetails.venue}</span>
        </div>

        <div className="mb-12">
          <CountdownTimer targetDate={eventDetails.date} />
        </div>

        {eventDetails.description && (
          <p className="text-[var(--muted-foreground)] text-lg max-w-xl mx-auto mb-10">
            {eventDetails.description}
          </p>
        )}

        <Button href={eventDetails.ticketUrl || "#"} variant="primary" size="lg">
          Get Tickets
        </Button>
      </div>
    </section>
  );
}
