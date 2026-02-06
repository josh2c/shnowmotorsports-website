"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units: { label: string; value: string }[] = timeLeft
    ? [
        { label: "Days", value: pad(timeLeft.days) },
        { label: "Hours", value: pad(timeLeft.hours) },
        { label: "Min", value: pad(timeLeft.minutes) },
        { label: "Sec", value: pad(timeLeft.seconds) },
      ]
    : [
        { label: "Days", value: "--" },
        { label: "Hours", value: "--" },
        { label: "Min", value: "--" },
        { label: "Sec", value: "--" },
      ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
          <div className="text-center">
            <div
              className="font-[family-name:var(--font-oswald)] text-4xl sm:text-6xl md:text-7xl font-bold tabular-nums"
              suppressHydrationWarning
            >
              {unit.value}
            </div>
            <div className="mt-2 text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--muted-foreground)]">
              {unit.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="font-[family-name:var(--font-oswald)] text-3xl sm:text-5xl font-light text-white/20 self-start mt-1">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
