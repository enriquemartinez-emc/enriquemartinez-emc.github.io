import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { random } from "./terrain";

const clouds = Array.from({ length: 7 }, (_, index) => ({
  x: (random(index * 3.1) - 0.5) * 120,
  y: 20 + random(index * 5.7) * 16,
  z: -70 - random(index * 8.3) * 70,
  scale: 3 + random(index * 2.9) * 3,
}));

/** Distant backdrop that rides along with the camera, so it never gets closer. */
export function Sky() {
  const group = useRef<THREE.Group>(null);
  const drift = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    if (group.current) group.current.position.z = camera.position.z;
    if (drift.current)
      drift.current.position.x = (clock.elapsedTime * 0.6) % 120;
  });

  return (
    <group ref={group}>
      {/* a neighbouring planet low on the horizon */}
      <mesh position={[16, 9, -190]}>
        <sphereGeometry args={[26, 32, 24]} />
        <meshStandardMaterial
          color="#86c4cd"
          emissive="#4f9aa6"
          emissiveIntensity={0.45}
          roughness={1}
          fog={false}
        />
      </mesh>
      <group ref={drift} position={[-60, 0, 0]}>
        {clouds.map((cloud) => (
          <group
            key={cloud.x}
            position={[cloud.x, cloud.y, cloud.z]}
            scale={cloud.scale}
          >
            {[
              [0, 0, 0, 1],
              [1.1, -0.1, 0.1, 0.75],
              [-1.05, -0.15, 0, 0.7],
            ].map(([x, y, z, radius]) => (
              <mesh
                key={x}
                position={[x, y, z]}
                scale={[radius, radius * 0.6, radius]}
              >
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                  color="#fff6e8"
                  emissive="#ffffff"
                  emissiveIntensity={0.35}
                  flatShading
                  fog={false}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
