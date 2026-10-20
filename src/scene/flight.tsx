import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Sparkles } from "@react-three/drei";
import { CameraFlight } from "./camera-flight";
import { FlightCraft } from "./flight-craft";
import { LandingPlatform } from "./landing-platform";
import { Planet } from "./planet";
import { SkillMeteors } from "./skill-meteors";
import { StarTunnel } from "./star-tunnel";
import type { SceneProps } from "./types";

export function Flight({ progressRef }: SceneProps) {
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
