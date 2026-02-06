"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { carPhysicsState } from "./carPhysicsState";
import { useGameStore } from "./GameState";
import { CAMERA } from "./constants";

const _offset = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();

export default function Camera() {
  const { camera } = useThree();
  const smoothYaw = useRef(0);
  const ready = useRef(false);
  const currentFov = useRef(0);
  const smoothFov = useRef(0);
  const prevBoosting = useRef(false);
  const turboPunchTimer = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { position, quaternion, speed } = carPhysicsState;
    const state = useGameStore.getState();
    const { offsetY, offsetZ, lookY, lerp, baseFov } = state.camCustom;
    const effects = state.camEffects;
    const handbrake = state.input.handbrake;
    const isBoosting = state.isBoosting;

    // --- FOV effects ---
    let targetFov = baseFov;

    if (effects.speedFov) {
      const speedFactor = Math.min(speed / 30, 1);
      targetFov += speedFactor * 12;
    }

    if (effects.turboPunch) {
      if (isBoosting && !prevBoosting.current) {
        turboPunchTimer.current = 0.25;
      }
      if (turboPunchTimer.current > 0) {
        turboPunchTimer.current -= dt;
        const punch = Math.max(turboPunchTimer.current / 0.25, 0);
        targetFov += punch * 15;
      }
    }
    prevBoosting.current = isBoosting;

    smoothFov.current = THREE.MathUtils.lerp(smoothFov.current, targetFov, dt * 6);
    const perspCam = camera as THREE.PerspectiveCamera;
    if (Math.abs(currentFov.current - smoothFov.current) > 0.01) {
      perspCam.fov = smoothFov.current;
      perspCam.updateProjectionMatrix();
      currentFov.current = smoothFov.current;
    }

    // --- Yaw ---
    _quat.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    _euler.setFromQuaternion(_quat, "YXZ");

    if (!ready.current) {
      smoothYaw.current = _euler.y;
      smoothFov.current = targetFov;
      currentFov.current = targetFov;
      perspCam.fov = targetFov;
      perspCam.updateProjectionMatrix();
      ready.current = true;
    }

    // Smooth yaw — camera swings around on turns
    const yawFactor = 1 - Math.pow(1 - lerp, dt * 60);
    smoothYaw.current += (_euler.y - smoothYaw.current) * yawFactor;

    // --- Offset rotated by smoothed yaw ---
    _offset.set(0, offsetY, offsetZ);

    // Drift swing — lateral offset during handbrake
    if (effects.driftSwing && handbrake && speed > 3) {
      const swingAmount = Math.min(speed / 20, 1) * CAMERA.DRIFT_LATERAL_MAX;
      _offset.x += state.input.steer * swingAmount;
    }

    _offset.applyAxisAngle(_up, smoothYaw.current);

    let camX = position.x + _offset.x;
    let camY = position.y + _offset.y;
    const camZ = position.z + _offset.z;

    // Shake effect — small random offset during handbrake
    if (effects.shake && handbrake && speed > 3) {
      const intensity = Math.min(speed / 25, 1) * 0.04;
      camX += (Math.random() - 0.5) * intensity;
      camY += (Math.random() - 0.5) * intensity * 0.5;
    }

    camera.position.set(camX, camY, camZ);
    camera.lookAt(position.x, position.y + lookY, position.z);
  });

  return null;
}
