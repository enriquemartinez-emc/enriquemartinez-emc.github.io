import { useMemo } from "react";
import * as THREE from "three";
import { PATH_LENGTH, pathX, random, terrainHeight } from "./terrain";

const WIDTH = 80;
const LENGTH = PATH_LENGTH + 260;
const SEGMENTS_X = 64;
const SEGMENTS_Z = 240;
const Z_CENTER = 40 - LENGTH / 2;

const sand = new THREE.Color("#ecbb85");
const clay = new THREE.Color("#d98f5c");
const rust = new THREE.Color("#b9683f");
const ridge = new THREE.Color("#8f4b36");
const trail = new THREE.Color("#f5d3a3");

function buildTerrain() {
  const plane = new THREE.PlaneGeometry(WIDTH, LENGTH, SEGMENTS_X, SEGMENTS_Z);
  plane.rotateX(-Math.PI / 2);
  plane.translate(0, 0, Z_CENTER);
  const position = plane.attributes.position;
  for (let index = 0; index < position.count; index += 1) {
    position.setY(
      index,
      terrainHeight(position.getX(index), position.getZ(index)),
    );
  }

  // Non-indexed so every triangle gets its own flat color: the low-poly look.
  const geometry = plane.toNonIndexed();
  plane.dispose();
  geometry.computeVertexNormals();
  const vertices = geometry.attributes.position;
  const colors = new Float32Array(vertices.count * 3);
  const color = new THREE.Color();
  for (let face = 0; face < vertices.count; face += 3) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let corner = 0; corner < 3; corner += 1) {
      x += vertices.getX(face + corner) / 3;
      y += vertices.getY(face + corner) / 3;
      z += vertices.getZ(face + corner) / 3;
    }
    const tone = y + (random(face) - 0.5) * 0.9;
    if (Math.abs(x - pathX(z)) < 1.2) color.copy(trail);
    else if (tone < 0.2) color.copy(sand);
    else if (tone < 1.4) color.copy(clay);
    else if (tone < 3.2) color.copy(rust);
    else color.copy(ridge);
    for (let corner = 0; corner < 3; corner += 1) {
      color.toArray(colors, (face + corner) * 3);
    }
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export function TerrainMesh() {
  const geometry = useMemo(() => buildTerrain(), []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={1} />
    </mesh>
  );
}
