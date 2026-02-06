"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, useCompoundBody, useRaycastVehicle } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "./GameState";
import { VEHICLE, WHEEL, TRACK } from "./constants";
import { carPhysicsState } from "./carPhysicsState";

const startX = TRACK.START_X;
const startZ = TRACK.START_Z;

interface WheelTuning {
  frictionSlip: number;
  sideAcceleration: number;
  rollInfluence: number;
  suspensionStiffness: number;
  suspensionRestLength: number;
  dampingCompression: number;
  dampingRelaxation: number;
  wheelRadius: number;
  frontAxle: number;
  rearAxle: number;
  trackWidth: number;
  wheelHeight: number;
}

function buildWheelInfos(t: WheelTuning) {
  const base = {
    axleLocal: [-1, 0, 0] as [number, number, number],
    directionLocal: [0, -1, 0] as [number, number, number],
    customSlidingRotationalSpeed: -0.01,
    useCustomSlidingRotationalSpeed: true,
    frictionSlip: t.frictionSlip,
    radius: t.wheelRadius,
    rollInfluence: t.rollInfluence,
    sideAcceleration: t.sideAcceleration,
    suspensionRestLength: t.suspensionRestLength,
    suspensionStiffness: t.suspensionStiffness,
    dampingCompression: t.dampingCompression,
    dampingRelaxation: t.dampingRelaxation,
  };
  return [
    { ...base, chassisConnectionPointLocal: [-t.trackWidth, t.wheelHeight, t.frontAxle] as [number, number, number], isFrontWheel: true },
    { ...base, chassisConnectionPointLocal: [t.trackWidth, t.wheelHeight, t.frontAxle] as [number, number, number], isFrontWheel: true },
    { ...base, chassisConnectionPointLocal: [-t.trackWidth, t.wheelHeight, t.rearAxle] as [number, number, number], isFrontWheel: false },
    { ...base, chassisConnectionPointLocal: [t.trackWidth, t.wheelHeight, t.rearAxle] as [number, number, number], isFrontWheel: false },
  ];
}

function wheelBodyConfig(radius: number) {
  return {
    mass: 1,
    type: "Kinematic" as const,
    collisionFilterGroup: 0,
    shapes: [
      {
        type: "Cylinder" as const,
        args: [radius, radius, WHEEL.WIDTH, 16] as [number, number, number, number],
        rotation: [0, 0, -Math.PI / 2] as [number, number, number],
      },
    ],
  };
}

