"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, type ComponentProps, type ReactNode } from "react";

type SceneCanvasProps = {
  paused: boolean;
  camera: ComponentProps<typeof Canvas>["camera"];
  children: ReactNode;
  /** Called once the WebGL context exists, so the page can drop its CSS poster. */
  onReady?: () => void;
  /** Skip tone mapping so flat, stylized palettes keep their exact colors. */
  flat?: boolean;
  antialias?: boolean;
};

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

export function SceneCanvas({
  paused,
  camera,
  children,
  onReady,
  flat = false,
  antialias = false,
}: SceneCanvasProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        dpr={[1, 1.75]}
        camera={camera}
        fallback={null}
        // Leave it unset when false: an explicit flat={false} stops r3f drawing.
        flat={flat || undefined}
        frameloop={paused ? "never" : "always"}
        gl={{ antialias, powerPreference: "high-performance" }}
        onCreated={onReady}
      >
        <AdaptiveDpr pixelated />
        {children}
      </Canvas>
    </SceneErrorBoundary>
  );
}
