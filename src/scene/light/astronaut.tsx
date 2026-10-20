import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "../types";
import { pathX, walkerPosition } from "./terrain";

const SUIT = "#f3f1ec";
const TRIM = "#1f8a93";

/** Chunky, rounded explorer built from primitives; it faces +z, the way it walks. */
export function Astronaut({ progressRef }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = useRef<Array<THREE.Group | null>>([]);
  const arms = useRef<Array<THREE.Group | null>>([]);
  const motion = useRef({ phase: 0, speed: 0, lastZ: 0 });
  const position = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    if (!root.current || !body.current || !head.current) return;
    const state = motion.current;
    walkerPosition(progressRef.current, position);

    // Walk speed comes from how fast the page is being scrolled.
    const distance = Math.abs(position.z - state.lastZ);
    state.lastZ = position.z;
    const speed = delta > 0 ? distance / delta : 0;
    state.speed = THREE.MathUtils.lerp(state.speed, speed, 0.12);
    const stride = THREE.MathUtils.clamp(state.speed / 3, 0, 1);
    state.phase += Math.min(state.speed * 1.85, 14) * delta;

    const t = clock.elapsedTime;
    const swing = Math.sin(state.phase) * stride;
    legs.current[0]!.rotation.x = swing * 0.8;
    legs.current[1]!.rotation.x = -swing * 0.8;
    arms.current[0]!.rotation.x = -swing * 0.6 + Math.sin(t * 1.4) * 0.03;
    arms.current[1]!.rotation.x = swing * 0.6 - Math.sin(t * 1.4) * 0.03;
    body.current.position.y =
      Math.abs(Math.cos(state.phase)) * 0.07 * stride +
      Math.sin(t * 2) * 0.012 * (1 - stride);
    head.current.rotation.y = Math.sin(t * 0.6) * 0.18 * (1 - stride);

    const ahead = pathX(position.z - 1) - position.x;
    root.current.position.copy(position);
    // Face along the trail (travel is toward -z).
    root.current.rotation.y = Math.atan2(ahead, -1);
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* torso and chest plate */}
        <mesh position={[0, 1.2, 0]}>
          <capsuleGeometry args={[0.36, 0.42, 8, 16]} />
          <meshStandardMaterial color={SUIT} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.28, 0.34]}>
          <boxGeometry args={[0.32, 0.22, 0.06]} />
          <meshStandardMaterial color={TRIM} roughness={0.5} />
        </mesh>
        {/* backpack */}
        <mesh position={[0, 1.22, -0.42]}>
          <boxGeometry args={[0.66, 0.78, 0.34]} />
          <meshStandardMaterial color={TRIM} roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.38, -0.6]}>
          <boxGeometry args={[0.4, 0.12, 0.04]} />
          <meshStandardMaterial
            color="#ffb45d"
            emissive="#ff9a2e"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.24, 1.82, -0.44]}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 6]} />
          <meshStandardMaterial color="#c9d3d6" />
        </mesh>
        <mesh position={[0.24, 2.08, -0.44]}>
          <sphereGeometry args={[0.06, 12, 8]} />
          <meshStandardMaterial
            color="#ffb45d"
            emissive="#ff9a2e"
            emissiveIntensity={0.9}
          />
        </mesh>
        {/* helmet */}
        <group ref={head} position={[0, 1.86, 0]}>
          <mesh>
            <sphereGeometry args={[0.4, 24, 18]} />
            <meshStandardMaterial color={SUIT} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0.2]} scale={[1, 0.78, 0.62]}>
            <sphereGeometry args={[0.3, 24, 18]} />
            <meshStandardMaterial
              color="#14213d"
              roughness={0.12}
              metalness={0.6}
            />
          </mesh>
        </group>
        {/* arms, pivoting at the shoulder */}
        {[-1, 1].map((side, index) => (
          <group
            key={side}
            ref={(node) => {
              arms.current[index] = node;
            }}
            position={[side * 0.5, 1.46, 0]}
          >
            <mesh position={[0, -0.28, 0]}>
              <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
              <meshStandardMaterial color={SUIT} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.62, 0]}>
              <sphereGeometry args={[0.13, 14, 10]} />
              <meshStandardMaterial color={TRIM} roughness={0.6} />
            </mesh>
          </group>
        ))}
        {/* legs, pivoting at the hip */}
        {[-1, 1].map((side, index) => (
          <group
            key={side}
            ref={(node) => {
              legs.current[index] = node;
            }}
            position={[side * 0.19, 0.84, 0]}
          >
            <mesh position={[0, -0.3, 0]}>
              <capsuleGeometry args={[0.14, 0.4, 6, 12]} />
              <meshStandardMaterial color={SUIT} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.64, 0.05]}>
              <boxGeometry args={[0.3, 0.2, 0.42]} />
              <meshStandardMaterial color={TRIM} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
