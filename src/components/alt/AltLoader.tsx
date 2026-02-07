"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { basePath } from "@/lib/base-path";

const ALT_RED = "#ff2d2d";
const ALT_BG = "#d5d0c4";

// Tach gauge config
const START_ANGLE = -225; // 7 o'clock position
const END_ANGLE = 45;     // 5 o'clock position
const TOTAL_SWEEP = END_ANGLE - START_ANGLE; // 270 degrees
const REDLINE_FRACTION = 0.82;
const TICK_COUNT = 9;

export default function AltLoader() {
  const [loading, setLoading] = useState(true);
  const [hiding, setHiding] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setLoading(false);
      return;
    }

    const startTime = Date.now();
    const duration = 2200;

    let wobble = 0;
    let wobbleVel = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Aggressive full-send revving:
      // Phase 1 (0-5%): Quick crank blip
      // Phase 2 (5-10%): Barely settle — foot already on gas
      // Phase 3 (10-45%): FULL THROTTLE 1st gear — ripping through RPMs
      // Phase 4 (45-50%): Quick gear shift snap
      // Phase 5 (50-78%): 2nd gear FULL SEND — screaming to redline
      // Phase 6 (78-100%): Slamming the rev limiter repeatedly

      let target: number;

      if (t < 0.05) {
        // Quick crank
        const sub = t / 0.05;
        target = sub * 0.15;
      } else if (t < 0.10) {
        // Barely settle — foot already mashing gas
        const sub = (t - 0.05) / 0.05;
        target = 0.15 - sub * 0.03;
      } else if (t < 0.45) {
        // 1st gear FULL THROTTLE — aggressive pull
        const sub = (t - 0.10) / 0.35;
        const curve = sub * sub * sub; // cubic — explosive acceleration
        target = 0.12 + curve * 0.53; // ripping to ~5200 RPM
      } else if (t < 0.50) {
        // Gear shift — quick snap down
        const sub = (t - 0.45) / 0.05;
        const dip = Math.sin(sub * Math.PI) * 0.08;
        target = 0.65 - dip;
      } else if (t < 0.78) {
        // 2nd gear FULL SEND
        const sub = (t - 0.50) / 0.28;
        const curve = sub * sub; // quadratic
        target = 0.57 + curve * 0.38; // screaming to redline
      } else {
        // BOUNCING OFF REV LIMITER — aggressive rapid cuts
        const sub = (t - 0.78) / 0.22;
        const limiterBounce = Math.sin(sub * Math.PI * 10) * 0.03;
        target = 0.95 + limiterBounce;
      }

      // Needle inertia — stiffer spring for snappier response
      const diff = target - wobble;
      wobbleVel += diff * 0.18;
      wobbleVel *= 0.78;
      wobble += wobbleVel;

      // Vibration increases with RPM
      const vibration = wobble > 0.3
        ? (Math.random() - 0.5) * 0.006 * wobble
        : 0;

      setProgress(Math.max(0, wobble + vibration));

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(0.96);
        setTimeout(() => {
          setHiding(true);
          setTimeout(() => setLoading(false), 500);
        }, 200);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!loading) return null;

  const needleAngle = START_ANGLE + progress * TOTAL_SWEEP;
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500",
        hiding && "opacity-0"
      )}
      style={{ backgroundColor: ALT_BG }}
    >
      <div className="flex flex-col items-center">
        {/* Tachometer SVG */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full"
          style={{
            boxShadow: "0 0 60px rgba(255,45,45,0.12), 0 0 120px rgba(255,45,45,0.06)",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Outer ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={ALT_RED}
              strokeWidth="1"
              opacity="0.2"
            />

            {/* Tick marks */}
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const fraction = i / (TICK_COUNT - 1);
              const angle = START_ANGLE + fraction * TOTAL_SWEEP;
              const rad = (angle * Math.PI) / 180;
              const isInRedzone = fraction >= REDLINE_FRACTION;
              const innerR = 70;
              const outerR = 85;

              return (
                <g key={i}>
                  <line
                    x1={100 + innerR * Math.cos(rad)}
                    y1={100 + innerR * Math.sin(rad)}
                    x2={100 + outerR * Math.cos(rad)}
                    y2={100 + outerR * Math.sin(rad)}
                    stroke={ALT_RED}
                    strokeWidth={isInRedzone ? "2.5" : "1.5"}
                    opacity={isInRedzone ? 1 : 0.4}
                  />
                  <text
                    x={100 + 60 * Math.cos(rad)}
                    y={100 + 60 * Math.sin(rad)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={ALT_RED}
                    opacity={isInRedzone ? 1 : 0.4}
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight={isInRedzone ? "bold" : "normal"}
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Minor tick marks */}
            {Array.from({ length: (TICK_COUNT - 1) * 4 }).map((_, i) => {
              const fraction = i / ((TICK_COUNT - 1) * 4);
              const angle = START_ANGLE + fraction * TOTAL_SWEEP;
              const rad = (angle * Math.PI) / 180;
              const isInRedzone = fraction >= REDLINE_FRACTION;

              if (i % 4 === 0) return null;

              return (
                <line
                  key={`minor-${i}`}
                  x1={100 + 78 * Math.cos(rad)}
                  y1={100 + 78 * Math.sin(rad)}
                  x2={100 + 85 * Math.cos(rad)}
                  y2={100 + 85 * Math.sin(rad)}
                  stroke={ALT_RED}
                  strokeWidth="0.75"
                  opacity={isInRedzone ? 0.6 : 0.2}
                />
              );
            })}

            {/* Redline arc */}
            {(() => {
              const redStart = START_ANGLE + REDLINE_FRACTION * TOTAL_SWEEP;
              const redEnd = END_ANGLE;
              const r = 85;
              const startRad = (redStart * Math.PI) / 180;
              const endRad = (redEnd * Math.PI) / 180;
              const x1 = 100 + r * Math.cos(startRad);
              const y1 = 100 + r * Math.sin(startRad);
              const x2 = 100 + r * Math.cos(endRad);
              const y2 = 100 + r * Math.sin(endRad);
              const largeArc = (redEnd - redStart) > 180 ? 1 : 0;

              return (
                <path
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={ALT_RED}
                  strokeWidth="3"
                  opacity={0.7}
                />
              );
            })()}

            {/* Needle */}
            {(() => {
              const rad = (needleAngle * Math.PI) / 180;
              const tipR = 78;
              const tailR = 12;

              return (
                <line
                  x1={100 - tailR * Math.cos(rad)}
                  y1={100 - tailR * Math.sin(rad)}
                  x2={100 + tipR * Math.cos(rad)}
                  y2={100 + tipR * Math.sin(rad)}
                  stroke={ALT_RED}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              );
            })()}

            {/* Center hub */}
            <circle cx="100" cy="100" r="6" fill={ALT_RED} />
            <circle cx="100" cy="100" r="3" fill={ALT_BG} />

            {/* RPM label */}
            <text
              x="100"
              y="135"
              textAnchor="middle"
              fill={ALT_RED}
              opacity="0.5"
              fontSize="6"
              fontFamily="monospace"
              letterSpacing="0.15em"
            >
              RPM x1000
            </text>
          </svg>
        </div>

        {/* Logo below gauge */}
        <div className="mt-6">
          <Image
            src={`${basePath}/images/brand/logo.png`}
            alt="Shnow Motorsports"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
