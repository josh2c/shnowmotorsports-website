# Shnow Drift Game — Engineering Reference

## Status: Playable (v1)

60-second arcade drift challenge on a circular track. Hold space to drift, release for turbo boost. Combo multipliers reward sustained drifts. High scores persist to localStorage.

---

## Stack

| Package | Version | Role |
|---------|---------|------|
| `@react-three/fiber` | 9.5.0 | React renderer for Three.js |
| `@react-three/cannon` | 6.6.0 | Physics (cannon-es raycast vehicle) |
| `three` | 0.182.0 | 3D math, rendering |
| `zustand` | 5.0.11 | Game state management |
| `next` | 15.5.12 | Framework (static export) |
| `react` | 19.x | UI |

**Next.js config note:** `transpilePackages` must include `@react-three/cannon` and `@pmndrs/cannon-worker-api` — cannon uses an inline web worker that breaks without transpilation.

---

## File Map

```
src/components/game/
├── GameModal.tsx    — Fullscreen modal wrapper, lazy-loads game, WebGL check
├── DriftGame.tsx    — Canvas + Physics provider + scene composition
├── Car.tsx          — Raycast vehicle physics, drift detection, turbo, visual model
├── Track.tsx        — Ground plane + barrier colliders + road ring visuals
├── Camera.tsx       — Chase cam with yaw-only tracking
├── Controls.tsx     — Keyboard input → Zustand store
├── HUD.tsx          — Score, timer, drift indicator, turbo flash, menus
├── GameState.tsx    — Zustand store: phase, input, scoring, boost state
└── constants.ts     — All tunable parameters (vehicle, wheel, scoring, track, camera)
```

---

## Architecture

### Scene Tree

```
<Canvas dpr={[1,1.5]} fov={60}>
  <Physics broadphase="SAP" gravity={[0,-9.81,0]}>
    <Track />        ← ground (usePlane) + 64 barrier boxes (useBox, static)
    <Car />          ← chassis (useBox) + 4 wheels (useCompoundBody) + useRaycastVehicle
    <Camera />       ← chase cam (reads car matrix, yaw-only offset)
    <GameTick />     ← calls store.tick(delta) each frame
  </Physics>
  <HUD />            ← React overlay (absolute positioned)
  <Controls />       ← keyboard listener (renders nothing)
</Canvas>
```

### Game Lifecycle

```
menu → [Start button] → playing → [60s timer] → ended → [Replay/Menu]
```

- `GameModal` controls open/close, lazy-loads `DriftGame` with `ssr: false`
- `startGame()` resets score/timer/combo, sets phase to "playing"
- `Car.tsx` detects phase transition and resets chassis position/velocity
- `endGame()` finalizes score, saves high score to localStorage
- `resetGame()` returns to menu phase

---

## Physics System (Cannon-ES)

### Vehicle Setup

The car uses cannon's **RaycastVehicle** — wheels cast rays downward to detect ground contact and apply forces. No wheel-body constraints needed.

| Component | Hook | Type | Details |
|-----------|------|------|---------|
| Chassis | `useBox` | Dynamic, mass 500 | Box 1.2 x 0.5 x 2.4 |
| 4 Wheels | `useCompoundBody` | Kinematic | Cylinder r=0.2, collisionFilterGroup=0 |
| Vehicle | `useRaycastVehicle` | — | Connects chassis + wheels |

### Driving Controls (per frame)

| Input | API Call | Target |
|-------|----------|--------|
| Throttle (W/Up) | `applyEngineForce(-1500, rear)` | Rear wheels (2,3) |
| Reverse (S/Down) | `applyEngineForce(+750, rear)` | Rear wheels (2,3) |
| Steer (A/D) | `setSteeringValue(angle, front)` | Front wheels (0,1) |
| Handbrake (Space) | `setBrake(50, rear)` | Rear wheels only |

Engine and steering values are **lerped** (`dt * 20` rate) for smooth feel.

### Drift Mechanic

Drifting is **emergent from physics**, not manually coded:

1. **Hold Space** → rear wheels lock via `setBrake` → rear loses traction → oversteer/slide
2. `frictionSlip: 1.5` controls how easily wheels slide laterally (lower = more slide)
3. **Release Space** → brakes release + turbo impulse applied forward

Turbo impulse on release:
```
boost = min(driftTime * 4.0, 15)
impulse = boost * mass * 0.1 * forward_direction
```

### Drift Angle Detection

Computes signed angle between chassis forward vector and velocity vector:
```
forward = Vector3(0, 0, -1).applyQuaternion(chassisQuaternion)
velDir = Vector3(vx, 0, vz).normalize()
driftAngle = signed angle between them (via dot + cross product)
```

