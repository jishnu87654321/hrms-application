"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Indigo/violet/cyan color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Indigo
        colors[i3] = 0.4;
        colors[i3 + 1] = 0.4;
        colors[i3 + 2] = 0.95;
      } else if (colorChoice < 0.7) {
        // Violet
        colors[i3] = 0.55;
        colors[i3 + 1] = 0.25;
        colors[i3 + 2] = 0.9;
      } else {
        // Cyan
        colors[i3] = 0.2;
        colors[i3 + 1] = 0.7;
        colors[i3 + 2] = 0.85;
      }

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    
    mesh.current.rotation.x = time * 0.02 + pointer.y * 0.1;
    mesh.current.rotation.y = time * 0.03 + pointer.x * 0.1;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrb({ position, scale, color, speed = 1 }: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime * speed;
    mesh.current.position.y = position[1] + Math.sin(time) * 0.3;
    mesh.current.position.x = position[0] + Math.cos(time * 0.7) * 0.2 + pointer.x * 0.5;
    mesh.current.position.z = position[2] + pointer.y * 0.3;
    mesh.current.rotation.x = time * 0.2;
    mesh.current.rotation.z = time * 0.1;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.15}
        distort={0.4}
        speed={2}
        roughness={0.2}
      />
    </mesh>
  );
}

function FloatingTorus({ position, scale, color }: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.x = time * 0.3 + pointer.y * 0.5;
    mesh.current.rotation.y = time * 0.2 + pointer.x * 0.5;
    mesh.current.position.y = position[1] + Math.sin(time * 0.5) * 0.4;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 16, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

function GridPlane() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = -Math.PI / 2.5 + pointer.y * 0.05;
    mesh.current.rotation.z = pointer.x * 0.05;
  });

  return (
    <mesh ref={mesh} position={[0, -3, -5]} rotation={[-Math.PI / 2.5, 0, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
      
      <Particles count={150} />
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <FloatingOrb position={[-4, 2, -3]} scale={1.5} color="#6366f1" speed={0.8} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <FloatingOrb position={[4, -1, -2]} scale={1} color="#8b5cf6" speed={1.2} />
      </Float>
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.4}>
        <FloatingOrb position={[2, 3, -4]} scale={0.8} color="#06b6d4" speed={0.6} />
      </Float>
      
      <FloatingTorus position={[-3, -2, -3]} scale={1.2} color="#6366f1" />
      <FloatingTorus position={[5, 1, -5]} scale={0.8} color="#8b5cf6" />
      
      <GridPlane />
    </>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0c0a1d"]} />
        <fog attach="fog" args={["#0c0a1d", 5, 20]} />
        <Scene />
      </Canvas>
    </div>
  );
}
