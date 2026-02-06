"use client";

import { useState } from "react";
import { useGameStore } from "./GameState";
import type { CamView, TuningValues, TrackTransform } from "./GameState";
import { useIsMobile } from "@/hooks/useIsMobile";

const VIEW_LABELS: Record<CamView, string> = {
  bumper: "Bumper",
  hood: "Hood",
  chase_near: "Chase",
  chase_far: "Far",
};

interface SliderDef {
  key: keyof import("./GameState").TuningValues;
  label: string;
  min: number;
  max: number;
  step: number;
  restart?: boolean;
}

const TUNING_SECTIONS: { title: string; sliders: SliderDef[] }[] = [
  {
    title: "Steering",
    sliders: [
      { key: "steer", label: "Angle", min: 0.1, max: 1.2, step: 0.05 },
      { key: "steerSpeed", label: "Response", min: 5, max: 100, step: 5 },
      { key: "yawTorque", label: "Yaw", min: 0, max: 800, step: 25 },
      { key: "yawTorqueDrift", label: "Drift Yaw", min: 0, max: 1500, step: 25 },
      { key: "handbrakeKick", label: "HB Kick", min: 0, max: 25, step: 0.5 },
    ],
  },
  {
    title: "Power",
    sliders: [
      { key: "force", label: "Engine", min: 500, max: 3000, step: 50 },
      { key: "engineLerp", label: "Throttle Spd", min: 5, max: 60, step: 5 },
      { key: "maxBrake", label: "Brake", min: 5, max: 150, step: 5 },
      { key: "maxSpeed", label: "Top Speed", min: 10, max: 60, step: 1 },
    ],
  },
  {
    title: "Chassis",
    sliders: [
      { key: "mass", label: "Mass", min: 100, max: 1000, step: 25, restart: true },
      { key: "angularDamping", label: "Ang Damp", min: 0, max: 0.5, step: 0.01 },
      { key: "gravity", label: "Gravity", min: -20, max: -1, step: 0.5, restart: true },
    ],
  },
  {
    title: "Wheels",
    sliders: [
      { key: "frictionSlip", label: "Grip", min: 0.05, max: 1.5, step: 0.05, restart: true },
      { key: "sideAcceleration", label: "Side Grip", min: 0.1, max: 3, step: 0.1, restart: true },
      { key: "rollInfluence", label: "Roll", min: 0, max: 1, step: 0.05, restart: true },
    ],
  },
  {
    title: "Suspension",
    sliders: [
      { key: "suspensionStiffness", label: "Stiffness", min: 5, max: 100, step: 5, restart: true },
      { key: "suspensionRestLength", label: "Length", min: 0.1, max: 1, step: 0.05, restart: true },
      { key: "dampingCompression", label: "Compress", min: 0.5, max: 10, step: 0.5, restart: true },
      { key: "dampingRelaxation", label: "Rebound", min: 0.5, max: 10, step: 0.5, restart: true },
    ],
  },
  {
    title: "Wheel Geometry",
    sliders: [
      { key: "wheelRadius", label: "Radius", min: 0.1, max: 0.6, step: 0.02, restart: true },
      { key: "frontAxle", label: "Front Z", min: 0.3, max: 1.5, step: 0.05, restart: true },
      { key: "rearAxle", label: "Rear Z", min: -1.5, max: -0.3, step: 0.05, restart: true },
      { key: "trackWidth", label: "Width", min: 0.3, max: 1.2, step: 0.05, restart: true },
      { key: "wheelHeight", label: "Height", min: -0.6, max: 0.2, step: 0.05, restart: true },
    ],
  },
  {
    title: "Drift / Turbo",
    sliders: [
      { key: "driftMinSpeed", label: "Min Speed", min: 1, max: 15, step: 0.5 },
      { key: "turboPerSecond", label: "Turbo/Sec", min: 0, max: 15, step: 0.5 },
      { key: "turboMax", label: "Turbo Cap", min: 1, max: 40, step: 1 },
      { key: "boostMultiplier", label: "Boost Spd", min: 1.0, max: 2.0, step: 0.01 },
      { key: "turboImpulseScale", label: "Impulse", min: 0.01, max: 0.5, step: 0.01 },
      { key: "turboDisplayTime", label: "Flash Dur", min: 0.1, max: 2.0, step: 0.1 },
    ],
  },
  {
    title: "Scoring",
    sliders: [
      { key: "minDriftAngle", label: "Drift Angle", min: 0.05, max: 0.5, step: 0.01 },
      { key: "speedMultiplier", label: "Speed Mult", min: 0.5, max: 10, step: 0.5 },
      { key: "comboInterval", label: "Combo Int", min: 1, max: 10, step: 0.5 },
      { key: "comboIncrement", label: "Combo Inc", min: 0.1, max: 2.0, step: 0.1 },
      { key: "maxCombo", label: "Max Combo", min: 1, max: 20, step: 1 },
      { key: "roundDuration", label: "Round Secs", min: 15, max: 300, step: 5 },
    ],
  },
];

