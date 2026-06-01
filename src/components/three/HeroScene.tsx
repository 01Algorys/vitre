"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

const PHOTO_URLS = [
  "/L1020544.jpeg",
  "/L1020827.jpeg",
  "/L1021465.jpeg",
  "/DJI_0487.jpg",
  "/Z62_3101.jpg",
  "/IMG_3846.jpeg",
];

const PHOTO_CONFIGS: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  aspect: number;
  speed: number;
  phase: number;
}[] = [
  { position: [-3.4, 0.6, -1.8], rotation: [0, 0.18, -0.09], scale: 1.9, aspect: 1.33, speed: 0.35, phase: 0 },
  { position: [0.1, 0.5, 0.2],   rotation: [0, -0.04, 0.03], scale: 2.5, aspect: 0.75, speed: 0.28, phase: 1.1 },
  { position: [3.5, 0.3, -1.4],  rotation: [0, -0.16, 0.07], scale: 2.0, aspect: 1.2,  speed: 0.42, phase: 2.2 },
  { position: [-1.9, -2.4, 0.6], rotation: [0, 0.08, -0.14], scale: 1.5, aspect: 1.0,  speed: 0.38, phase: 3.3 },
  { position: [2.1, -2.2, 0.4],  rotation: [0, -0.09, 0.11], scale: 1.6, aspect: 1.15, speed: 0.31, phase: 4.4 },
  { position: [-0.4, 2.4, -2.4], rotation: [0, 0.06, -0.05], scale: 1.4, aspect: 1.5,  speed: 0.44, phase: 0.7 },
];

function PhotoFrame({
  url,
  position,
  rotation,
  scale,
  aspect,
  speed,
  phase,
}: (typeof PHOTO_CONFIGS)[0] & { url: string }) {
  const meshRef   = useRef<THREE.Mesh>(null);
  const frameRef  = useRef<THREE.Mesh>(null);
  const texture   = useTexture(url);

  const basePos   = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!meshRef.current || !frameRef.current) return;

    const floatY = Math.sin(t * speed + phase) * 0.18;
    const floatZ = Math.cos(t * speed * 0.7 + phase) * 0.06;
    const tiltZ  = Math.sin(t * speed * 0.5 + phase) * 0.018;

    meshRef.current.position.set(basePos.x, basePos.y + floatY, basePos.z + floatZ);
    meshRef.current.rotation.set(rotation[0], rotation[1], rotation[2] + tiltZ);

    frameRef.current.position.copy(meshRef.current.position);
    frameRef.current.rotation.copy(meshRef.current.rotation);
  });

  const w = scale;
  const h = scale * aspect;

  return (
    <>
      {/* Photo plane */}
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.9}
          roughness={0.6}
          metalness={0.0}
        />
      </mesh>

      {/* Thin frame border */}
      <mesh ref={frameRef} position={position} rotation={rotation}>
        <planeGeometry args={[w + 0.05, h + 0.05]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  );
}

function Particles({ count = 160 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      sizes[i]             = Math.random() * 0.012 + 0.004;
    }
    return { positions, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.018;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.012) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        color="#d4af37"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

function AmbientParticles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = -clock.elapsedTime * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.006} color="#ffffff" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
}

function Scene() {
  const { viewport } = useThree();
  const mouse        = useMousePosition();
  const groupRef     = useRef<THREE.Group>(null);

  const targetRotation = useMemo(() => ({ x: 0, y: 0 }), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const nx = (mouse.x / (typeof window !== "undefined" ? window.innerWidth  : 1)) * 2 - 1;
    const ny = -((mouse.y / (typeof window !== "undefined" ? window.innerHeight : 1)) * 2 - 1);
    targetRotation.y += (nx * 0.1 - targetRotation.y) * 0.035;
    targetRotation.x += (ny * 0.05 - targetRotation.x) * 0.035;
    groupRef.current.rotation.y = targetRotation.y;
    groupRef.current.rotation.x = targetRotation.x;
  });

  const scale = Math.min(viewport.width / 14, 1);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]}   intensity={1.8} color="#ffffff" />
      <pointLight position={[-6, -4, 4]} intensity={0.9} color="#d4af37" />
      <pointLight position={[0, 2, 10]}  intensity={0.5} color="#ffffff" />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#e5e5e5" />

      {PHOTO_CONFIGS.map((cfg, i) => (
        <PhotoFrame key={i} url={PHOTO_URLS[i]} {...cfg} />
      ))}

      <Particles count={160} />
      <AmbientParticles count={60} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 52 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
