"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import Button from "@/components/ui/Button";
import GameModal from "@/components/game/GameModal";

const CarPreview = dynamic(() => import("@/components/game/CarPreview"), {
  ssr: false,
});

export default function Game() {
  const [gameOpen, setGameOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Animate popup in/out
  useEffect(() => {
    if (!menuRef.current || !backdropRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        menuRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ESC to close menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handlePlay = () => {
    setMenuOpen(false);
    setGameOpen(true);
  };

  const handleCloseMenu = () => {
    if (!menuRef.current || !backdropRef.current) {
      setMenuOpen(false);
      return;
    }
    gsap.to(menuRef.current, {
      y: 20,
      opacity: 0,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setMenuOpen(false),
    });
  };

  return (
    <>
      {/* Fixed clickable car — opens drift game menu */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed bottom-6 right-6 z-[100] cursor-pointer bg-transparent border-none p-0 group"
        aria-label="Open drift game menu"
      >
        <CarPreview />
      </button>

      {/* Drift menu popup */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-6">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0"
            onClick={handleCloseMenu}
          />

          {/* Popup card */}
          <div
            ref={menuRef}
            className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-lg p-8 md:p-10 opacity-0"
            role="dialog"
            aria-modal="true"
            aria-label="Drift game menu"
          >
            {/* Close button */}
            <button
              onClick={handleCloseMenu}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            </button>

            {/* Content */}
            <p className="text-sm tracking-[0.3em] uppercase text-[var(--accent-red)] font-semibold mb-3">
              The Game
            </p>
            <h2 className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase mb-4">
              Think You
              <br />
              Can Drift?
            </h2>
            <p className="text-[var(--muted-foreground)] text-base md:text-lg mb-4">
              Prove it. Take the wheel in our arcade drift challenge. Rack up
              style points, chain combos, and set the high score.
            </p>

            {/* Controls info */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">
                  Arrow Keys
                </kbd>
                <span>Steer</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">
                  Space
                </kbd>
                <span>Drift</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">
                  60s
                </kbd>
                <span>On the clock</span>
              </div>
            </div>

            {/* Play button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handlePlay}
            >
              Play Now
            </Button>
          </div>
        </div>
      )}

      <GameModal open={gameOpen} onClose={() => setGameOpen(false)} />
    </>
  );
}
