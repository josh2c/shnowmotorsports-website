"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { usePlane, useBox, useTrimesh } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { TRACK } from "./constants";
import { useGameStore } from "./GameState";

const { LOT_WIDTH, LOT_LENGTH, WALL_HEIGHT, WALL_THICKNESS } = TRACK;

// Color palette — realistic concrete parking lot
const COLORS = {
  concrete: "#808080",
  asphalt: "#4a4a4a",
  lineWhite: "#dddddd",
  curbYellow: "#e8b800",
  barrier: "#707070",
  parkedCar: "#3d3d3d",
  cone: "#ff6b00",
  pole: "#888888",
  ground: "#2a2a2a",
} as const;

function Ground() {
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color={COLORS.ground} />
    </mesh>
  );
}

function Wall({
  position,
  args,
  color = COLORS.barrier,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color?: string;
}) {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args,
  }));

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Cone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cone body */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color={COLORS.cone} />
      </mesh>
      {/* White reflective stripe */}
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.16, 0.12, 8]} />
        <meshStandardMaterial color="#dddddd" emissive="#dddddd" emissiveIntensity={0.15} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color={COLORS.cone} />
      </mesh>
    </group>
  );
}

function ParkingLines() {
  const lines = useMemo(() => {
    const perpLines: { position: [number, number, number]; size: [number, number] }[] = [];
    const dashLines: { position: [number, number, number]; size: [number, number] }[] = [];

    // Top parking row — perpendicular white lines (left half)
    for (let i = -4; i <= 0; i++) {
      perpLines.push({
        position: [i * 3.5 - 10, 0.011, -LOT_LENGTH / 2 + 5],
        size: [0.1, 5],
      });
    }

    // Top parking row — perpendicular white lines (right half)
    for (let i = 0; i <= 4; i++) {
      perpLines.push({
        position: [i * 3.5 + 10, 0.011, -LOT_LENGTH / 2 + 5],
        size: [0.1, 5],
      });
    }

    // Bottom parking row — perpendicular white lines (left half)
    for (let i = -4; i <= 0; i++) {
      perpLines.push({
        position: [i * 3.5 - 10, 0.011, LOT_LENGTH / 2 - 5],
        size: [0.1, 5],
      });
    }

    // Bottom parking row — perpendicular white lines (right half)
    for (let i = 0; i <= 4; i++) {
      perpLines.push({
        position: [i * 3.5 + 10, 0.011, LOT_LENGTH / 2 - 5],
        size: [0.1, 5],
      });
    }

    // Top lane divider — dashed line
    for (let x = -LOT_WIDTH / 2 + 5; x < LOT_WIDTH / 2 - 5; x += 4) {
      dashLines.push({
        position: [x, 0.011, -LOT_LENGTH / 2 + 12],
        size: [2, 0.12],
      });
    }

    // Bottom lane divider — dashed line
    for (let x = -LOT_WIDTH / 2 + 5; x < LOT_WIDTH / 2 - 5; x += 4) {
      dashLines.push({
        position: [x, 0.011, LOT_LENGTH / 2 - 12],
        size: [2, 0.12],
      });
    }

    // Center dashed line running the length
    for (let z = -LOT_LENGTH / 2 + 18; z < LOT_LENGTH / 2 - 18; z += 4) {
      dashLines.push({
        position: [0, 0.011, z],
        size: [0.12, 2],
      });
    }

    return { perpLines, dashLines };
  }, []);

  return (
    <group>
      {lines.perpLines.map((line, i) => (
        <mesh key={`perp-${i}`} position={line.position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={line.size} />
          <meshBasicMaterial color={COLORS.lineWhite} />
        </mesh>
      ))}
      {lines.dashLines.map((line, i) => (
        <mesh key={`dash-${i}`} position={line.position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={line.size} />
          <meshBasicMaterial color={COLORS.lineWhite} />
        </mesh>
      ))}
    </group>
  );
}

function CurbStripes() {
  const stripes = useMemo(() => {
    const arr: { position: [number, number, number]; size: [number, number]; rotation: number }[] = [];

    // Yellow curb along north wall
    arr.push({ position: [0, 0.009, -LOT_LENGTH / 2 + 0.3], size: [LOT_WIDTH, 0.6], rotation: 0 });
    // Yellow curb along south wall
    arr.push({ position: [0, 0.009, LOT_LENGTH / 2 - 0.3], size: [LOT_WIDTH, 0.6], rotation: 0 });
    // Yellow curb along east wall
    arr.push({ position: [LOT_WIDTH / 2 - 0.3, 0.009, 0], size: [0.6, LOT_LENGTH], rotation: 0 });
    // Yellow curb along west wall
    arr.push({ position: [-LOT_WIDTH / 2 + 0.3, 0.009, 0], size: [0.6, LOT_LENGTH], rotation: 0 });

    return arr;
  }, []);

  return (
    <group>
      {stripes.map((s, i) => (
        <mesh key={`curb-${i}`} position={s.position} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={s.size} />
          <meshBasicMaterial color={COLORS.curbYellow} />
        </mesh>
      ))}
    </group>
  );
}

function LightPoles() {
  const poles: [number, number][] = [
    [-25, -40],
    [25, -40],
    [-25, 0],
    [25, 0],
    [-25, 40],
    [25, 40],
  ];

  return (
    <group>
      {poles.map(([x, z], i) => (
        <group key={`light-${i}`}>
          {/* Pole */}
          <mesh position={[x, 5, z]}>
            <cylinderGeometry args={[0.08, 0.12, 10, 6]} />
            <meshStandardMaterial color={COLORS.pole} metalness={0.3} roughness={0.7} />
          </mesh>
          {/* Light fixture */}
          <mesh position={[x, 10.2, z]}>
            <boxGeometry args={[0.8, 0.15, 0.4]} />
            <meshStandardMaterial color="#999999" />
          </mesh>
          {/* Light source */}
          <pointLight
            position={[x, 10, z]}
            intensity={40}
            distance={35}
            color="#ffeedd"
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}

const RACE_TRACK_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/models/race-track.glb`;

function RaceTrackModel() {
  const { scene } = useGLTF(RACE_TRACK_PATH);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const t = useGameStore((s) => s.trackTransform);

  return (
    <primitive
      object={cloned}
      scale={t.scale}
      position={[t.posX, t.posY, t.posZ]}
      rotation={[0, t.rotY, 0]}
    />
  );
}

function RaceTrackCollider() {
  const { scene } = useGLTF(RACE_TRACK_PATH);
  const t = useGameStore((s) => s.trackTransform);

  const { vertices, indices } = useMemo(() => {
    scene.updateMatrixWorld(true);

    const allVerts: number[] = [];
    const allIndices: number[] = [];
    let vertexOffset = 0;

    const cosR = Math.cos(t.rotY);
    const sinR = Math.sin(t.rotY);
    const v = new THREE.Vector3();

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.geometry) return;
      const geo = child.geometry;
      const pos = geo.attributes.position;
      const idx = geo.index;
      if (!pos || !idx) return;

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.applyMatrix4(child.matrixWorld);

        // Apply track transform: scale → rotate → translate
        v.multiplyScalar(t.scale);
        const rx = v.x * cosR - v.z * sinR;
        const rz = v.x * sinR + v.z * cosR;
        allVerts.push(rx + t.posX, v.y + t.posY, rz + t.posZ);
      }

      for (let i = 0; i < idx.count; i++) {
        allIndices.push(idx.array[i] + vertexOffset);
      }

      vertexOffset += pos.count;
    });

    return {
      vertices: new Float32Array(allVerts),
      indices: allIndices,
    };
  }, [scene, t.scale, t.posX, t.posY, t.posZ, t.rotY]);

  useTrimesh(() => ({
    type: "Static",
    args: [vertices, indices],
  }), undefined, [vertices, indices]);

  return null;
}

useGLTF.preload(RACE_TRACK_PATH);

export default function Track() {
  const cones = useMemo(() => {
    const arr: [number, number, number][] = [];

    // Oval ring in center drift zone
    const ovalCount = 16;
    for (let i = 0; i < ovalCount; i++) {
      const theta = (i / ovalCount) * Math.PI * 2;
      arr.push([
        Math.cos(theta) * 18,
        0.35,
        Math.sin(theta) * 28,
      ]);
    }

    // Slalom line on left side
    for (let i = -3; i <= 3; i++) {
      arr.push([
        -10 + (i % 2 === 0 ? 3 : -3),
        0.35,
        i * 7,
      ]);
    }

    return arr;
  }, []);

  const halfW = LOT_WIDTH / 2;
  const halfL = LOT_LENGTH / 2;

  return (
    <group>
      <Ground />

      {/* Concrete surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[LOT_WIDTH, LOT_LENGTH]} />
        <meshStandardMaterial color={COLORS.concrete} roughness={0.95} />
      </mesh>

      {/* Driving lane overlay (darker worn asphalt in the lanes) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0]}>
        <planeGeometry args={[LOT_WIDTH - 16, LOT_LENGTH - 20]} />
        <meshStandardMaterial color={COLORS.asphalt} roughness={0.9} />
      </mesh>

      <CurbStripes />
      <ParkingLines />

      {/* Perimeter jersey barriers */}
      <Wall position={[0, WALL_HEIGHT / 2, -halfL]} args={[LOT_WIDTH + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]} />
      {/* South wall — split with gap for race course exit */}
      <Wall position={[-27.75, WALL_HEIGHT / 2, halfL]} args={[25, WALL_HEIGHT, WALL_THICKNESS]} />
      <Wall position={[27.75, WALL_HEIGHT / 2, halfL]} args={[25, WALL_HEIGHT, WALL_THICKNESS]} />
      <Wall position={[halfW, WALL_HEIGHT / 2, 0]} args={[WALL_THICKNESS, WALL_HEIGHT, LOT_LENGTH]} />
      <Wall position={[-halfW, WALL_HEIGHT / 2, 0]} args={[WALL_THICKNESS, WALL_HEIGHT, LOT_LENGTH]} />

      {/* Parked car blocks — top row */}
      <Wall position={[-24, 0.5, -halfL + 5]} args={[2.4, 1, 4.5]} color={COLORS.parkedCar} />
      <Wall position={[-17, 0.5, -halfL + 5]} args={[2.4, 1, 4.5]} color="#353535" />
      <Wall position={[17, 0.5, -halfL + 5]} args={[2.4, 1, 4.5]} color="#2e2e2e" />
      <Wall position={[24, 0.5, -halfL + 5]} args={[2.4, 1, 4.5]} color={COLORS.parkedCar} />

      {/* Parked car blocks — bottom row */}
      <Wall position={[-24, 0.5, halfL - 5]} args={[2.4, 1, 4.5]} color="#353535" />
      <Wall position={[-17, 0.5, halfL - 5]} args={[2.4, 1, 4.5]} color={COLORS.parkedCar} />
      <Wall position={[17, 0.5, halfL - 5]} args={[2.4, 1, 4.5]} color={COLORS.parkedCar} />
      <Wall position={[24, 0.5, halfL - 5]} args={[2.4, 1, 4.5]} color="#2e2e2e" />

      {/* Cones */}
      {cones.map((pos, i) => (
        <Cone key={`cone-${i}`} position={pos} />
      ))}

      <RaceTrackModel />
      <RaceTrackCollider />
      <LightPoles />
    </group>
  );
}
