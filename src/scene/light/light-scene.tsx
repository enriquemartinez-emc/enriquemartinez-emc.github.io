"use client";

import { SceneCanvas } from "../scene-canvas";
import type { SceneProps } from "../types";
import { Astronaut } from "./astronaut";
import { CameraRig } from "./camera-rig";
import { Props } from "./props";
import { Sky } from "./sky";
import { TerrainMesh } from "./terrain-mesh";

type LightSceneProps = SceneProps & { paused: boolean; onReady?: () => void };

/** Daytime alien planet: an explorer walks the trail as the page scrolls. */
export default function LightScene({
  progressRef,
  paused,
  onReady,
}: LightSceneProps) {
  return (
    <SceneCanvas
      paused={paused}
      onReady={onReady}
      flat
      antialias
      camera={{ fov: 45, near: 0.1, far: 400, position: [3.6, 3.4, 8] }}
    >
      <fog attach="fog" args={["#f1e2cc", 45, 150]} />
      <hemisphereLight args={["#cfe9f5", "#e8b27c", 1.15]} />
      <directionalLight
        color="#fff1d6"
        intensity={2.4}
        position={[10, 14, 12]}
      />
      <Sky />
      <TerrainMesh />
      <Props />
      <Astronaut progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
    </SceneCanvas>
  );
}
