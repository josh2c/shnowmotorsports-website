"use client";

import { useRef, useCallback, useEffect } from "react";
import { useGameStore } from "./GameState";

const JOYSTICK_SIZE = 140;
const THUMB_SIZE = 56;
const MAX_RADIUS = (JOYSTICK_SIZE - THUMB_SIZE) / 2;
const DEAD_ZONE = 8;

export default function MobileControls() {
  const phase = useGameStore((s) => s.phase);
  const setInput = useGameStore((s) => s.setInput);

  const joystickRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const originRef = useRef({ x: 0, y: 0 });
  const activeTouchRef = useRef<number | null>(null);
  const driftTouchRef = useRef<number | null>(null);

  // Reset inputs when phase changes
  useEffect(() => {
    if (phase !== "playing") return;
    return () => setInput({ throttle: 0, brake: 0, steer: 0, handbrake: false });
  }, [phase, setInput]);

  // --- Joystick handlers ---
  const handleJoystickStart = useCallback(
    (e: React.TouchEvent) => {
      if (activeTouchRef.current !== null) return;
      const touch = e.changedTouches[0];
      activeTouchRef.current = touch.identifier;

      const rect = joystickRef.current!.getBoundingClientRect();
      originRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    },
    []
  );

  const handleJoystickMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === activeTouchRef.current
      );
      if (!touch) return;

      let dx = touch.clientX - originRef.current.x;
      let dy = touch.clientY - originRef.current.y;

      // Clamp to circle
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > MAX_RADIUS) {
        dx = (dx / dist) * MAX_RADIUS;
        dy = (dy / dist) * MAX_RADIUS;
      }

      // Update thumb position
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }

      // Steering (X-axis) with dead zone
      const steer = Math.abs(dx) < DEAD_ZONE ? 0 : -(dx / MAX_RADIUS);

      // Throttle/Brake (Y-axis): up = throttle, down = brake
      const normalY = -(dy / MAX_RADIUS); // negative because screen Y is inverted
      const throttle = Math.abs(dy) < DEAD_ZONE ? 0 : Math.max(0, normalY);
      const brake = Math.abs(dy) < DEAD_ZONE ? 0 : Math.max(0, -normalY);

      setInput({
        steer: Math.max(-1, Math.min(1, steer)),
        throttle: Math.min(1, throttle),
        brake: Math.min(1, brake),
      });
    },
    [setInput]
  );

  const handleJoystickEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === activeTouchRef.current
      );
      if (!touch) return;
      activeTouchRef.current = null;

      // Snap thumb back
      if (thumbRef.current) {
        thumbRef.current.style.transform = "translate(0px, 0px)";
      }
      setInput({ steer: 0, throttle: 0, brake: 0 });
    },
    [setInput]
  );

  // --- Drift button handlers ---
  const handleDriftStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      driftTouchRef.current = touch.identifier;
      setInput({ handbrake: true });
    },
    [setInput]
  );

  const handleDriftEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === driftTouchRef.current
      );
      if (!touch) return;
      driftTouchRef.current = null;
      setInput({ handbrake: false });
    },
    [setInput]
  );

  if (phase !== "playing") return null;

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ touchAction: "none" }}
    >
      {/* Virtual Joystick — bottom-left */}
      <div
        ref={joystickRef}
        className="pointer-events-auto absolute bottom-6 left-6"
        style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        {/* Track ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />
        {/* Thumb */}
        <div
          ref={thumbRef}
          className="absolute rounded-full"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            top: (JOYSTICK_SIZE - THUMB_SIZE) / 2,
            left: (JOYSTICK_SIZE - THUMB_SIZE) / 2,
            background: "var(--accent-red, #e02020)",
            boxShadow: "0 0 16px rgba(224,32,32,0.5)",
            transition: "none",
          }}
        />
      </div>

      {/* Drift / Brake Button — bottom-right */}
      <button
        className="pointer-events-auto absolute bottom-6 right-6 flex items-center justify-center rounded-full select-none active:scale-95"
        style={{
          width: 88,
          height: 88,
          background: "rgba(0,0,0,0.45)",
          border: "2px solid rgba(255,140,0,0.5)",
          touchAction: "none",
        }}
        onTouchStart={handleDriftStart}
        onTouchEnd={handleDriftEnd}
        onTouchCancel={handleDriftEnd}
      >
        <span
          className="font-[family-name:var(--font-oswald)] text-sm font-bold uppercase tracking-wider"
          style={{ color: "#ff8c00" }}
        >
          DRIFT
        </span>
      </button>
    </div>
  );
}
