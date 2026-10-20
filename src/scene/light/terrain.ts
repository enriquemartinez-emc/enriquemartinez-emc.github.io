import * as THREE from "three";

/** How far the astronaut walks, in world units, over the whole page scroll. */
export const PATH_LENGTH = 150;

/** The trail bends gently so the walk is not a straight line. */
export const pathX = (z: number) => Math.sin(z * 0.045) * 3.2;

const hills = (x: number, z: number) =>
  1.5 * Math.sin(x * 0.16 + z * 0.05) * Math.cos(z * 0.09 - x * 0.05) +
  0.7 * Math.sin(z * 0.21 + x * 0.27) +
  0.3 * Math.sin(x * 0.5 - z * 0.33);

export function terrainHeight(x: number, z: number) {
  const away = Math.abs(x - pathX(z));
  // Gentle ground on the trail, rolling dunes away from it, valley walls far out.
  const flatten = THREE.MathUtils.smoothstep(away, 1.5, 9);
  return hills(x, z) * (0.25 + 0.75 * flatten) + Math.max(0, away - 14) * 0.35;
}

/** Where the astronaut stands for a given scroll progress (0..1). */
export function walkerPosition(progress: number, target = new THREE.Vector3()) {
  const z = -progress * PATH_LENGTH;
  const x = pathX(z);
  return target.set(x, terrainHeight(x, z), z);
}

/** Deterministic 0..1 pseudo-random value, so the world is the same every load. */
export function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}
