"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import Track from "./Track";
import Car from "./Car";
import Camera from "./Camera";
import DriftSmoke from "./DriftSmoke";
import Controls from "./Controls";
import HUD from "./HUD";
import MobileControls from "./MobileControls";
import { useGameStore } from "./GameState";
import { useIsMobile } from "@/hooks/useIsMobile";

function GameTick() {
  const tick = useGameStore((s) => s.tick);
  useFrame((_, delta) => {
    tick(delta);
  });
  return null;
}

function usePhysicsKey() {
  const t = useGameStore((s) => s.tuning);
  return `${t.mass}-${t.frictionSlip}-${t.sideAcceleration}-${t.rollInfluence}-${t.suspensionStiffness}-${t.suspensionRestLength}-${t.dampingCompression}-${t.dampingRelaxation}-${t.gravity}-${t.wheelRadius}-${t.frontAxle}-${t.rearAxle}-${t.trackWidth}-${t.wheelHeight}`;
}

export default function DriftGame() {
  const physicsKey = usePhysicsKey();
  const gravity = useGameStore((s) => s.tuning.gravity);
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-full" style={{ touchAction: "none" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{ fov: 40, near: 0.1, far: 500 }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} />
        <fog attach="fog" args={["#0a0a0a", 80, 300]} />

        <Physics
          key={physicsKey}
          broadphase="SAP"
          allowSleep={false}
          gravity={[0, gravity, 0]}
          stepSize={1 / 120}
          defaultContactMaterial={{
            friction: 1e-3,
            contactEquationRelaxation: 4,
          }}
        >
          <Track />
          <Car />
          <DriftSmoke />
          <GameTick />
        </Physics>
        <Camera />
      </Canvas>

      <HUD />
      <Controls />
      {isMobile && <MobileControls />}
    </div>
  );
}
