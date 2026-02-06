"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { registerGSAPPlugins } from "@/lib/gsap-registry";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    registerGSAPPlugins();

    const ctx = gsap.context(() => {
      gsap.from(".showcase-cell", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-px bg-[var(--border)] border-t border-[var(--border)]">
        {/* Left column — SHOP with two product images, spans both rows */}
        <div className="showcase-cell md:row-span-2 md:col-start-1 md:row-start-1 bg-black overflow-hidden flex flex-col min-h-[400px] md:min-h-[700px]">
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent-red)] font-semibold p-8 pb-4">
            Shop
          </p>
          <div className="flex-1 flex flex-col gap-px bg-[var(--border)]">
            {/* Product 1 — Snowman shirt */}
            <a href="https://shnowstore.com" target="_blank" rel="noopener noreferrer" className="flex-1 relative bg-black flex items-center justify-center p-6 hover:bg-white/5 transition-colors duration-300 cursor-pointer">
              <Image
                src="/images/showcase/snowman-shirt.webp"
                alt="Shnow Cold skull tee"
                width={400}
                height={400}
                className="object-contain max-h-full w-auto"
              />
            </a>
            {/* Product 2 — Helmet shirt */}
            <a href="https://shnowstore.com" target="_blank" rel="noopener noreferrer" className="flex-1 relative bg-black flex items-center justify-center p-6 hover:bg-white/5 transition-colors duration-300 cursor-pointer">
              <Image
                src="/images/showcase/shop-helmet.webp"
                alt="Shnow Motorsports helmet tee design"
                width={400}
                height={400}
                className="object-contain max-h-full w-auto"
              />
            </a>
            {/* Motivational quote */}
            <div className="bg-black p-8 flex items-center justify-center">
              <p className="text-center text-xs md:text-sm tracking-[0.15em] uppercase text-white/70 leading-[2.2] max-w-xs">
                SHOW UP. HIT THE TRACK. PUSH THROUGH THE SMOKE. EXECUTE DAILY. AND
                BURN EVERY CHANCE YOU GET TO ADD UP THE LAPS
              </p>
            </div>
          </div>
        </div>

        {/* Top middle — Who We Are headline */}
        <div className="showcase-cell md:col-start-2 md:row-start-1 bg-black p-8 md:p-10 flex items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent-red)] font-semibold mb-4">
              Who We Are
            </p>
            <h2 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight">
              Built on{" "}
              <span className="text-[var(--accent-red)]">Precision</span>,
              Power, &amp; a Relentless Pursuit of Victory
            </h2>
          </div>
        </div>

        {/* Top right — goggles with snowflakes */}
        <div className="showcase-cell md:col-start-3 md:row-start-1 relative min-h-[250px] md:min-h-0 bg-black overflow-hidden flex items-center justify-center p-8">
          <Image
            src="/images/showcase/goggles.avif"
            alt="Shnow Motorsports snow goggles"
            width={500}
            height={500}
            className="object-contain max-h-full w-auto relative z-10"
          />
          {/* Snowflakes scattered randomly */}
          <span className="absolute top-[4%] left-[6%] text-4xl opacity-30">❄</span>
          <span className="absolute top-[2%] left-[52%] text-3xl opacity-20">❄</span>
          <span className="absolute top-[7%] right-[8%] text-5xl opacity-35">❄</span>
          <span className="absolute top-[22%] left-[82%] text-3xl opacity-15">❄</span>
          <span className="absolute top-[35%] left-[4%] text-4xl opacity-25">❄</span>
          <span className="absolute top-[58%] left-[88%] text-3xl opacity-20">❄</span>
          <span className="absolute top-[70%] left-[12%] text-5xl opacity-30">❄</span>
          <span className="absolute top-[82%] left-[72%] text-4xl opacity-25">❄</span>
          <span className="absolute top-[90%] left-[35%] text-3xl opacity-15">❄</span>
          <span className="absolute top-[45%] left-[92%] text-3xl opacity-20">❄</span>
          <span className="absolute top-[12%] left-[28%] text-4xl opacity-10">❄</span>
          <span className="absolute top-[75%] left-[50%] text-3xl opacity-15">❄</span>
          <span className="absolute top-[88%] left-[8%] text-4xl opacity-20">❄</span>
          <span className="absolute top-[30%] left-[65%] text-3xl opacity-10">❄</span>
          <span className="absolute top-[95%] left-[85%] text-5xl opacity-25">❄</span>
        </div>

        {/* Bottom — video spanning 2 columns (middle + right) */}
        <div className="showcase-cell relative min-h-[300px] md:min-h-0 md:col-span-2 md:col-start-2 bg-black overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/hero/motorvid.webm`} type="video/webm" />
            <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/hero/motorvid.mp4`} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
