"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

type GameSceneProps = { progressRef: MutableRefObject<number> };

const signals = [
  { color: 0x5deaf1, x: -3.4, y: 1.5, trigger: 0.18 },
  { color: 0xa78bfa, x: 2.2, y: 2.5, trigger: 0.3 },
  { color: 0xffb45d, x: -1.5, y: -0.3, trigger: 0.42 },
  { color: 0xf577a1, x: 4.1, y: 0.6, trigger: 0.54 },
];

function random(index: number) {
  return (Math.sin(index * 999.91) * 43758.5453) % 1;
}

function dispose(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material?.dispose());
  });
}

export default function GameScene({ progressRef }: GameSceneProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020711);
    scene.fog = new THREE.Fog(0x020711, 25, 96);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 140);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x18253a, 0.45));
    const sun = new THREE.DirectionalLight(0x9ddff2, 1.8);
    sun.position.set(-8, 5, 8);
    scene.add(sun);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1200 * 3);
    for (let index = 0; index < 1200; index += 1) {
      const radius = 2.5 + Math.abs(random(index)) * 27;
      const angle = random(index + 1000) * Math.PI * 2;
      starPositions[index * 3] = Math.cos(angle) * radius;
      starPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
      starPositions[index * 3 + 2] = -Math.abs(random(index + 2000)) * 120 + 18;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xbceef6, size: 0.07, transparent: true, opacity: 0.82, depthWrite: false }));
    scene.add(stars);

    const planet = new THREE.Group();
    const surface = new THREE.Mesh(new THREE.SphereGeometry(8, 96, 64), new THREE.MeshStandardMaterial({ color: 0x4c78aa, emissive: 0x183d68, emissiveIntensity: 1.4, roughness: 0.62, metalness: 0.02 }));
    const planetLight = new THREE.PointLight(0x7eeaf3, 18, 48, 2);
    planetLight.position.set(-6, 4, 3);
    planet.add(surface, planetLight);
    scene.add(planet);

    const craft = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 1.9, 8, 24), new THREE.MeshStandardMaterial({ color: 0x1d3e59, roughness: 0.2, metalness: 0.94 }));
    hull.rotation.x = Math.PI / 2;
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 20), new THREE.MeshPhysicalMaterial({ color: 0x102d48, roughness: 0.06, metalness: 0.92, clearcoat: 1 }));
    cockpit.position.set(0, 0.13, 0.58);
    cockpit.rotation.y = Math.PI / 4;
    craft.add(hull, cockpit);
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.06, 0.42), new THREE.MeshStandardMaterial({ color: 0x294d68, roughness: 0.28, metalness: 0.88 }));
      wing.position.set(side * 0.67, -0.06, -0.08);
      wing.rotation.set(0.04, side * -0.18, side * 0.1);
      craft.add(wing);
    });
    const engineLight = new THREE.PointLight(0x5deaf1, 4, 12, 2);
    engineLight.position.set(0, -0.02, -1.48);
    craft.add(engineLight);
    craft.rotation.set(0.08, Math.PI, 0);
    scene.add(craft);

    const meteors = signals.map((signal) => {
      const group = new THREE.Group();
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 2), new THREE.MeshStandardMaterial({ color: 0x142b42, emissive: signal.color, emissiveIntensity: 2.2, roughness: 0.25, metalness: 0.72 }));
      const trail = new THREE.Mesh(new THREE.ConeGeometry(0.17, 2.7, 12, 1, true), new THREE.MeshBasicMaterial({ color: signal.color, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
      trail.position.z = 1.35;
      trail.rotation.x = Math.PI / 2;
      const light = new THREE.PointLight(signal.color, 5, 7, 2);
      group.add(core, trail, light);
      scene.add(group);
      return group;
    });

    const target = new THREE.Vector3();
    const timer = new THREE.Timer();
    let frame = 0;
    const resize = () => {
      if (!container.current) return;
      const { width, height } = container.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container.current);
    resize();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.visibilityState !== "visible") return;
      timer.update();
      const elapsed = timer.getElapsed();
      const delta = timer.getDelta();
      const progress = progressRef.current;
      const starAttribute = stars.geometry.attributes.position;
      const velocity = 9 + progress * 34;
      for (let index = 0; index < starAttribute.count; index += 1) {
        const z = starAttribute.getZ(index) + delta * velocity;
        starAttribute.setZ(index, z > 20 ? z - 140 : z);
      }
      starAttribute.needsUpdate = true;

      planet.position.set(THREE.MathUtils.lerp(4.8, 0.8, progress), THREE.MathUtils.lerp(-3.6, -1.6, progress), THREE.MathUtils.lerp(-58, -14, progress));
      planet.scale.setScalar(THREE.MathUtils.lerp(0.65, 1.8, progress));
      planet.rotation.y = elapsed * 0.024;

      const arrival = THREE.MathUtils.smoothstep(progress, 0.72, 0.94);
      craft.position.set(THREE.MathUtils.lerp(3.9, 0, arrival) + Math.sin(elapsed * 0.45) * 0.12, THREE.MathUtils.lerp(-1.3, -0.3, arrival) + Math.cos(elapsed * 0.36) * 0.06, THREE.MathUtils.lerp(3, -0.3, progress));
      craft.rotation.z = THREE.MathUtils.lerp(-0.18, 0, arrival) + Math.sin(elapsed * 0.45) * 0.035;
      engineLight.intensity = 4 + Math.sin(elapsed * 7) * 2 + arrival * 8;

      meteors.forEach((meteor, index) => {
        const signal = signals[index];
        const phase = THREE.MathUtils.smoothstep(progress, signal.trigger, signal.trigger + 0.24);
        meteor.position.set(signal.x - phase * 1.8, signal.y + Math.sin(elapsed * 1.2 + index) * 0.1, THREE.MathUtils.lerp(-48, 5, phase));
        meteor.rotation.set(elapsed * 1.2, elapsed * 0.8, -0.55);
        meteor.visible = phase > 0 && phase < 0.98;
      });

      camera.position.lerp(new THREE.Vector3(0, 0.35 + Math.sin(elapsed * 0.22) * 0.08, THREE.MathUtils.lerp(16, 2, progress)), 0.055);
      target.set(THREE.MathUtils.lerp(1.6, 0.6, progress), THREE.MathUtils.lerp(-0.5, -1.1, progress), THREE.MathUtils.lerp(-24, -15, progress));
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      dispose(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div className="game-scene" ref={container} aria-hidden="true" />;
}
