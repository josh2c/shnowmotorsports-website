import { create } from "zustand";
import { SCORING, VEHICLE, WHEEL } from "./constants";

export type GamePhase = "menu" | "playing" | "paused" | "ended";

export type CamView = "bumper" | "hood" | "chase_near" | "chase_far";

export interface CamPreset {
  offsetY: number;
  offsetZ: number;
  lookY: number;
  lerp: number;
  baseFov: number;
}

export const CAM_PRESETS: Record<CamView, CamPreset> = {
  bumper:     { offsetY: 0.45, offsetZ: 0.6,  lookY: 0.4,  lerp: 0.15, baseFov: 75 },
  hood:       { offsetY: 0.8,  offsetZ: 0.0,  lookY: 0.5,  lerp: 0.12, baseFov: 70 },
  chase_near: { offsetY: 1.2,  offsetZ: -4.0, lookY: 0.5,  lerp: 0.08, baseFov: 50 },
  chase_far:  { offsetY: 4.5,  offsetZ: -9.0, lookY: 0.8,  lerp: 0.06, baseFov: 58 },
};

export interface CamEffects {
  speedFov: boolean;
  driftSwing: boolean;
  turboPunch: boolean;
  shake: boolean;
}

export interface CarInput {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
}

export interface TuningValues {
  // Steering
  steer: number;
  steerSpeed: number;
  yawTorque: number;
  yawTorqueDrift: number;
  handbrakeKick: number;
  // Power
  force: number;
  engineLerp: number;
  maxBrake: number;
  maxSpeed: number;
  // Chassis
  mass: number;
  angularDamping: number;
  gravity: number;
  // Wheels
  frictionSlip: number;
  sideAcceleration: number;
  rollInfluence: number;
  // Wheel Geometry
  wheelRadius: number;
  frontAxle: number;
  rearAxle: number;
  trackWidth: number;
  wheelHeight: number;
  // Suspension
  suspensionStiffness: number;
  suspensionRestLength: number;
  dampingCompression: number;
  dampingRelaxation: number;
  // Drift / Turbo
  driftMinSpeed: number;
  turboPerSecond: number;
  turboMax: number;
  boostMultiplier: number;
  turboImpulseScale: number;
  turboDisplayTime: number;
  // Scoring
  minDriftAngle: number;
  speedMultiplier: number;
  comboInterval: number;
  comboIncrement: number;
  maxCombo: number;
  roundDuration: number;
}

export interface TrackTransform {
  scale: number;
  posX: number;
  posY: number;
  posZ: number;
  rotY: number;
}

export interface CamCustom {
  offsetY: number;
  offsetZ: number;
  lookY: number;
  baseFov: number;
  lerp: number;
}

export interface GameStore {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;

  input: CarInput;
  setInput: (input: Partial<CarInput>) => void;

  score: number;
  comboMultiplier: number;
  comboDuration: number;
  currentDriftScore: number;
  timeRemaining: number;
  highScore: number;

  isBoosting: boolean;
  setIsBoosting: (v: boolean) => void;

  // Camera
  camView: CamView;
  setCamView: (view: CamView) => void;
  camCustom: CamCustom;
  setCamCustom: (partial: Partial<CamCustom>) => void;
  camEffects: CamEffects;
  toggleCamEffect: (key: keyof CamEffects) => void;
  camPanelOpen: boolean;
  toggleCamPanel: () => void;

  // Track Transform
  trackTransform: TrackTransform;
  setTrackTransform: (partial: Partial<TrackTransform>) => void;
  trackPanelOpen: boolean;
  toggleTrackPanel: () => void;

  // Tuning
  tuning: TuningValues;
  setTuning: (partial: Partial<TuningValues>) => void;
  tuningPanelOpen: boolean;
  toggleTuningPanel: () => void;

  resetRequested: boolean;
  requestReset: () => void;
  clearReset: () => void;

  addDriftScore: (angle: number, speed: number, delta: number) => void;
  bankDrift: () => void;
  resetCombo: () => void;
  tick: (delta: number) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
}

function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("shnow-highscore") || "0", 10);
}

