import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "./types";

export function CameraFlight({ progressRef }: SceneProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  // Cursor position in -1..1, smoothed so the camera drifts instead of snapping.
  const pointer = useRef({ x: 0, y: 0 });
  const sway = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const elapsed = performance.now() / 1000;
    const progress = progressRef.current;
    const landing = THREE.MathUtils.smoothstep(progress, 0.72, 0.94);
    // Parallax fades out so the landing shot keeps its composition.
    const parallax = 1 - landing;
    sway.current.x = THREE.MathUtils.lerp(
      sway.current.x,
      pointer.current.x,
      0.04,
    );
    sway.current.y = THREE.MathUtils.lerp(
      sway.current.y,
      pointer.current.y,
      0.04,
    );
    camera.position.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(0, 10.5, landing) +
          sway.current.x * 0.7 * parallax,
        THREE.MathUtils.lerp(
          0.35 + Math.sin(elapsed * 0.22) * 0.08,
          -0.7,
          landing,
        ) -
          sway.current.y * 0.4 * parallax,
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
