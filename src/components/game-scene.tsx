"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { AdaptiveDpr, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type GameSceneProps = { progressRef: MutableRefObject<number> };

function seeded(index: number) {
  return (Math.sin(index * 999.91) * 43758.5453) % 1;
}

function StarTunnel({ progressRef }: GameSceneProps) {
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

  return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#bceef6" size={0.07} sizeAttenuation transparent opacity={0.82} depthWrite={false} /></points>;
}

function Planet({ progressRef }: GameSceneProps) {
  const planet = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!planet.current) return;
    const progress = progressRef.current;
    planet.current.position.z = THREE.MathUtils.lerp(-58, -14, progress);
    planet.current.position.x = THREE.MathUtils.lerp(4.8, 0.8, progress);
    planet.current.position.y = THREE.MathUtils.lerp(-3.6, -1.6, progress);
    planet.current.scale.setScalar(THREE.MathUtils.lerp(0.65, 2.5, progress));
    planet.current.rotation.y = clock.elapsedTime * 0.024;
  });

  return <group ref={planet}>
    <mesh><sphereGeometry args={[8, 96, 64]} /><meshStandardMaterial color="#263d68" emissive="#07172d" emissiveIntensity={0.9} roughness={0.76} metalness={0.08} /></mesh>
    <mesh scale={1.018}><sphereGeometry args={[8, 96, 64]} /><meshBasicMaterial color="#74d8ef" transparent opacity={0.11} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
    <mesh scale={1.09}><sphereGeometry args={[8, 96, 64]} /><meshBasicMaterial color="#3e9fda" transparent opacity={0.09} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
    <pointLight color="#7eeaf3" intensity={18} distance={48} decay={2} position={[-6, 4, 3]} />
  </group>;
}

function FlightCraft({ progressRef }: GameSceneProps) {
  const craft = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!craft.current) return;
    craft.current.position.x = Math.sin(clock.elapsedTime * 0.45) * 0.12;
    craft.current.position.y = -1.55 + Math.cos(clock.elapsedTime * 0.36) * 0.06;
    craft.current.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.035;
    craft.current.position.z = THREE.MathUtils.lerp(3, -1, progressRef.current);
  });
  return <group ref={craft} rotation={[0.12, Math.PI, 0]}>
    <mesh castShadow><coneGeometry args={[0.34, 2.3, 4]} /><meshStandardMaterial color="#2c4d68" roughness={0.27} metalness={0.9} /></mesh>
    <mesh position={[0, 0.18, 0.6]} rotation={[0, Math.PI / 4, 0]}><octahedronGeometry args={[0.33, 2]} /><meshPhysicalMaterial color="#0e2b45" roughness={0.07} metalness={0.95} clearcoat={1} /></mesh>
    <pointLight color="#5deaf1" intensity={6} distance={10} decay={2} position={[0, -0.2, -1.15]} />
  </group>;
}

function CameraFlight({ progressRef }: GameSceneProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const progress = progressRef.current;
    camera.position.lerp(new THREE.Vector3(0, 0.35 + Math.sin(clock.elapsedTime * 0.22) * 0.08, THREE.MathUtils.lerp(16, 2, progress)), 0.055);
    target.set(THREE.MathUtils.lerp(1.6, 0.6, progress), THREE.MathUtils.lerp(-0.5, -1.1, progress), THREE.MathUtils.lerp(-24, -15, progress));
    camera.lookAt(target);
  });
  return null;
}

function Flight({ progressRef }: GameSceneProps) {
  return <>
    <color attach="background" args={["#020711"]} />
    <fog attach="fog" args={["#020711", 24, 96]} />
    <ambientLight intensity={0.08} />
    <directionalLight color="#9ddff2" intensity={1.8} position={[-8, 5, 8]} />
    <StarTunnel progressRef={progressRef} />
    <Planet progressRef={progressRef} />
    <FlightCraft progressRef={progressRef} />
    <Sparkles count={120} scale={[34, 18, 82]} size={1.4} speed={0.13} color="#78ddec" position={[0, 0, -25]} />
    <CameraFlight progressRef={progressRef} />
    <EffectComposer multisampling={0}><Bloom luminanceThreshold={0.65} mipmapBlur intensity={1.05} radius={0.62} /><Vignette offset={0.12} darkness={0.92} /></EffectComposer>
  </>;
}

export default function GameScene({ progressRef }: GameSceneProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <div className="game-scene" aria-hidden="true">{enabled && <Canvas dpr={[1, 1.75]} camera={{ fov: 48, position: [0, 0.35, 16] }} gl={{ antialias: false, powerPreference: "high-performance" }}><AdaptiveDpr pixelated /><Flight progressRef={progressRef} /></Canvas>}</div>;
}
