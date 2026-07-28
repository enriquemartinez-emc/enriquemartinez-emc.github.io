"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { AdaptiveDpr, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

type GameSceneProps = { progressRef: MutableRefObject<number> };

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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

function Planet({ progressRef }: GameSceneProps) {
  const planet = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!planet.current) return;
    const elapsed = performance.now() / 1000;
    const progress = progressRef.current;
    planet.current.position.z = THREE.MathUtils.lerp(-58, -14, progress);
    planet.current.position.x = THREE.MathUtils.lerp(4.8, 0.8, progress);
    planet.current.position.y = THREE.MathUtils.lerp(-3.6, -1.6, progress);
    planet.current.scale.setScalar(THREE.MathUtils.lerp(0.65, 1.8, progress));
    planet.current.rotation.y = elapsed * 0.024;
  });

  return (
    <group ref={planet}>
      <mesh>
        <sphereGeometry args={[8, 96, 64]} />
        <meshStandardMaterial
          color="#4c78aa"
          emissive="#183d68"
          emissiveIntensity={1.4}
          roughness={0.62}
          metalness={0.02}
        />
      </mesh>
      <pointLight
        color="#7eeaf3"
        intensity={18}
        distance={48}
        decay={2}
        position={[-6, 4, 3]}
      />
    </group>
  );
}

function FlightCraft({ progressRef }: GameSceneProps) {
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

function LandingPlatform({ progressRef }: GameSceneProps) {
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

const skillMeteors = [
  { color: "#5deaf1", x: -3.4, y: 1.5, trigger: 0.18 },
  { color: "#a78bfa", x: 2.2, y: 2.5, trigger: 0.3 },
  { color: "#ffb45d", x: -1.5, y: -0.3, trigger: 0.42 },
  { color: "#f577a1", x: 4.1, y: 0.6, trigger: 0.54 },
];

function SkillMeteors({ progressRef }: GameSceneProps) {
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

function CameraFlight({ progressRef }: GameSceneProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const elapsed = performance.now() / 1000;
    const progress = progressRef.current;
    const landing = THREE.MathUtils.smoothstep(progress, 0.72, 0.94);
    camera.position.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(0, 10.5, landing),
        THREE.MathUtils.lerp(
          0.35 + Math.sin(elapsed * 0.22) * 0.08,
          -0.7,
          landing,
        ),
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(16, 2, progress),
          2.4,
          landing,
        ),
      ),
      0.055,
    );
    target.set(
      THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(1.6, 0.6, progress),
        0,
        landing,
      ),
      THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(-0.5, -1.1, progress),
        -0.3,
        landing,
      ),
      THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(-24, -15, progress),
        2.05,
        landing,
      ),
    );
    camera.lookAt(target);
  });
  return null;
}

function Flight({ progressRef }: GameSceneProps) {
  return (
    <>
      <color attach="background" args={["#020711"]} />
      <fog attach="fog" args={["#020711", 24, 96]} />
      <ambientLight intensity={0.08} />
      <directionalLight color="#9ddff2" intensity={1.8} position={[-8, 5, 8]} />
      <StarTunnel progressRef={progressRef} />
      <Planet progressRef={progressRef} />
      <FlightCraft progressRef={progressRef} />
      <LandingPlatform progressRef={progressRef} />
      <SkillMeteors progressRef={progressRef} />
      <Sparkles
        count={120}
        scale={[34, 18, 82]}
        size={1.4}
        speed={0.13}
        color="#78ddec"
        position={[0, 0, -25]}
      />
      <CameraFlight progressRef={progressRef} />
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.65}
          mipmapBlur
          intensity={1.05}
          radius={0.62}
        />
        <Vignette offset={0.12} darkness={0.92} />
      </EffectComposer>
    </>
  );
}

export default function GameScene({ progressRef }: GameSceneProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="game-scene" aria-hidden="true">
      {enabled && (
        <SceneErrorBoundary>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ fov: 48, position: [0, 0.35, 16] }}
            fallback={null}
            gl={{ antialias: false, powerPreference: "high-performance" }}
          >
            <AdaptiveDpr pixelated />
            <Flight progressRef={progressRef} />
          </Canvas>
        </SceneErrorBoundary>
      )}
    </div>
  );
}
