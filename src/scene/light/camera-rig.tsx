import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "../types";
import { walkerPosition } from "./terrain";

// Where the astronaut sits on screen for the section in view: [look x offset, look y offset].
// Panels alternate sides, so the astronaut moves to the free side.
const FRAMING: Record<string, [number, number]> = {
  launch: [-5, 1.2],
  about: [4.5, 1.2],
  skills: [-5, 1.2],
  work: [-1, 3.2],
  contact: [4.5, 1.2],
};

/** Follows the astronaut from behind and keeps them clear of the text panels. */
export function CameraRig({ progressRef }: SceneProps) {
  const { camera } = useThree();
  const walker = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const sway = useRef({ x: 0, y: 0 });
  const framing = useRef({ target: FRAMING.launch, x: -5, y: 1.2 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const middle = window.innerHeight / 2;
      for (const id of Object.keys(FRAMING)) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= middle && rect.bottom > middle) {
          framing.current.target = FRAMING[id];
          return;
        }
      }
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame(() => {
    walkerPosition(progressRef.current, walker);
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

    desired.set(
      walker.x + 3.6 + sway.current.x * 0.6,
      walker.y + 3.2 - sway.current.y * 0.35,
      walker.z + 8,
    );
    camera.position.lerp(desired, 0.08);
    const frame = framing.current;
    frame.x = THREE.MathUtils.lerp(frame.x, frame.target[0], 0.04);
    frame.y = THREE.MathUtils.lerp(frame.y, frame.target[1], 0.04);
    target.set(walker.x + frame.x, walker.y + frame.y, walker.z - 6);
    camera.lookAt(target);
  });

  return null;
}
