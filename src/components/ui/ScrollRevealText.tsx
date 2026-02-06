"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({
  text,
  className,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const words = text.split(" ");

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    registerGSAPPlugins();

    const wordEls = containerRef.current.querySelectorAll(".reveal-word");

    const ctx = gsap.context(() => {
      gsap.set(wordEls, { opacity: 0.15 });

      gsap.to(wordEls, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, words.length]);

  return (
    <div ref={containerRef} className={className}>
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug tracking-tight">
        {words.map((word, i) => (
          <span
            key={i}
            className="reveal-word inline-block mr-[0.3em]"
            style={{ opacity: reducedMotion ? 1 : undefined }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
