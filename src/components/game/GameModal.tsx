"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { useIsMobile, useIsPortrait } from "@/hooks/useIsMobile";
import { useGameStore } from "./GameState";

const DriftGame = dynamic(() => import("./DriftGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-center">
        <p className="font-[family-name:var(--font-oswald)] text-xl font-bold tracking-widest uppercase animate-pulse">
          Loading Game...
        </p>
      </div>
    </div>
  ),
});

interface GameModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GameModal({ open, onClose }: GameModalProps) {
  const webGLSupported = useWebGLSupport();
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  const resetGame = useGameStore((s) => s.resetGame);

  const handleClose = useCallback(() => {
    resetGame();
    onClose();
  }, [resetGame, onClose]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Mobile portrait → orientation gate
  const showOrientationGate = isMobile && isPortrait;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Shnow Drift Game"
    >
      {/* Close button — hidden during orientation gate */}
      {!showOrientationGate && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close game"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>
      )}

      {/* Orientation gate — mobile portrait only */}
      {showOrientationGate && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Rotating phone icon */}
          <div className="mb-8" style={{ animation: "spin-phone 2s ease-in-out infinite" }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="18" y="6" width="28" height="52" rx="4" />
              <rect x="22" y="12" width="20" height="36" rx="1" fill="white" fillOpacity="0.1" />
              <circle cx="32" cy="54" r="2" fill="white" fillOpacity="0.4" />
              <path d="M50 32 C54 20 48 10 38 8" strokeDasharray="4 2" />
              <path d="M38 8 L42 10 L40 14" fill="none" />
            </svg>
          </div>

          <h2 className="font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase tracking-wider mb-3 text-center">
            Rotate Your Phone
          </h2>
          <p className="text-white/50 text-sm text-center mb-8 max-w-xs">
            Turn your device to landscape mode to play Shnow Drift.
          </p>

          <button
            onClick={handleClose}
            className="px-8 py-3 bg-white/10 text-white font-bold uppercase tracking-wider rounded-sm hover:bg-white/20 transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Game content — shown when not gated */}
      {!showOrientationGate && (
        <div className="flex-1">
          {webGLSupported ? (
            <DriftGame />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center px-6">
                <p className="font-[family-name:var(--font-oswald)] text-2xl font-bold uppercase mb-4">
                  WebGL Not Supported
                </p>
                <p className="text-[var(--muted-foreground)] max-w-md">
                  Your browser doesn&apos;t support WebGL, which is required for
                  the drift game. Try using a modern browser like Chrome, Firefox,
                  or Safari.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