const MODEL_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/skyline-r34.glb`;

export default function Car() {
  const { scene } = useGLTF(MODEL_PATH);
  const tuning = useGameStore((s) => s.tuning);
  const carModel = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  // Build wheel infos from tuning (rebuilt when tuning changes + remount)
  const wheelInfos = useMemo(
    () => buildWheelInfos(tuning),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tuning.frictionSlip, tuning.sideAcceleration, tuning.rollInfluence,
     tuning.suspensionStiffness, tuning.suspensionRestLength,
     tuning.dampingCompression, tuning.dampingRelaxation,
     tuning.wheelRadius, tuning.frontAxle, tuning.rearAxle,
     tuning.trackWidth, tuning.wheelHeight],
  );

  // Chassis physics body
  const [chassisRef, chassisApi] = useBox(
    () => ({
      mass: tuning.mass,
      args: [1.2, 0.5, 2.4],
      position: [startX, 0.5, startZ],
      allowSleep: false,
      angularDamping: tuning.angularDamping,
    }),
    useRef<THREE.Group>(null),
  );

  // Wheel physics bodies (Kinematic — controlled by raycast vehicle)
  const wheelRef0 = useRef<THREE.Group>(null);
  const wheelRef1 = useRef<THREE.Group>(null);
  const wheelRef2 = useRef<THREE.Group>(null);
  const wheelRef3 = useRef<THREE.Group>(null);

  const wheelCfg = () => wheelBodyConfig(tuning.wheelRadius);
  useCompoundBody(wheelCfg, wheelRef0);
  useCompoundBody(wheelCfg, wheelRef1);
  useCompoundBody(wheelCfg, wheelRef2);
  useCompoundBody(wheelCfg, wheelRef3);

  // Raycast vehicle — connects chassis + wheels
  const [vehicleRef, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody: chassisRef,
      wheels: [wheelRef0, wheelRef1, wheelRef2, wheelRef3],
      wheelInfos,
    }),
    useRef<THREE.Group>(null),
  );

  // Mutable state (avoid re-renders for 60fps updates)
  const speedRef = useRef(0);
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);
  const engineRef = useRef(0);
  const steeringRef = useRef(0);

  // Drift tracking
  const isDriftingRef = useRef(false);
  const driftTimeRef = useRef(0);
  const wasDriftingRef = useRef(false);
  const boostTimerRef = useRef(0);
  const prevHandbrakeRef = useRef(false);

  // Phase tracking for reset
  const prevPhaseRef = useRef("");

  // Reusable objects (avoid GC pressure)
  const _forward = useRef(new THREE.Vector3());
  const _velDir = useRef(new THREE.Vector3());
  const _cross = useRef(new THREE.Vector3());
  const _chassisPos = useRef(new THREE.Vector3());
  const _chassisQuat = useRef(new THREE.Quaternion());
  const _chassisScale = useRef(new THREE.Vector3());

  // Subscribe to chassis physics for clean data pipeline
  useEffect(() => {
    const unsubVel = chassisApi.velocity.subscribe((v) => {
      velocityRef.current = v as [number, number, number];
      const spd = Math.sqrt(v[0] * v[0] + v[2] * v[2]);
      speedRef.current = spd;
      carPhysicsState.speed = spd;
      carPhysicsState.velocity.x = v[0];
      carPhysicsState.velocity.y = v[1];
      carPhysicsState.velocity.z = v[2];
    });
    const unsubPos = chassisApi.position.subscribe((p) => {
      carPhysicsState.position.x = p[0];
      carPhysicsState.position.y = p[1];
      carPhysicsState.position.z = p[2];
    });
    const unsubQuat = chassisApi.quaternion.subscribe((q) => {
      carPhysicsState.quaternion.x = q[0];
      carPhysicsState.quaternion.y = q[1];
      carPhysicsState.quaternion.z = q[2];
      carPhysicsState.quaternion.w = q[3];
    });
    return () => {
      unsubVel();
      unsubPos();
      unsubQuat();
    };
  }, [chassisApi]);

  // Store selectors
  const input = useGameStore((s) => s.input);
  const phase = useGameStore((s) => s.phase);
  const addDriftScore = useGameStore((s) => s.addDriftScore);
  const bankDrift = useGameStore((s) => s.bankDrift);
  const setIsBoosting = useGameStore((s) => s.setIsBoosting);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // --- Reset car on new game ---
    if (phase === "playing" && prevPhaseRef.current !== "playing") {
      chassisApi.position.set(startX, 0.5, startZ);
      chassisApi.rotation.set(0, 0, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      isDriftingRef.current = false;
      driftTimeRef.current = 0;
      wasDriftingRef.current = false;
      boostTimerRef.current = 0;
      engineRef.current = 0;
      steeringRef.current = 0;
    }
    prevPhaseRef.current = phase;

    // --- Reset car on R key (flip recovery) ---
    if (useGameStore.getState().resetRequested) {
      useGameStore.getState().clearReset();
      const pos = carPhysicsState.position;
      chassisApi.position.set(pos.x, pos.y + 1.5, pos.z);
      chassisApi.rotation.set(0, 0, 0);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      engineRef.current = 0;
      steeringRef.current = 0;
    }

    if (phase !== "playing") {
      // Apply brakes when not playing to keep car still
      for (let i = 0; i < 4; i++) {
        vehicleApi.applyEngineForce(0, i);
        vehicleApi.setBrake(10, i);
      }
      return;
    }

    const speed = speedRef.current;
    const { throttle, brake, steer, handbrake } = input;

    // --- Read live tuning values ---
    const tuning = useGameStore.getState().tuning;

    // Update angular damping live (this one can be set at runtime)
    chassisApi.angularDamping.set(tuning.angularDamping);

    // --- Engine force (lerped for smooth feel) ---
    const isBoosting = boostTimerRef.current > 0;
    const maxSpd = isBoosting ? tuning.maxSpeed * tuning.boostMultiplier : tuning.maxSpeed;
    let targetEngine = 0;
    if (throttle > 0 && speed < maxSpd) {
      targetEngine = -tuning.force; // negative = forward in cannon
    } else if (brake > 0 && !throttle) {
      targetEngine = tuning.force * 0.5; // positive = reverse
    }
    engineRef.current = THREE.MathUtils.lerp(engineRef.current, targetEngine, dt * tuning.engineLerp);

    // Apply engine to rear wheels (indices 2, 3)
    vehicleApi.applyEngineForce(engineRef.current, 2);
    vehicleApi.applyEngineForce(engineRef.current, 3);

    // --- Steering (near-instant response) ---
    const targetSteer = steer * tuning.steer;
    steeringRef.current = THREE.MathUtils.lerp(steeringRef.current, targetSteer, dt * tuning.steerSpeed);

    // Apply steering to front wheels (indices 0, 1)
    vehicleApi.setSteeringValue(steeringRef.current, 0);
    vehicleApi.setSteeringValue(steeringRef.current, 1);

    // --- Braking ---
    if (handbrake) {
      // Handbrake: zero brakes — let the car glide freely
      vehicleApi.setBrake(0, 0);
      vehicleApi.setBrake(0, 1);
      vehicleApi.setBrake(0, 2);
      vehicleApi.setBrake(0, 3);
      // Kill engine on rear wheels so they're not fighting the slide
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    } else if (brake > 0 && throttle > 0) {
      // Pressing both: light brake to slow down (no reverse)
      vehicleApi.setBrake(tuning.maxBrake * 0.2, 0);
      vehicleApi.setBrake(tuning.maxBrake * 0.2, 1);
      vehicleApi.setBrake(tuning.maxBrake * 0.3, 2);
      vehicleApi.setBrake(tuning.maxBrake * 0.3, 3);
    } else {
      // No brakes
      vehicleApi.setBrake(0, 0);
      vehicleApi.setBrake(0, 1);
      vehicleApi.setBrake(0, 2);
      vehicleApi.setBrake(0, 3);
    }

    // --- Yaw assist (arcade steering torque) ---
    if (Math.abs(steer) > 0.01 && speed > 1) {
      const speedFactor = Math.min(speed / VEHICLE.MAX_SPEED, 1);
      const torqueStrength = handbrake
        ? tuning.yawTorqueDrift
        : tuning.yawTorque;
      const yawTorque = -steer * torqueStrength * speedFactor;
      chassisApi.applyTorque([0, yawTorque, 0]);
    }

    // --- Handbrake kick (one-shot on press) ---
    if (handbrake && !prevHandbrakeRef.current && speed > tuning.driftMinSpeed && Math.abs(steer) > 0.01) {
      const kickImpulse = -steer * tuning.handbrakeKick * tuning.mass;
      chassisApi.applyTorque([0, kickImpulse, 0]);
    }
    prevHandbrakeRef.current = handbrake;

    // --- Drift angle detection ---
    let driftAngle = 0;
    if (chassisRef.current && speed > 1) {
      // Cannon sets matrix directly — decompose to get real quaternion
      chassisRef.current.matrix.decompose(_chassisPos.current, _chassisQuat.current, _chassisScale.current);

      // Forward direction from chassis orientation
      const forward = _forward.current.set(0, 0, -1).applyQuaternion(_chassisQuat.current);
      forward.y = 0;
      forward.normalize();

      // Velocity direction
      const vel = velocityRef.current;
      const velDir = _velDir.current.set(vel[0], 0, vel[2]).normalize();

      // Signed angle between forward and velocity
      const dot = THREE.MathUtils.clamp(forward.dot(velDir), -1, 1);
      driftAngle = Math.acos(dot);
      const cross = _cross.current.crossVectors(forward, velDir);
      if (cross.y < 0) driftAngle = -driftAngle;
    }

    // --- Drift state tracking ---
    if (handbrake && !isDriftingRef.current && speed > tuning.driftMinSpeed) {
      isDriftingRef.current = true;
      driftTimeRef.current = 0;
    }

    // Turbo on handbrake release
    if (wasDriftingRef.current && !handbrake && isDriftingRef.current) {
      isDriftingRef.current = false;
      const turboBoost = Math.min(
        driftTimeRef.current * tuning.turboPerSecond,
        tuning.turboMax,
      );
      if (turboBoost > 0 && chassisRef.current) {
        // Decompose matrix for real quaternion, then compute forward direction
        chassisRef.current.matrix.decompose(_chassisPos.current, _chassisQuat.current, _chassisScale.current);
        const fwd = _forward.current.set(0, 0, -1).applyQuaternion(_chassisQuat.current);
        fwd.y = 0;
        fwd.normalize();
        const impulse = turboBoost * tuning.mass * tuning.turboImpulseScale;
        chassisApi.applyImpulse(
          [fwd.x * impulse, 0, fwd.z * impulse],
          [0, 0, 0],
        );
        setIsBoosting(true);
        boostTimerRef.current = tuning.turboDisplayTime;
      }
    }

    if (isDriftingRef.current) {
      driftTimeRef.current += dt;
    }

    // --- Scoring ---
    if (Math.abs(driftAngle) > tuning.minDriftAngle && speed > 3) {
      addDriftScore(driftAngle, speed, dt);
    } else if (
      Math.abs(driftAngle) <= tuning.minDriftAngle &&
      useGameStore.getState().currentDriftScore > 0
    ) {
      bankDrift();
    }

    // --- Boost timer ---
    if (boostTimerRef.current > 0) {
      boostTimerRef.current -= dt;
      if (boostTimerRef.current <= 0) {
        boostTimerRef.current = 0;
        setIsBoosting(false);
      }
    }

    // --- Store drift state for next frame ---
    wasDriftingRef.current = isDriftingRef.current;
  });

  return (
    <group ref={vehicleRef}>
      {/* Chassis */}
      <group ref={chassisRef} name="player-car">
        <primitive
          object={carModel}
          scale={0.5}
          position={[0, -0.3, 0]}
          rotation={[0, 0, 0]}
        />
      </group>

      {/* Wheel physics anchors (invisible — model has its own wheels) */}
      <group ref={wheelRef0} />
      <group ref={wheelRef1} />
      <group ref={wheelRef2} />
      <group ref={wheelRef3} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
