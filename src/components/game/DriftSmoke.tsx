"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "./GameState";

const MAX_PARTICLES = 60;
const LIFETIME = 0.6;
const SPAWN_RATE = 2;
const PARTICLE_SIZE = 0.12;

const BG_COLOR = new THREE.Color("#0a0a0a");
const SMOKE_COLOR = new THREE.Color("#aaaaaa");
const _color = new THREE.Color();

interface Particle {
  age: number;
  lifetime: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  active: boolean;
}

const _wheelPos = new THREE.Vector3();
const _dummy = new THREE.Object3D();

export default function DriftSmoke() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      arr.push({
        age: 0,
        lifetime: LIFETIME,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        scale: 0,
        active: false,
      });
    }
    return arr;
  }, []);

  // Initialize instance colors on first render
  const colorsInitialized = useRef(false);

  const nextIdx = useRef(0);

  const spawn = (wx: number, wy: number, wz: number) => {
    const p = particles[nextIdx.current];
    p.active = true;
    p.age = 0;
    p.lifetime = LIFETIME + Math.random() * 0.3;
    p.position.set(
      wx + (Math.random() - 0.5) * 0.4,
      wy,
      wz + (Math.random() - 0.5) * 0.4,
    );
    p.velocity.set(
      (Math.random() - 0.5) * 1.2,
      0.6 + Math.random() * 0.4,
      (Math.random() - 0.5) * 1.2,
    );
    p.scale = PARTICLE_SIZE + Math.random() * 0.05;
    nextIdx.current = (nextIdx.current + 1) % MAX_PARTICLES;
  };

  useFrame(({ scene }, delta) => {
    const dt = Math.min(delta, 0.05);
    const input = useGameStore.getState().input;
    const phase = useGameStore.getState().phase;
    const mesh = meshRef.current;
    if (!mesh) return;

    // Initialize instance colors once
    if (!colorsInitialized.current) {
      for (let i = 0; i < MAX_PARTICLES; i++) {
        mesh.setColorAt(i, BG_COLOR);
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colorsInitialized.current = true;
    }

    // Spawn new particles at rear wheels when drifting
    if (phase === "playing" && input.handbrake) {
      const vehicle = scene.getObjectByName("player-car")?.parent;
      if (vehicle && vehicle.children.length >= 5) {
        const rearWheels = [vehicle.children[3], vehicle.children[4]];
        for (const wheel of rearWheels) {
          wheel.getWorldPosition(_wheelPos);
          const count = Math.ceil(SPAWN_RATE * Math.random());
          for (let i = 0; i < count; i++) {
            spawn(_wheelPos.x, _wheelPos.y, _wheelPos.z);
          }
        }
      }
    }

    // Update all particles
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particles[i];
      if (!p.active) {
        _dummy.scale.setScalar(0);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
        mesh.setColorAt(i, BG_COLOR);
        continue;
      }

      p.age += dt;
      if (p.age >= p.lifetime) {
        p.active = false;
        _dummy.scale.setScalar(0);
        _dummy.updateMatrix();
        mesh.setMatrixAt(i, _dummy.matrix);
        mesh.setColorAt(i, BG_COLOR);
        continue;
      }

      const t = p.age / p.lifetime;

      // Move upward and spread outward
      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.position.z += p.velocity.z * dt;

      // Slow down over time
      p.velocity.multiplyScalar(1 - dt * 3);

      // Scale: quick grow, then hold
      const growPhase = Math.min(t / 0.15, 1);
      const s = p.scale * growPhase * 1.5;

      // Color: fade from smoke color toward background as it ages
      _color.copy(SMOKE_COLOR).lerp(BG_COLOR, t * t);

      _dummy.position.copy(p.position);
      _dummy.scale.setScalar(s);
      _dummy.quaternion.identity();
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
      mesh.setColorAt(i, _color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PARTICLES]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial vertexColors transparent opacity={0.25} depthWrite={false} />
    </instancedMesh>
  );
}
