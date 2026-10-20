import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "./types";

export function FlightCraft({ progressRef }: SceneProps) {
  const craft = useRef<THREE.Group>(null);
  const engine = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!craft.current) return;
    const elapsed = performance.now() / 1000;
    const arrival = THREE.MathUtils.smoothstep(progressRef.current, 0.72, 0.94);
    craft.current.position.x =
      THREE.MathUtils.lerp(3.9, 0, arrival) + Math.sin(elapsed * 0.45) * 0.12;
    craft.current.position.y =
      THREE.MathUtils.lerp(-1.3, -0.3, arrival) +
      Math.cos(elapsed * 0.36) * 0.06;
    craft.current.rotation.x = THREE.MathUtils.lerp(0.08, 0, arrival);
    craft.current.rotation.y = THREE.MathUtils.lerp(
      Math.PI,
      Math.PI * 2,
      arrival,
    );
    craft.current.rotation.z = THREE.MathUtils.lerp(-0.18, 0, arrival);
    const cruiseZ = THREE.MathUtils.lerp(3, -0.3, progressRef.current);
    craft.current.position.z = THREE.MathUtils.lerp(cruiseZ, 2.05, arrival);
    if (engine.current)
      engine.current.intensity = 4 + Math.sin(elapsed * 7) * 2 + arrival * 8;
  });
  return (
    <group ref={craft} rotation={[0.08, Math.PI, 0]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.26, 1.9, 8, 24]} />
        <meshStandardMaterial
          color="#dfff78"
          emissive="#6ca72f"
          emissiveIntensity={0.32}
          roughness={0.32}
          metalness={0.42}
        />
      </mesh>
      <mesh
        position={[0, 0.13, 0.58]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[0.85, 0.62, 1.3]}
      >
        <sphereGeometry args={[0.34, 32, 20]} />
        <meshPhysicalMaterial
          color="#e6edef"
          roughness={0.14}
          metalness={0.78}
          clearcoat={1}
        />
      </mesh>
      <mesh
        castShadow
        position={[-0.67, -0.06, -0.08]}
        rotation={[0.04, 0.18, -0.1]}
      >
        <boxGeometry args={[1.26, 0.06, 0.42]} />
        <meshStandardMaterial
          color="#efffab"
          emissive="#6ca72f"
          emissiveIntensity={0.26}
          roughness={0.35}
          metalness={0.35}
        />
      </mesh>
      <mesh
        castShadow
        position={[0.67, -0.06, -0.08]}
        rotation={[0.04, -0.18, 0.1]}
      >
        <boxGeometry args={[1.26, 0.06, 0.42]} />
        <meshStandardMaterial
          color="#efffab"
          emissive="#6ca72f"
          emissiveIntensity={0.26}
          roughness={0.35}
          metalness={0.35}
        />
      </mesh>
      <mesh position={[0, -0.02, -1.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 0.38, 20]} />
        <meshStandardMaterial
          color="#8e979d"
          emissive="#f04420"
          emissiveIntensity={2.4}
          metalness={0.85}
        />
      </mesh>
      <pointLight
        ref={engine}
        color="#ff5a24"
        intensity={4}
        distance={12}
        decay={2}
        position={[0, -0.02, -1.48]}
      />
      <pointLight
        color="#ffb45d"
        intensity={3}
        distance={5}
        decay={2}
        position={[-0.7, 0, 0.2]}
      />
      <pointLight
        color="#ffb45d"
        intensity={3}
        distance={5}
        decay={2}
        position={[0.7, 0, 0.2]}
      />
    </group>
  );
}