function saveHighScore(score: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("shnow-highscore", score.toString());
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "menu",
  setPhase: (phase) => set({ phase }),

  input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
  setInput: (partial) =>
    set((state) => ({ input: { ...state.input, ...partial } })),

  isBoosting: false,
  setIsBoosting: (v) => set({ isBoosting: v }),

  camView: "chase_near",
  setCamView: (view) => set({ camView: view, camCustom: { ...CAM_PRESETS[view] } }),
  camCustom: { ...CAM_PRESETS["chase_near"] },
  setCamCustom: (partial) =>
    set((state) => ({ camCustom: { ...state.camCustom, ...partial } })),
  camEffects: { speedFov: false, driftSwing: false, turboPunch: false, shake: false },
  toggleCamEffect: (key) =>
    set((state) => ({
      camEffects: { ...state.camEffects, [key]: !state.camEffects[key] },
    })),
  camPanelOpen: false,
  toggleCamPanel: () =>
    set((state) => ({ camPanelOpen: !state.camPanelOpen })),

  trackTransform: {
    scale: 0.36,
    posX: -2,
    posY: -0.7,
    posZ: 107,
    rotY: 1.5708,
  },
  setTrackTransform: (partial) =>
    set((state) => ({ trackTransform: { ...state.trackTransform, ...partial } })),
  trackPanelOpen: false,
  toggleTrackPanel: () =>
    set((state) => ({ trackPanelOpen: !state.trackPanelOpen })),

  tuning: {
    steer: VEHICLE.STEER,
    steerSpeed: 50,
    yawTorque: VEHICLE.YAW_TORQUE,
    yawTorqueDrift: VEHICLE.YAW_TORQUE_DRIFT,
    handbrakeKick: VEHICLE.HANDBRAKE_KICK,
    force: VEHICLE.FORCE,
    engineLerp: 45,
    maxBrake: VEHICLE.MAX_BRAKE,
    maxSpeed: VEHICLE.MAX_SPEED,
    mass: VEHICLE.MASS,
    angularDamping: VEHICLE.ANGULAR_DAMPING,
    gravity: -9.81,
    frictionSlip: WHEEL.FRICTION_SLIP,
    sideAcceleration: WHEEL.SIDE_ACCELERATION,
    rollInfluence: WHEEL.ROLL_INFLUENCE,
    wheelRadius: WHEEL.RADIUS,
    frontAxle: WHEEL.FRONT_Z,
    rearAxle: WHEEL.BACK_Z,
    trackWidth: WHEEL.SIDE_X,
    wheelHeight: WHEEL.HEIGHT_Y,
    suspensionStiffness: WHEEL.SUSPENSION_STIFFNESS,
    suspensionRestLength: WHEEL.SUSPENSION_REST_LENGTH,
    dampingCompression: 4.4,
    dampingRelaxation: 2.3,
    driftMinSpeed: VEHICLE.DRIFT_MIN_SPEED,
    turboPerSecond: VEHICLE.TURBO_PER_SECOND,
    turboMax: VEHICLE.TURBO_MAX,
    boostMultiplier: 1.78,
    turboImpulseScale: 0.1,
    turboDisplayTime: VEHICLE.TURBO_DISPLAY_TIME,
    minDriftAngle: SCORING.MIN_DRIFT_ANGLE,
    speedMultiplier: SCORING.SPEED_MULTIPLIER,
    comboInterval: SCORING.COMBO_INTERVAL,
    comboIncrement: SCORING.COMBO_INCREMENT,
    maxCombo: SCORING.MAX_COMBO,
    roundDuration: SCORING.ROUND_DURATION,
  },
  setTuning: (partial) =>
    set((state) => ({ tuning: { ...state.tuning, ...partial } })),
  tuningPanelOpen: false,
  toggleTuningPanel: () =>
    set((state) => ({ tuningPanelOpen: !state.tuningPanelOpen })),

  resetRequested: false,
  requestReset: () => set({ resetRequested: true }),
  clearReset: () => set({ resetRequested: false }),

  score: 0,
  comboMultiplier: 1,
  comboDuration: 0,
  currentDriftScore: 0,
  timeRemaining: SCORING.ROUND_DURATION,
  highScore: getHighScore(),

  addDriftScore: (angle, speed, delta) =>
    set((state) => {
      const t = state.tuning;
      const driftPoints =
        Math.abs(angle) *
        speed *
        t.speedMultiplier *
        state.comboMultiplier *
        delta;

      const newComboDuration = state.comboDuration + delta;
      const comboLevel = Math.floor(
        newComboDuration / t.comboInterval
      );
      const newCombo = Math.min(
        1 + comboLevel * t.comboIncrement,
        t.maxCombo
      );

      return {
        currentDriftScore: state.currentDriftScore + driftPoints,
        comboDuration: newComboDuration,
        comboMultiplier: newCombo,
      };
    }),

  bankDrift: () =>
    set((state) => ({
      score: state.score + Math.floor(state.currentDriftScore),
      currentDriftScore: 0,
      comboDuration: 0,
      comboMultiplier: 1,
    })),

  resetCombo: () =>
    set({ currentDriftScore: 0, comboDuration: 0, comboMultiplier: 1 }),

  tick: (delta) =>
    set((state) => {
      if (state.phase !== "playing") return state;
      const newTime = state.timeRemaining - delta;
      if (newTime <= 0) {
        get().endGame();
        return { timeRemaining: 0 };
      }
      return { timeRemaining: newTime };
    }),

  startGame: () =>
    set((state) => ({
      phase: "playing",
      score: 0,
      comboMultiplier: 1,
      comboDuration: 0,
      currentDriftScore: 0,
      timeRemaining: state.tuning.roundDuration,
      isBoosting: false,
    })),

  endGame: () => {
    const state = get();
    const finalScore = state.score + Math.floor(state.currentDriftScore);
    const newHigh = Math.max(finalScore, state.highScore);
    saveHighScore(newHigh);
    set({
      phase: "ended",
      score: finalScore,
      currentDriftScore: 0,
      highScore: newHigh,
    });
  },

  resetGame: () =>
    set((state) => ({
      phase: "menu",
      score: 0,
      comboMultiplier: 1,
      comboDuration: 0,
      currentDriftScore: 0,
      timeRemaining: state.tuning.roundDuration,
      input: { throttle: 0, brake: 0, steer: 0, handbrake: false },
      isBoosting: false,
    })),
}));