interface TrackSliderDef {
  key: keyof TrackTransform;
  label: string;
  min: number;
  max: number;
  step: number;
}

const TRACK_SLIDERS: TrackSliderDef[] = [
  { key: "scale", label: "Scale", min: 0.01, max: 1, step: 0.005 },
  { key: "posX", label: "Pos X", min: -200, max: 200, step: 1 },
  { key: "posY", label: "Pos Y", min: -10, max: 20, step: 0.1 },
  { key: "posZ", label: "Pos Z", min: -200, max: 400, step: 1 },
  { key: "rotY", label: "Rot Y", min: 0, max: Math.PI * 2, step: 0.05 },
];

export default function HUD() {
  const score = useGameStore((s) => s.score);
  const currentDriftScore = useGameStore((s) => s.currentDriftScore);
  const comboMultiplier = useGameStore((s) => s.comboMultiplier);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const phase = useGameStore((s) => s.phase);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const isBoosting = useGameStore((s) => s.isBoosting);
  const camView = useGameStore((s) => s.camView);
  const setCamView = useGameStore((s) => s.setCamView);
  const camCustom = useGameStore((s) => s.camCustom);
  const setCamCustom = useGameStore((s) => s.setCamCustom);
  const camPanelOpen = useGameStore((s) => s.camPanelOpen);
  const toggleCamPanel = useGameStore((s) => s.toggleCamPanel);
  const camEffects = useGameStore((s) => s.camEffects);
  const toggleCamEffect = useGameStore((s) => s.toggleCamEffect);
  const trackTransform = useGameStore((s) => s.trackTransform);
  const setTrackTransform = useGameStore((s) => s.setTrackTransform);
  const trackPanelOpen = useGameStore((s) => s.trackPanelOpen);
  const toggleTrackPanel = useGameStore((s) => s.toggleTrackPanel);
  const tuning = useGameStore((s) => s.tuning);
  const setTuning = useGameStore((s) => s.setTuning);
  const tuningPanelOpen = useGameStore((s) => s.tuningPanelOpen);
  const toggleTuningPanel = useGameStore((s) => s.toggleTuningPanel);

  const isMobile = useIsMobile();
  const [saved, setSaved] = useState(false);

  const copyDefaults = () => {
    const t: TuningValues = tuning;
    const code = `export const VEHICLE = {
  MASS: ${t.mass},
  STEER: ${t.steer},
  FORCE: ${t.force},
  MAX_BRAKE: ${t.maxBrake},
  MAX_SPEED: ${t.maxSpeed},
  MAX_SPEED_BOOST: ${Math.round(t.maxSpeed * t.boostMultiplier)},
  TURBO_PER_SECOND: ${t.turboPerSecond},
  TURBO_MAX: ${t.turboMax},
  TURBO_DISPLAY_TIME: ${t.turboDisplayTime},
  DRIFT_MIN_SPEED: ${t.driftMinSpeed},
  ANGULAR_DAMPING: ${t.angularDamping},
  YAW_TORQUE: ${t.yawTorque},
  YAW_TORQUE_DRIFT: ${t.yawTorqueDrift},
  HANDBRAKE_KICK: ${t.handbrakeKick},
} as const;

export const WHEEL = {
  RADIUS: ${t.wheelRadius},
  WIDTH: 0.15,
  FRONT_Z: ${t.frontAxle},
  BACK_Z: ${t.rearAxle},
  SIDE_X: ${t.trackWidth},
  HEIGHT_Y: ${t.wheelHeight},
  SUSPENSION_STIFFNESS: ${t.suspensionStiffness},
  SUSPENSION_REST_LENGTH: ${t.suspensionRestLength},
  FRICTION_SLIP: ${t.frictionSlip},
  ROLL_INFLUENCE: ${t.rollInfluence},
  SIDE_ACCELERATION: ${t.sideAcceleration},
} as const;

export const SCORING = {
  MIN_DRIFT_ANGLE: ${t.minDriftAngle},
  POINTS_PER_SECOND: 100,
  SPEED_MULTIPLIER: ${t.speedMultiplier},
  COMBO_INTERVAL: ${t.comboInterval},
  COMBO_INCREMENT: ${t.comboIncrement},
  MAX_COMBO: ${t.maxCombo},
  ROUND_DURATION: ${t.roundDuration},
} as const;

// Inline defaults (GameState.tsx)
// steerSpeed: ${t.steerSpeed}
// engineLerp: ${t.engineLerp}
// gravity: ${t.gravity}
// dampingCompression: ${t.dampingCompression}
// dampingRelaxation: ${t.dampingRelaxation}
// boostMultiplier: ${t.boostMultiplier}
// turboImpulseScale: ${t.turboImpulseScale}`;

    navigator.clipboard.writeText(code);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalScore = score + Math.floor(currentDriftScore);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const isDrifting = currentDriftScore > 0;

  return (
    <>
      {/* Menu screen */}
      {phase === "menu" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase mb-4">
              Shnow Drift
            </h2>
            <p className="text-white/60 mb-2 text-sm">
              {isMobile
                ? "Push joystick to drive & steer. Tap DRIFT to slide."
                : "Arrow keys / WASD to drive. Space to drift."}
            </p>
            {highScore > 0 && (
              <p className="text-[var(--accent-orange)] text-sm mb-6">
                High Score: {highScore.toLocaleString()}
              </p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[var(--accent-red)] text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[#e02020] transition-colors cursor-pointer"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {/* End screen */}
      {phase === "ended" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-oswald)] text-3xl md:text-5xl font-bold uppercase mb-2">
              Time&apos;s Up
            </h2>
            <p className="font-[family-name:var(--font-oswald)] text-5xl md:text-7xl font-bold text-[var(--accent-red)] mb-2">
              {totalScore.toLocaleString()}
            </p>
            <p className="text-white/60 text-sm mb-6">
              {totalScore >= highScore ? "New High Score!" : `Best: ${highScore.toLocaleString()}`}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-[var(--accent-red)] text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[#e02020] transition-colors cursor-pointer"
              >
                Replay
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-white/10 text-white font-bold uppercase tracking-wider rounded-sm hover:bg-white/20 transition-colors cursor-pointer"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playing HUD */}
      {phase === "playing" && (
        <div className="absolute inset-x-0 top-0 z-10 pointer-events-none p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs tracking-wider uppercase text-white/50">Score</p>
              <p className="font-[family-name:var(--font-oswald)] text-3xl md:text-4xl font-bold tabular-nums">
                {totalScore.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs tracking-wider uppercase text-white/50">Time</p>
              <p className="font-[family-name:var(--font-oswald)] text-3xl md:text-4xl font-bold tabular-nums">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          {isDrifting && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
              <p className="font-[family-name:var(--font-oswald)] text-2xl font-bold text-[var(--accent-orange)] uppercase animate-pulse">
                Drifting!
              </p>
              {comboMultiplier > 1 && (
                <p className="text-sm font-bold text-[var(--accent-red)]">
                  {comboMultiplier.toFixed(1)}x Combo
                </p>
              )}
              <p className="text-lg font-bold tabular-nums">
                +{Math.floor(currentDriftScore).toLocaleString()}
              </p>
            </div>
          )}

          {isBoosting && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-pulse">
              <p
                className="font-[family-name:var(--font-oswald)] text-4xl md:text-5xl font-bold uppercase"
                style={{
                  color: "#ff8c00",
                  textShadow: "0 0 20px #ff8c00, 0 0 40px #ff6600, 0 0 60px #ff4400",
                }}
              >
                TURBO!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tuning + Camera panel toggles — visible during playing, desktop only */}
      {phase === "playing" && !isMobile && (
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex gap-2">
          <button
            onClick={toggleTuningPanel}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
              tuningPanelOpen
                ? "bg-[var(--accent-orange)] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Tune
          </button>
          <button
            onClick={toggleTrackPanel}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
              trackPanelOpen
                ? "bg-emerald-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Track
          </button>
          <button
            onClick={toggleCamPanel}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
              camPanelOpen
                ? "bg-[var(--accent-red)] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Cam
          </button>
        </div>
      )}

      {/* Tuning panel — desktop only */}
      {phase === "playing" && !isMobile && tuningPanelOpen && (
        <div className="absolute bottom-14 left-4 z-20 pointer-events-auto w-72 max-h-[70vh] overflow-y-auto bg-black/90 backdrop-blur-sm rounded-md p-3 space-y-3 scrollbar-thin">
          <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Physics Tuning</p>
          {TUNING_SECTIONS.map(({ title, sliders }) => (
            <div key={title} className="space-y-1">
              <p className="text-[9px] text-[var(--accent-orange)] uppercase tracking-widest font-bold border-b border-white/5 pb-0.5">{title}</p>
              {sliders.map(({ key, label, min, max, step, restart }) => (
                <label key={key} className="flex items-center justify-between text-[10px] text-white/60 uppercase tracking-wider">
                  <span className="w-20 shrink-0">
                    {label}
                    {restart && <span className="text-[var(--accent-orange)] ml-0.5">*</span>}
                  </span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={tuning[key]}
                    onChange={(e) => setTuning({ [key]: +e.target.value })}
                    className="w-24 accent-[var(--accent-orange)]"
                  />
                  <span className="w-12 text-right tabular-nums text-white/80">
                    {tuning[key] % 1 === 0 ? tuning[key] : tuning[key].toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          ))}
          <p className="text-[8px] text-white/30 pt-1"><span className="text-[var(--accent-orange)]">*</span> rebuilds physics on change</p>
          <button
            onClick={copyDefaults}
            className={`w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors cursor-pointer ${
              saved
                ? "bg-green-600 text-white"
                : "bg-[var(--accent-orange)] text-white hover:bg-[#e08020]"
            }`}
          >
            {saved ? "Copied to clipboard!" : "Save as defaults"}
          </button>
        </div>
      )}

      {/* Track panel — desktop only */}
      {phase === "playing" && !isMobile && trackPanelOpen && (
        <div className="absolute bottom-14 left-4 z-20 pointer-events-auto w-72 bg-black/90 backdrop-blur-sm rounded-md p-3 space-y-2 scrollbar-thin"
             style={{ left: tuningPanelOpen ? "19.5rem" : "1rem" }}>
          <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Track Transform</p>
          <div className="space-y-1">
            {TRACK_SLIDERS.map(({ key, label, min, max, step }) => (
              <label key={key} className="flex items-center justify-between text-[10px] text-white/60 uppercase tracking-wider">
                <span className="w-14 shrink-0">{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={trackTransform[key]}
                  onChange={(e) => setTrackTransform({ [key]: +e.target.value })}
                  className="w-28 accent-emerald-500"
                />
                <span className="w-14 text-right tabular-nums text-white/80">
                  {trackTransform[key] % 1 === 0 ? trackTransform[key] : trackTransform[key].toFixed(3)}
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={() => {
              const t = trackTransform;
              const code = `scale={${t.scale}}\nposition={[${t.posX}, ${t.posY}, ${t.posZ}]}\nrotation={[0, ${t.rotY.toFixed(4)}, 0]}`;
              navigator.clipboard.writeText(code);
            }}
            className="w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-sm transition-colors cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Copy Values
          </button>
        </div>
      )}

      {/* Camera panel — desktop only */}
      {phase === "playing" && !isMobile && camPanelOpen && (
        <div className="absolute bottom-14 right-4 z-20 pointer-events-auto w-56 bg-black/80 backdrop-blur-sm rounded-md p-3 space-y-3">
              {/* Presets */}
              <div className="flex gap-1">
                {(Object.keys(VIEW_LABELS) as CamView[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => setCamView(view)}
                    className={`flex-1 px-1 py-1 text-[10px] uppercase tracking-wider rounded-sm cursor-pointer transition-colors ${
                      camView === view
                        ? "bg-[var(--accent-red)] text-white"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {VIEW_LABELS[view]}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="space-y-2 text-[10px] text-white/60 uppercase tracking-wider">
                <label className="flex items-center justify-between">
                  <span>Height</span>
                  <input
                    type="range"
                    min="0.2"
                    max="8"
                    step="0.1"
                    value={camCustom.offsetY}
                    onChange={(e) => setCamCustom({ offsetY: +e.target.value })}
                    className="w-28 accent-[var(--accent-red)]"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>Distance</span>
                  <input
                    type="range"
                    min="-12"
                    max="1"
                    step="0.1"
                    value={camCustom.offsetZ}
                    onChange={(e) => setCamCustom({ offsetZ: +e.target.value })}
                    className="w-28 accent-[var(--accent-red)]"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>Look Y</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value={camCustom.lookY}
                    onChange={(e) => setCamCustom({ lookY: +e.target.value })}
                    className="w-28 accent-[var(--accent-red)]"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>FOV</span>
                  <input
                    type="range"
                    min="20"
                    max="110"
                    step="1"
                    value={camCustom.baseFov}
                    onChange={(e) => setCamCustom({ baseFov: +e.target.value })}
                    className="w-28 accent-[var(--accent-red)]"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>Smoothing</span>
                  <input
                    type="range"
                    min="0.01"
                    max="0.3"
                    step="0.01"
                    value={camCustom.lerp}
                    onChange={(e) => setCamCustom({ lerp: +e.target.value })}
                    className="w-28 accent-[var(--accent-red)]"
                  />
                </label>
              </div>

              {/* Effects toggles */}
              <div className="border-t border-white/10 pt-2 space-y-1 text-[10px] text-white/60 uppercase tracking-wider">
                <p className="text-white/40 mb-1">Effects</p>
                {(["speedFov", "driftSwing", "turboPunch", "shake"] as const).map((key) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span>{key === "speedFov" ? "Speed FOV" : key === "driftSwing" ? "Drift Swing" : key === "turboPunch" ? "Turbo Punch" : "Shake"}</span>
                    <input
                      type="checkbox"
                      checked={camEffects[key]}
                      onChange={() => toggleCamEffect(key)}
                      className="accent-[var(--accent-red)]"
                    />
                  </label>
                ))}
              </div>
        </div>
      )}
    </>
  );
}
