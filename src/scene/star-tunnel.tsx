import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import type { SceneProps } from "./types";

function seeded(index: number) {
  return (Math.sin(index * 999.91) * 43758.5453) % 1;
}

export function StarTunnel({ progressRef }: SceneProps) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(1200 * 3);
    for (let index = 0; index < 1200; index += 1) {
      const radius = 2.5 + Math.abs(seeded(index)) * 27;
      const angle = seeded(index + 1000) * Math.PI * 2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
      values[index * 3 + 2] = -Math.abs(seeded(index + 2000)) * 120 + 18;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attribute = points.current.geometry.attributes.position;
    const velocity = 9 + progressRef.current * 34;
    for (let index = 0; index < attribute.count; index += 1) {
      const z = attribute.getZ(index) + delta * velocity;
      attribute.setZ(index, z > 20 ? z - 140 : z);
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#bceef6"
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </points>
  );
}
