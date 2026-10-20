import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "./types";

export function LandingPlatform({ progressRef }: SceneProps) {
  const platform = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!platform.current) return;
    const progress = progressRef.current;
    const landing = THREE.MathUtils.smoothstep(progress, 0.78, 0.96);
    const radius = 8 * THREE.MathUtils.lerp(0.65, 1.8, progress);

    platform.current.position.set(
      THREE.MathUtils.lerp(4.8, 0.8, progress) - 0.8,
      THREE.MathUtils.lerp(-3.6, -1.6, progress) + 1.3,
      THREE.MathUtils.lerp(-58, -14, progress) + radius + 0.12,
    );
    platform.current.visible = landing > 0.01;
    platform.current.scale.setScalar(0.82 + landing * 0.18);
  });

  return (
    <group
      ref={platform}
      position={[0, -0.3, 0.46]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <mesh receiveShadow>
        <cylinderGeometry args={[1.18, 1.42, 0.18, 32]} />
        <meshStandardMaterial
          color="#52636d"
          roughness={0.5}
          metalness={0.78}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.035, 8, 32]} />
        <meshStandardMaterial
          color="#dfff78"
          emissive="#86be3b"
          emissiveIntensity={1.8}
          roughness={0.3}
          metalness={0.55}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.025, 32]} />
        <meshStandardMaterial
          color="#1a2930"
          roughness={0.38}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
