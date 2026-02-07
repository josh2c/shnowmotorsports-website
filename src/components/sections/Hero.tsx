"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { basePath } from "@/lib/base-path";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const cellStyle = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transitionDelay: `${delay}ms`,
  });

  return (
    <section className="min-h-screen overflow-hidden">
      {/* Bento grid — gap-px with border-colored bg creates thin cell borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1.6fr] lg:grid-rows-2 min-h-screen gap-px bg-[var(--border)]">

        {/* ─── Top-left: Dion portrait ─── */}
        <div
          className="relative bg-black overflow-hidden min-h-[280px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(0)}
        >
          <Image
            src={`${basePath}/images/hero/dion.webp`}
            alt="Dion Dawkins — Shnow Motorsports"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
          />
        </div>

        {/* ─── Top-middle: Motivational quote ─── */}
        <div
          className="bg-black p-8 md:p-10 flex flex-col items-center justify-center min-h-[280px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(100)}
        >
          <p className="text-[var(--muted-foreground)] text-base leading-relaxed mb-6 max-w-xs text-center">
            At Shnow Motorsports, we live for the thrill of the challenge. With
            NFL athlete Dion Dawkins at the helm, we&apos;re a drift team that
            doesn&apos;t just compete &mdash; we dominate.
          </p>
        </div>

        {/* ─── Top-right: Drift car ─── */}
        <div
          className="relative bg-black overflow-hidden min-h-[280px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(200)}
        >
          <Image
            src={`${basePath}/images/hero/car.webp`}
            alt="Shnow Motorsports drift car"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            priority
          />
        </div>

        {/* ─── Bottom-left: Bold punchy tagline ─── */}
        <div
          className="bg-black p-8 md:p-10 flex items-end min-h-[300px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(300)}
        >
          <h1 className="font-[family-name:var(--font-oswald)] text-5xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.95] text-white">
            BURN
            <br />
            RUBBER &
            <br />
            MAKE
            <br />
            MOVES
          </h1>
        </div>

        {/* ─── Bottom-middle: Shnow stickers/logos ─── */}
        <div
          className="relative bg-black overflow-hidden min-h-[300px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(400)}
        >
          <Image
            src={`${basePath}/images/hero/stickers.png`}
            alt="Shnow Motorsports logos"
            fill
            className="object-contain object-center p-6"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 35vw"
          />
        </div>

        {/* ─── Bottom-right: Large serif italic overflow text ─── */}
        <div
          className="bg-black p-8 lg:p-12 flex items-center min-h-[300px] lg:min-h-0 transition-all duration-700 ease-out"
          style={cellStyle(500)}
        >
          <div>
            <p className="font-[family-name:var(--font-platinum-sign)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-white leading-[1.15]">
              <span className="block whitespace-nowrap">
                A drift ain&apos;t a drift
              </span>
              <span className="block whitespace-nowrap">
                till the tires hit.
              </span>
            </p>
            {/* Red underline accent */}
            <div className="mt-3 w-2/3 h-[2px] bg-[var(--accent-red)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
