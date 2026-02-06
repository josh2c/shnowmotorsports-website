"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/skyline-r34.glb`;

function MiniCar() {
  const { scene } = useGLTF(MODEL_PATH);
  const ref = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return cloned;
  }, [scene]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={ref} object={model} scale={0.8} />;
}

export default function CarPreview() {
  return (
    <div className="w-24 h-24 pointer-events-none group-hover:scale-110 transition-transform duration-300">
      <Canvas
        camera={{ position: [4, 2, 4], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <MiniCar />
        </Suspense>
      </Canvas>
    </div>
  );
}
