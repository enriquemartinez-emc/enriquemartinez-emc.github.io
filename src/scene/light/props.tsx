import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PATH_LENGTH, pathX, random, terrainHeight } from "./terrain";

type Item = { x: number; y: number; z: number; scale: number; turn: number };

/** Scatter props beside the trail, never on it. */
function scatter(count: number, seed: number, clearance: number): Item[] {
  const items: Item[] = [];
  for (let index = 0; items.length < count && index < count * 4; index += 1) {
    const key = seed + index * 7.31;
    const z = 12 - random(key) * (PATH_LENGTH + 90);
    const x = (random(key + 1) - 0.5) * 56;
    // The camera rides to the right of the trail, so keep that side clear.
    const side = x - pathX(z);
    if (side > -clearance && side < 8) continue;
    items.push({
      x,
      y: terrainHeight(x, z),
      z,
      scale: 0.6 + random(key + 2) * 1.1,
      turn: random(key + 3) * Math.PI * 2,
    });
  }
  return items;
}

function Instances({
  items,
  lift = 0,
  children,
}: {
  items: Item[];
  /** Raises each instance by this fraction of its scale (for pivots at the center). */
  lift?: number;
  children: React.ReactNode;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const instances = mesh.current;
    if (!instances) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();
    items.forEach((item, index) => {
      rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), item.turn);
      matrix.compose(
        new THREE.Vector3(item.x, item.y + item.scale * lift, item.z),
        rotation,
        new THREE.Vector3(item.scale, item.scale, item.scale),
      );
      instances.setMatrixAt(index, matrix);
    });
    instances.instanceMatrix.needsUpdate = true;
  }, [items, lift]);

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}

export function Props() {
  const rocks = useMemo(() => scatter(70, 11, 3), []);
  const crystals = useMemo(() => scatter(30, 53, 3.5), []);
  const flora = useMemo(() => scatter(44, 97, 3), []);

  return (
    <>
      <Instances items={rocks} lift={0.35}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#a65a3c" flatShading roughness={1} />
      </Instances>
      <Instances items={crystals} lift={0.9}>
        <coneGeometry args={[0.32, 1.8, 5]} />
        <meshStandardMaterial
          color="#3fb5b5"
          emissive="#1b7d86"
          emissiveIntensity={0.5}
          flatShading
          roughness={0.3}
        />
      </Instances>
      <Instances items={flora} lift={0.7}>
        <cylinderGeometry args={[0.07, 0.1, 1.4, 6]} />
        <meshStandardMaterial color="#7a9a5a" flatShading roughness={1} />
      </Instances>
      <Instances items={flora.map((item) => ({ ...item }))} lift={1.55}>
        <icosahedronGeometry args={[0.38, 1]} />
        <meshStandardMaterial
          color="#f0749c"
          emissive="#8a2c52"
          emissiveIntensity={0.35}
          flatShading
          roughness={0.7}
        />
      </Instances>
    </>
  );
}
