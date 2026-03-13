"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Indigo/violet colors
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.39; // Indigo
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.95;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.55; // Violet
        colors[i * 3 + 1] = 0.36;
        colors[i * 3 + 2] = 0.97;
      } else {
        colors[i * 3] = 0.3; // Cyan accent
        colors[i * 3 + 1] = 0.75;
        colors[i * 3 + 2] = 0.93;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    
    // Subtle mouse reaction
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.001;
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
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function RotatingSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={mesh} position={[4, 2, -5]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function FloatingRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1.current) {
      ring1.current.rotation.x = state.clock.elapsedTime * 0.2;
      ring1.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.y = state.clock.elapsedTime * 0.15;
      ring2.current.rotation.z = -state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <>
      <mesh ref={ring1} position={[-4, -2, -6]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2} position={[-3.5, -1.5, -5.5]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0a0f", 5, 25]} />
        <ambientLight intensity={0.5} />
        <Particles count={200} />
        <RotatingSphere />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
