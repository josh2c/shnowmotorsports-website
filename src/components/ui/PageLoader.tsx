"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => setLoading(false), 600);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-600",
        hiding && "opacity-0"
      )}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/images/brand/logo.png"
          alt="Shnow Motorsports"
          width={200}
          height={50}
          className="object-contain"
          priority
        />
        <div className="mt-4 w-24 h-0.5 bg-[var(--border)] mx-auto overflow-hidden rounded-full">
          <div className="h-full bg-[var(--accent-red)] animate-[loader_0.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
