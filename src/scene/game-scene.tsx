"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, type ReactNode } from "react";
import { Flight } from "./flight";
import type { SceneProps } from "./types";

type GameSceneProps = SceneProps & { paused: boolean };

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  // On failure render nothing: the CSS poster behind the canvas stays visible.
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GameScene({ progressRef, paused }: GameSceneProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 48, position: [0, 0.35, 16] }}
        fallback={null}
        frameloop={paused ? "never" : "always"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <AdaptiveDpr pixelated />
        <Flight progressRef={progressRef} />
      </Canvas>
    </SceneErrorBoundary>
  );
}
