import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { starFragmentShader, starVertexShader } from "./shaders";
import type { SceneProps } from "./types";

const STAR_COUNT = 1200;
const TUNNEL_DEPTH = 140;

function seeded(index: number) {
  return (Math.sin(index * 999.91) * 43758.5453) % 1;
}

/**
 * Stars wrap around the camera in the vertex shader, so the CPU only updates
 * two uniforms per frame instead of rewriting the whole position buffer.
 */
export function StarTunnel({ progressRef }: SceneProps) {
  const positions = useMemo(() => {
    const values = new Float32Array(STAR_COUNT * 3);
    for (let index = 0; index < STAR_COUNT; index += 1) {
      const radius = 2.5 + Math.abs(seeded(index)) * 27;
      const angle = seeded(index + 1000) * Math.PI * 2;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
      values[index * 3 + 2] = -Math.abs(seeded(index + 2000)) * 120 + 18;
    }
    return values;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTravel: { value: 0 }, uScale: { value: 450 } },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );
  const materialRef = useRef(material);
  const bufferSize = useMemo(() => new THREE.Vector2(), []);

  useFrame(({ gl }, delta) => {
    const { uniforms } = materialRef.current;
    const velocity = 9 + progressRef.current * 34;
    uniforms.uTravel.value =
      (uniforms.uTravel.value + delta * velocity) % TUNNEL_DEPTH;
    uniforms.uScale.value = gl.getDrawingBufferSize(bufferSize).y / 2;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
