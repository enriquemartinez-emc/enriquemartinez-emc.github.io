"use client";

import { Bloom, EffectComposer, SSAO, Vignette } from "@react-three/postprocessing";
import { AdaptiveDpr, ContactShadows, Environment, Float, Sparkles, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type GameSceneProps = { progressRef: MutableRefObject<number> };

const explorerAsset = "https://threejs.org/examples/models/gltf/Xbot.glb";

const terrainHeight = (x: number, z: number) =>
  Math.sin(x * 0.18) * 0.42 + Math.cos(z * 0.11) * 0.65 + Math.sin((x - z) * 0.07) * 0.55;

function Terrain() {
  const geometry = useMemo(() => {
    const result = new THREE.PlaneGeometry(54, 78, 96, 128);
    const positions = result.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getY(index);
      positions.setZ(index, terrainHeight(x, z));
    }
    result.computeVertexNormals();
    result.rotateX(-Math.PI / 2);
    return result;
  }, []);

  return <mesh geometry={geometry} position={[0, 0, -15]} receiveShadow>
    <meshStandardMaterial color="#443338" roughness={0.93} metalness={0.06} flatShading />
  </mesh>;
}

function Explorer({ progressRef }: GameSceneProps) {
  const explorer = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(explorerAsset);
  const model = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, explorer);

  useEffect(() => {
    const preferred = actions.Walking ?? actions.walk ?? Object.values(actions)[0];
    preferred?.reset().fadeIn(0.35).play();
    return () => {
      preferred?.fadeOut(0.2);
    };
  }, [actions]);

  useFrame(({ clock }) => {
    if (!explorer.current) return;
    const progress = progressRef.current;
    const z = THREE.MathUtils.lerp(8, -24, progress);
    const x = THREE.MathUtils.lerp(-1.85, 0, progress);
    explorer.current.position.set(x, terrainHeight(x, z + 15) + 0.02, z);
    explorer.current.rotation.y = THREE.MathUtils.lerp(-0.08, 0, progress);
    explorer.current.position.y += Math.sin(clock.elapsedTime * 7) * 0.018;
  });

  return <group ref={explorer} scale={0.74} castShadow>
    <primitive object={model} rotation={[0, Math.PI, 0]} />
    <pointLight color="#5deaf1" intensity={1.4} distance={2.4} position={[0, 1.4, 0.45]} />
  </group>;
}

function ExplorerFallback({ progressRef }: GameSceneProps) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const progress = progressRef.current;
    group.current.position.z = THREE.MathUtils.lerp(8, -24, progress);
  });
  return <group ref={group}><mesh castShadow position={[0, 1.05, 0]}><capsuleGeometry args={[0.28, 0.86, 6, 16]} /><meshStandardMaterial color="#d8e2df" roughness={0.48} metalness={0.35} /></mesh><mesh castShadow position={[0, 1.74, 0]}><sphereGeometry args={[0.42, 24, 20]} /><meshPhysicalMaterial color="#173c4d" roughness={0.16} metalness={0.9} clearcoat={1} /></mesh></group>;
}

function Beacon({ index, position, progressRef }: { index: number; position: [number, number, number]; progressRef: MutableRefObject<number> }) {
  const light = useRef<THREE.PointLight>(null);
  const crystal = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const active = THREE.MathUtils.smoothstep(progressRef.current, 0.16 + index * 0.12, 0.29 + index * 0.12);
    if (light.current) light.current.intensity = active * 10;
    if (crystal.current) crystal.current.rotation.y = clock.elapsedTime * 0.24;
  });
  return <group position={position} ref={crystal}>
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.55}><mesh castShadow><octahedronGeometry args={[0.56, 1]} /><meshPhysicalMaterial color="#4ad3e2" emissive="#067d91" emissiveIntensity={1.4} roughness={0.18} metalness={0.58} transmission={0.12} /></mesh></Float>
    <pointLight ref={light} color="#62e5ef" intensity={0} distance={7} decay={2} />
  </group>;
}

function Base({ progressRef }: GameSceneProps) {
  const base = useRef<THREE.Group>(null);
  const doorLight = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const arrival = THREE.MathUtils.smoothstep(progressRef.current, 0.64, 0.98);
    if (base.current) base.current.scale.setScalar(THREE.MathUtils.lerp(0.48, 1, arrival));
    if (doorLight.current) doorLight.current.intensity = arrival * 14;
  });
  return <group ref={base} position={[0, terrainHeight(0, -15), -30]}>
    <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[3.1, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#304d5d" roughness={0.27} metalness={0.8} clearcoat={0.8} /></mesh>
    <mesh castShadow position={[0, 0.9, 2.92]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.72, 0.72, 1.75, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#192d3a" emissive="#ff9c4a" emissiveIntensity={2.5} roughness={0.3} metalness={0.75} /></mesh>
    <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[3.12, 0.08, 12, 64]} /><meshStandardMaterial color="#6ae5eb" emissive="#0c8594" emissiveIntensity={1.8} metalness={0.8} /></mesh>
    <pointLight ref={doorLight} color="#ffae5c" intensity={0} distance={14} decay={2} position={[0, 1.4, 2.5]} />
  </group>;
}

function CameraRail({ progressRef }: GameSceneProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const progress = progressRef.current;
    const x = THREE.MathUtils.lerp(7.8, 2.8, progress);
    const y = THREE.MathUtils.lerp(4.6, 2.85, progress);
    const z = THREE.MathUtils.lerp(15, -16.5, progress);
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.08);
    target.set(THREE.MathUtils.lerp(-1.8, 0, progress), 1.25, THREE.MathUtils.lerp(3.5, -25.5, progress));
    camera.lookAt(target);
  });
  return null;
}

function Expedition({ progressRef }: GameSceneProps) {
  return <>
    <color attach="background" args={["#060d16"]} />
    <fog attach="fog" args={["#060d16", 14, 64]} />
    <ambientLight intensity={0.15} />
    <hemisphereLight args={["#93d7ed", "#351e22", 1.5]} />
    <directionalLight castShadow color="#d9efff" intensity={3.4} position={[8, 12, 7]} shadow-mapSize={[2048, 2048]} />
    <pointLight color="#4ee5eb" intensity={9} distance={15} position={[-5, 4, 2]} />
    <Environment preset="night" />
    <Sparkles count={95} scale={[34, 12, 52]} size={1.8} speed={0.18} color="#aee8ed" position={[0, 5, -15]} />
    <Terrain />
    <Suspense fallback={<ExplorerFallback progressRef={progressRef} />}><Explorer progressRef={progressRef} /></Suspense>
    {[5, -3, -11, -18].map((z, index) => <Beacon key={z} index={index} progressRef={progressRef} position={[index % 2 ? 2.7 : -2.7, terrainHeight(index % 2 ? 2.7 : -2.7, z + 15) + 0.75, z]} />)}
    <Base progressRef={progressRef} />
    <ContactShadows position={[0, -0.55, -13]} opacity={0.46} scale={45} blur={2.8} far={25} />
    <CameraRail progressRef={progressRef} />
    <EffectComposer multisampling={0}><SSAO samples={21} radius={0.42} intensity={18} luminanceInfluence={0.55} /><Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.75} radius={0.45} /><Vignette offset={0.16} darkness={0.82} /></EffectComposer>
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
  return <div className="game-scene" aria-hidden="true">{enabled && <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 42, position: [7.8, 4.6, 15] }} gl={{ antialias: false, powerPreference: "high-performance" }}><AdaptiveDpr pixelated /><Expedition progressRef={progressRef} /></Canvas>}</div>;
}
