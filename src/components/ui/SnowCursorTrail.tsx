"use client";

import { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  active: boolean;
}

const MAX_PARTICLES = 80;
const SPAWN_DISTANCE = 12; // px of mouse movement before spawning
const PARTICLE_LIFETIME = 1.4; // seconds

export default function SnowCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    // Disable on touch-only devices
    const isTouchOnly = window.matchMedia("(hover: none)").matches;
    if (isTouchOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let animationId: number;
    let lastTime = 0;
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;

    // Object pool
    const pool: Snowflake[] = Array.from({ length: MAX_PARTICLES }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      opacity: 0,
      rotation: 0,
      rotationSpeed: 0,
      life: 0,
      maxLife: 0,
      active: false,
    }));

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
    }

    function spawnFlake(x: number, y: number) {
      for (let i = 0; i < pool.length; i++) {
        if (!pool[i].active) {
          const flake = pool[i];
          flake.x = x + (Math.random() - 0.5) * 8;
          flake.y = y + (Math.random() - 0.5) * 8;
          flake.vx = (Math.random() - 0.5) * 30;
          flake.vy = 20 + Math.random() * 40;
          flake.size = 3 + Math.random() * 6;
          flake.opacity = 0.6 + Math.random() * 0.4;
          flake.rotation = Math.random() * Math.PI * 2;
          flake.rotationSpeed = (Math.random() - 0.5) * 3;
          flake.life = 0;
          flake.maxLife = PARTICLE_LIFETIME * (0.8 + Math.random() * 0.4);
          flake.active = true;
          return;
        }
      }
    }

    function drawSnowflake(flake: Snowflake) {
      ctx!.save();
      ctx!.translate(flake.x, flake.y);
      ctx!.rotate(flake.rotation);
      ctx!.globalAlpha = flake.opacity;
      ctx!.strokeStyle = "#ffffff";
      ctx!.lineWidth = 1.2;
      ctx!.lineCap = "round";

      const r = flake.size / 2;

      // Draw 6-armed snowflake
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Main arm
        ctx!.beginPath();
        ctx!.moveTo(0, 0);
        ctx!.lineTo(cos * r, sin * r);
        ctx!.stroke();

        // Small branches on larger flakes
        if (flake.size > 5) {
          const branchStart = 0.5;
          const branchLen = r * 0.35;
          const bx = cos * r * branchStart;
          const by = sin * r * branchStart;
          const branchAngle1 = angle + Math.PI / 6;
          const branchAngle2 = angle - Math.PI / 6;

          ctx!.beginPath();
          ctx!.moveTo(bx, by);
          ctx!.lineTo(
            bx + Math.cos(branchAngle1) * branchLen,
            by + Math.sin(branchAngle1) * branchLen
          );
          ctx!.stroke();

          ctx!.beginPath();
          ctx!.moveTo(bx, by);
          ctx!.lineTo(
            bx + Math.cos(branchAngle2) * branchLen,
            by + Math.sin(branchAngle2) * branchLen
          );
          ctx!.stroke();
        }
      }

      ctx!.restore();
    }

    function animate(time: number) {
      animationId = requestAnimationFrame(animate);

      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      // Clamp delta to avoid spiral of death on tab refocus
      const clampedDt = Math.min(dt, 0.1);

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Spawn based on mouse distance
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > SPAWN_DISTANCE) {
        const count = Math.min(Math.floor(dist / SPAWN_DISTANCE), 3);
        for (let i = 0; i < count; i++) {
          const t = (i + 1) / (count + 1);
          spawnFlake(
            prevMouseX + dx * t,
            prevMouseY + dy * t
          );
        }
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }

      // Update and draw
      for (let i = 0; i < pool.length; i++) {
        const flake = pool[i];
        if (!flake.active) continue;

        flake.life += clampedDt;
        if (flake.life >= flake.maxLife) {
          flake.active = false;
          continue;
        }

        const progress = flake.life / flake.maxLife;

        flake.x += flake.vx * clampedDt;
        flake.y += flake.vy * clampedDt;
        flake.vx += (Math.random() - 0.5) * 2 * clampedDt; // subtle horizontal drift
        flake.rotation += flake.rotationSpeed * clampedDt;

        // Fade in for first 10%, fade out for last 40%
        if (progress < 0.1) {
          flake.opacity = (progress / 0.1) * (0.6 + Math.random() * 0.1);
        } else if (progress > 0.6) {
          flake.opacity *= 1 - clampedDt * 2.5;
        }

        drawSnowflake(flake);
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    // Handle reduced-motion change at runtime
    function onMotionChange(e: MediaQueryListEvent) {
      if (e.matches) {
        cancelAnimationFrame(animationId);
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      } else {
        animationId = requestAnimationFrame(animate);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    motionQuery.addEventListener("change", onMotionChange);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
