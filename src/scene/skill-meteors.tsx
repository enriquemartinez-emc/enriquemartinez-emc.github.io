import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "./types";

const skillMeteors = [
  { color: "#5deaf1", x: -3.4, y: 1.5, trigger: 0.18 },
  { color: "#a78bfa", x: 2.2, y: 2.5, trigger: 0.3 },
  { color: "#ffb45d", x: -1.5, y: -0.3, trigger: 0.42 },
  { color: "#f577a1", x: 4.1, y: 0.6, trigger: 0.54 },
];

export function SkillMeteors({ progressRef }: SceneProps) {
  const groups = useRef<Array<THREE.Group | null>>([]);
  useFrame(() => {
    const planetZ = THREE.MathUtils.lerp(-58, -14, progressRef.current);
    groups.current.forEach((meteor, index) => {
      if (!meteor) return;
      const signal = skillMeteors[index];
      const phase = THREE.MathUtils.smoothstep(
        progressRef.current,
        signal.trigger,
        signal.trigger + 0.24,
      );
      meteor.position.set(
        signal.x - phase * 1.8,
        signal.y,
        THREE.MathUtils.lerp(planetZ + 2, 5, phase),
      );
      meteor.rotation.set(0, 0, 0);
      meteor.visible = phase > 0 && phase < 0.98;
    });
  });

  return (
    <>
      {skillMeteors.map((meteor, index) => (
        <group
          key={meteor.color}
          ref={(node) => {
            groups.current[index] = node;
          }}
        >
          <mesh>
            <icosahedronGeometry args={[0.28, 2]} />
            <meshStandardMaterial
              color="#142b42"
              emissive={meteor.color}
              emissiveIntensity={2.2}
              roughness={0.25}
              metalness={0.72}
            />
          </mesh>
          <mesh position={[0, 0, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.17, 2.7, 12, 1, true]} />
            <meshBasicMaterial
              color={meteor.color}
              transparent
              opacity={0.34}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <pointLight
            color={meteor.color}
            intensity={5}
            distance={7}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}
