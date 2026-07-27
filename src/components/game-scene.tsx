"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

type GameSceneProps = {
  progressRef: MutableRefObject<number>;
};

const terrainHeight = (x: number, z: number) =>
  Math.sin(x * 0.19) * 0.5 + Math.cos(z * 0.14) * 0.65 + Math.sin((x + z) * 0.09) * 0.8;

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material?.dispose());
  });
}

function makeExplorer() {
  const explorer = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: 0xdce5e6, roughness: 0.62, metalness: 0.28 });
  const visor = new THREE.MeshStandardMaterial({ color: 0x15344a, emissive: 0x125a72, emissiveIntensity: 1.4, metalness: 0.85, roughness: 0.2 });
  const pack = new THREE.MeshStandardMaterial({ color: 0x2d5c70, roughness: 0.45, metalness: 0.55 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 0.78, 5, 12), suit);
  body.position.y = 1.12;
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), suit);
  helmet.position.y = 1.8;
  const visorMesh = new THREE.Mesh(new THREE.SphereGeometry(0.31, 20, 16, 0, Math.PI), visor);
  visorMesh.position.set(0, 1.81, 0.22);
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.62, 0.24), pack);
  backpack.position.set(0, 1.14, -0.34);
  explorer.add(body, helmet, visorMesh, backpack);

  [-1, 1].forEach((side) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.62, 4, 8), suit);
    leg.name = side < 0 ? "left-leg" : "right-leg";
    leg.position.set(side * 0.2, 0.45, 0);
    explorer.add(leg);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.52, 4, 8), suit);
    arm.name = side < 0 ? "left-arm" : "right-arm";
    arm.position.set(side * 0.48, 1.18, 0);
    arm.rotation.z = side * 0.12;
    explorer.add(arm);
  });
  return explorer;
}

export default function GameScene({ progressRef }: GameSceneProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07111d);
    scene.fog = new THREE.FogExp2(0x07111d, 0.027);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 150);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.current.appendChild(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight(0x9bc2d3, 0x3d1d20, 1.6);
    const keyLight = new THREE.DirectionalLight(0xd7efff, 2.7);
    keyLight.position.set(5, 11, 7);
    const rimLight = new THREE.PointLight(0x6ceaf0, 12, 16, 2);
    rimLight.position.set(-5, 3, 2);
    scene.add(hemisphere, keyLight, rimLight);

    const terrainGeometry = new THREE.PlaneGeometry(70, 90, 72, 90);
    const positions = terrainGeometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      positions.setZ(index, terrainHeight(positions.getX(index), positions.getY(index)));
    }
    terrainGeometry.computeVertexNormals();
    terrainGeometry.rotateX(-Math.PI / 2);
    const terrain = new THREE.Mesh(terrainGeometry, new THREE.MeshStandardMaterial({ color: 0x6b3940, roughness: 0.94, metalness: 0.05, flatShading: true }));
    terrain.position.z = -15;
    scene.add(terrain);

    const stars = new THREE.BufferGeometry();
    const starPositions = new Float32Array(500 * 3);
    for (let index = 0; index < 500; index += 1) {
      starPositions[index * 3] = (Math.random() - 0.5) * 100;
      starPositions[index * 3 + 1] = Math.random() * 32 + 3;
      starPositions[index * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
    }
    stars.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xbceef3, size: 0.07, transparent: true, opacity: 0.72 })));

    const explorer = makeExplorer();
    scene.add(explorer);
    const beacons: THREE.Group[] = [];
    [5, -2, -10, -17].forEach((z, index) => {
      const beacon = new THREE.Group();
      const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.9, 5), new THREE.MeshStandardMaterial({ color: 0x4ca8b1, emissive: 0x0e8a9b, emissiveIntensity: 0.3, roughness: 0.32, metalness: 0.7 }));
      const glow = new THREE.PointLight(0x6ceaf0, 0, 5, 2);
      beacon.position.set(index % 2 ? 2.7 : -2.7, terrainHeight(index % 2 ? 2.7 : -2.7, z - 15), z);
      crystal.position.y = 0.95;
      glow.position.y = 1.1;
      beacon.add(crystal, glow);
      beacons.push(beacon);
      scene.add(beacon);
    });

    const base = new THREE.Group();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.2, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x315d70, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.9 }));
    const door = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 1.65, 20, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x152a3a, emissive: 0xffb55b, emissiveIntensity: 0.9, metalness: 0.7 }));
    const baseLight = new THREE.PointLight(0xffb55b, 0, 14, 2);
    dome.rotation.x = Math.PI / 2;
    door.rotation.z = Math.PI / 2;
    door.position.set(0, 0.84, 2.96);
    baseLight.position.set(0, 1.6, 2.4);
    base.position.set(0, terrainHeight(0, -45), -30);
    base.add(dome, door, baseLight);
    scene.add(base);

    const target = new THREE.Vector3();
    const resize = () => {
      if (!container.current) return;
      const { width, height } = container.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container.current);
    resize();

    let frameId = 0;
    const render = (time: number) => {
      frameId = requestAnimationFrame(render);
      if (document.visibilityState !== "visible") return;
      const progress = progressRef.current;
      const pathZ = THREE.MathUtils.lerp(11, -26, progress);
      explorer.position.set(THREE.MathUtils.lerp(-2.2, 0, progress), terrainHeight(explorer.position.x, pathZ - 15), pathZ);
      explorer.rotation.y = THREE.MathUtils.lerp(-0.18, 0, progress);
      const stride = time * 0.011 + progress * 25;
      explorer.position.y += Math.abs(Math.sin(stride)) * 0.05;
      (explorer.getObjectByName("left-leg") as THREE.Mesh).rotation.x = Math.sin(stride) * 0.55;
      (explorer.getObjectByName("right-leg") as THREE.Mesh).rotation.x = -Math.sin(stride) * 0.55;
      (explorer.getObjectByName("left-arm") as THREE.Mesh).rotation.x = -Math.sin(stride) * 0.42;
      (explorer.getObjectByName("right-arm") as THREE.Mesh).rotation.x = Math.sin(stride) * 0.42;
      beacons.forEach((beacon, index) => {
        const activation = THREE.MathUtils.smoothstep(progress, 0.18 + index * 0.12, 0.3 + index * 0.12);
        (beacon.children[1] as THREE.PointLight).intensity = activation * 8;
        beacon.rotation.y = time * 0.00045;
      });
      baseLight.intensity = THREE.MathUtils.smoothstep(progress, 0.68, 0.94) * 8;
      base.scale.setScalar(THREE.MathUtils.lerp(0.48, 1.08, THREE.MathUtils.smoothstep(progress, 0.55, 1)));
      camera.position.set(THREE.MathUtils.lerp(7.5, 3.2, progress), THREE.MathUtils.lerp(4.4, 2.7, progress), THREE.MathUtils.lerp(15, -16, progress));
      target.set(explorer.position.x, explorer.position.y + 0.85, explorer.position.z - 3.6);
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    render(0);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div className="game-scene" ref={container} aria-hidden="true" />;
}
