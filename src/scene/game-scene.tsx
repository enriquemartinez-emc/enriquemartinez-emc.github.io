"use client";

import { Flight } from "./flight";
import { SceneCanvas } from "./scene-canvas";
import type { SceneProps } from "./types";

type GameSceneProps = SceneProps & { paused: boolean; onReady?: () => void };

export default function GameScene({
  progressRef,
  paused,
  onReady,
}: GameSceneProps) {
  return (
    <SceneCanvas
      paused={paused}
      onReady={onReady}
      camera={{ fov: 48, position: [0, 0.35, 16] }}
    >
      <Flight progressRef={progressRef} />
    </SceneCanvas>
  );
}