### Critical Gotcha: Matrix Decomposition

Cannon sets `object.matrix` directly and disables `matrixAutoUpdate`. This means `.position` and `.quaternion` on the Three.js object are **stale**. Both `Camera.tsx` and `Car.tsx` must call:
```ts
object.matrix.decompose(pos, quat, scale)
```
to get the real values before using them.

---

## Scoring System

```
driftPoints = |angle| * speed * SPEED_MULTIPLIER(2) * comboMultiplier * delta
```

- Minimum drift angle to score: **0.15 rad (~8.6 degrees)**
- Minimum speed to score: **3 units/sec**
- Combo increases by **0.5x every 3 seconds** of continuous drifting, capped at **5x**
- Points accumulate as `currentDriftScore` during drift
- When drift angle drops below threshold → `bankDrift()` adds to permanent score and resets combo
- High score persisted to `localStorage["shnow-highscore"]`

---

## Track Geometry

Flat circular arena:

| Parameter | Value |
|-----------|-------|
| Outer radius | 45 units |
| Inner radius | 20 units |
| Driving surface | Ring between r=21 and r=44 |
| Barrier segments | 32 per ring (sized to overlap, no gaps) |
| Outer barrier size | 9.5 x 1.5 x 1.5 (rotated tangent) |
| Inner barrier size | 4.5 x 1.5 x 1.2 (rotated tangent) |
| Ground plane | 120 x 120 |

All barriers are static `useBox` colliders. Ground is a static `usePlane`.

---

## Camera

Chase cam with **yaw-only** tracking (ignores pitch/roll wobble from physics):

1. Decompose chassis matrix → extract position + quaternion
2. Convert quaternion to Euler (YXZ order) → extract yaw only
3. Offset `(0, 6, -10)` rotated by yaw around Y axis
4. Lerp camera position toward offset (speed 0.06)
5. `lookAt` car position + 0.8 Y offset

Snaps instantly on first frame to avoid initial lag.

---

## Tuning Guide

### Primary Knobs

| Constant | Location | Effect |
|----------|----------|--------|
| `WHEEL.FRICTION_SLIP` | constants.ts | **Main drift feel.** Lower = more slide. Current: 1.5 |
| `VEHICLE.FORCE` | constants.ts | Engine power. Current: 1500 |
| `VEHICLE.STEER` | constants.ts | Max steer angle (rad). Current: 0.35 (~20 deg) |
| `VEHICLE.MAX_BRAKE` | constants.ts | Handbrake strength. Current: 50 |
| `VEHICLE.ANGULAR_DAMPING` | constants.ts | Spin resistance. Higher = less spinout. Current: 0.4 |
| `CAMERA.LERP_SPEED` | constants.ts | Camera follow tightness. Current: 0.06 |

### Scoring Knobs

| Constant | Location | Effect |
|----------|----------|--------|
| `SCORING.MIN_DRIFT_ANGLE` | constants.ts | Angle threshold to count as drifting. Current: 0.15 rad |
| `SCORING.COMBO_INTERVAL` | constants.ts | Seconds of drift per +0.5x combo. Current: 3s |
| `SCORING.MAX_COMBO` | constants.ts | Combo cap. Current: 5x |
| `SCORING.ROUND_DURATION` | constants.ts | Game length. Current: 60s |

---

## Performance Notes

- **GC optimization:** Car.tsx and Camera.tsx pre-allocate reusable Vector3/Quaternion/Euler objects outside useFrame loops — zero allocations in hot path
- **Physics bodies:** 1 dynamic (chassis) + 4 kinematic (wheels) + 65 static (ground + 64 barriers) = 70 total. SAP broadphase efficiently culls static-static pairs
- **Mutable refs for speed:** `speedRef`, `velocityRef`, `engineRef`, `steeringRef` are plain refs, not React state — avoids re-renders at 60fps
- **Velocity subscription:** Chassis velocity tracked via `chassisApi.velocity.subscribe()` callback, not polled
- **Lazy loading:** Game canvas only mounts when modal opens (`next/dynamic` with `ssr: false`)
- **Canvas DPR:** Adaptive `[1, 1.5]` — no retina overhead on low-end devices

---

## What's Not Implemented Yet

- Mobile/touch controls
- Audio (engine sound, drift screech, boost SFX)
- Visual effects (skid marks, dust particles, boost trail)
- Multiple tracks/arenas
- Leaderboard (currently local-only high score)
- Car model (currently primitive boxes — could load GLTF)
- Lap counter / checkpoint system
