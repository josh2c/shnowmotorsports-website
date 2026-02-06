"use client";

import { useEffect } from "react";
import { useGameStore } from "./GameState";

export default function Controls() {
  const setInput = useGameStore((s) => s.setInput);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    if (phase !== "playing") return;

    const keys: Record<string, boolean> = {};

    const update = () => {
      setInput({
        throttle: keys["ArrowUp"] || keys["KeyW"] ? 1 : 0,
        brake: keys["ArrowDown"] || keys["KeyS"] ? 1 : 0,
        steer:
          (keys["ArrowLeft"] || keys["KeyA"] ? 1 : 0) +
          (keys["ArrowRight"] || keys["KeyD"] ? -1 : 0),
        handbrake: keys["Space"] || false,
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      update();
      if (e.code === "KeyR") useGameStore.getState().requestReset();
      // Prevent space from scrolling
      if (e.code === "Space") e.preventDefault();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
      update();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      setInput({ throttle: 0, brake: 0, steer: 0, handbrake: false });
    };
  }, [phase, setInput]);

  return null;
}
