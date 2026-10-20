import { useSyncExternalStore } from "react";
import { useMediaQuery } from "./use-media-query";

export const MOTION_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

const subscribeToDevice = () => () => {};
const isLowPowerDevice = () => {
  const { deviceMemory } = navigator as Navigator & { deviceMemory?: number };
  return (navigator.hardwareConcurrency ?? 8) <= 2 || (deviceMemory ?? 8) <= 2;
};

/** The 3D scene only runs on desktop, with motion allowed, on capable hardware. */
export function useSceneEnabled(): boolean {
  const motionAllowed = useMediaQuery(MOTION_QUERY);
  const lowPower = useSyncExternalStore(
    subscribeToDevice,
    isLowPowerDevice,
    () => true,
  );
  return motionAllowed && !lowPower;
}
