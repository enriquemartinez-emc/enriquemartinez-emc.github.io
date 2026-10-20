import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
  cloudFragmentShader,
  planetFragmentShader,
  planetVertexShader,
} from "./shaders";
import type { SceneProps } from "./types";

function PlanetSurface() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: planetVertexShader,
        fragmentShader: planetFragmentShader,
      }),
    [],
  );
  const materialRef = useRef(material);

  useFrame((_, delta) => {
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <sphereGeometry args={[8, 96, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function PlanetClouds() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: planetVertexShader,
        fragmentShader: cloudFragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const materialRef = useRef(material);

  useFrame((_, delta) => {
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh scale={1.012} rotation={[0.04, 0, -0.08]}>
      <sphereGeometry args={[8, 64, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function Planet({ progressRef }: SceneProps) {
  const planet = useRef<THREE.Group>(null);
  const moonOrbit = useRef<THREE.Group>(null);
  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    [],
  );

  useFrame(() => {
    if (!planet.current) return;
    const elapsed = performance.now() / 1000;
    const progress = progressRef.current;
    planet.current.position.z = THREE.MathUtils.lerp(-58, -14, progress);
    planet.current.position.x = THREE.MathUtils.lerp(4.8, 0.8, progress);
    planet.current.position.y = THREE.MathUtils.lerp(-3.6, -1.6, progress);
    planet.current.scale.setScalar(THREE.MathUtils.lerp(0.65, 1.8, progress));
    planet.current.rotation.y = elapsed * 0.024;
    if (moonOrbit.current) moonOrbit.current.rotation.y = elapsed * 0.05;
  });

  return (
    <group ref={planet}>
      <PlanetSurface />
      <PlanetClouds />
      <mesh scale={1.045}>
        <sphereGeometry args={[8, 64, 48]} />
        <primitive object={atmosphere} attach="material" />
      </mesh>
      <group ref={moonOrbit} rotation={[0.3, 0, 0.12]}>
        <mesh position={[18, 2.5, 0]}>
          <sphereGeometry args={[1.6, 32, 24]} />
          <meshStandardMaterial
            color="#9b97b3"
            emissive="#2a2840"
            roughness={1}
          />
        </mesh>
      </group>
      <pointLight
        color="#ff6cae"
        intensity={22}
        distance={48}
        decay={2}
        position={[-6, 4, 3]}
      />
    </group>
  );
}
