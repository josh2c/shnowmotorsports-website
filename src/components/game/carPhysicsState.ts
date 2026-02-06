import { TRACK } from "./constants";

interface PhysicsVec3 {
  x: number;
  y: number;
  z: number;
}

interface PhysicsQuat {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface CarPhysicsState {
  position: PhysicsVec3;
  quaternion: PhysicsQuat;
  velocity: PhysicsVec3;
  speed: number;
}

export const carPhysicsState: CarPhysicsState = {
  position: { x: TRACK.START_X, y: 0.5, z: TRACK.START_Z },
  quaternion: { x: 0, y: 0, z: 0, w: 1 },
  velocity: { x: 0, y: 0, z: 0 },
  speed: 0,
};
