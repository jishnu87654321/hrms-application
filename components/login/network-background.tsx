"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Network nodes representing employees
function NetworkNodes({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { pointer } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [];
    const velocities: [number, number, number][] = [];
    const scales: number[] = [];
    
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 2,
      ]);
      velocities.push([
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.001,
      ]);
      scales.push(Math.random() * 0.15 + 0.08);
    }
    
    return { positions, velocities, scales };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      // Drift animation
      nodes.positions[i][0] += nodes.velocities[i][0] + Math.sin(time * 0.3 + i) * 0.001;
      nodes.positions[i][1] += nodes.velocities[i][1] + Math.cos(time * 0.4 + i) * 0.001;
      nodes.positions[i][2] += nodes.velocities[i][2];
      
      // Mouse influence
      const mouseInfluence = 0.3;
      const targetX = nodes.positions[i][0] + pointer.x * mouseInfluence;
      const targetY = nodes.positions[i][1] + pointer.y * mouseInfluence;
      
      // Boundary wrapping
      if (nodes.positions[i][0] > 10) nodes.positions[i][0] = -10;
      if (nodes.positions[i][0] < -10) nodes.positions[i][0] = 10;
      if (nodes.positions[i][1] > 8) nodes.positions[i][1] = -8;
      if (nodes.positions[i][1] < -8) nodes.positions[i][1] = 8;
      
      dummy.position.set(
        targetX,
        targetY,
        nodes.positions[i][2]
      );
      
      // Pulsing scale
      const pulseScale = nodes.scales[i] * (1 + Math.sin(time * 2 + i) * 0.2);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#6366f1"
        emissive="#4f46e5"
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

// Connection lines between nodes
function ConnectionLines({ nodeCount = 60 }: { nodeCount?: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const { pointer } = useThree();
  
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const connectionDistance = 3;
    
    // Create random node positions
    const nodes: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push([
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 2,
      ]);
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < connectionDistance) {
          positions.push(...nodes[i], ...nodes[j]);
          const alpha = 1 - distance / connectionDistance;
          colors.push(0.4, 0.4, 0.9, alpha, 0.4, 0.4, 0.9, alpha);
        }
      }
    }
    
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, [nodeCount]);

  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.elapsedTime;
    linesRef.current.rotation.y = time * 0.02 + pointer.x * 0.1;
    linesRef.current.rotation.x = pointer.y * 0.05;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineGeometry.positions.length / 3}
          array={lineGeometry.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// Floating dashboard panels
function FloatingPanel({ position, size, delay = 0 }: { 
  position: [number, number, number]; 
  size: [number, number];
  delay?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime + delay;
    mesh.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
    mesh.current.rotation.y = Math.sin(time * 0.3) * 0.1 + pointer.x * 0.1;
    mesh.current.rotation.x = Math.cos(time * 0.4) * 0.05 + pointer.y * 0.05;
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="#1e1b4b"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Particle field
function ParticleField({ count = 300 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 15 - 5;
      
      // Indigo/violet/cyan color mix
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.4; colors[i3 + 1] = 0.4; colors[i3 + 2] = 0.9; // indigo
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.6; colors[i3 + 1] = 0.3; colors[i3 + 2] = 0.9; // violet
      } else {
        colors[i3] = 0.2; colors[i3 + 1] = 0.7; colors[i3 + 2] = 0.9; // cyan
      }
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    points.current.rotation.y = time * 0.01 + pointer.x * 0.05;
    points.current.rotation.x = pointer.y * 0.03;
    
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + i * 0.05) * 0.001;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
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

// Gradient light orbs
function GlowOrb({ position, scale, color }: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.position.y = position[1] + Math.sin(time * 0.4) * 0.5;
    mesh.current.position.x = position[0] + Math.cos(time * 0.3) * 0.3 + pointer.x * 0.2;
    mesh.current.scale.setScalar(scale * (1 + Math.sin(time * 0.8) * 0.1));
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.15}
        distort={0.3}
        speed={1.5}
        roughness={0.1}
      />
    </mesh>
  );
}

// Rotating abstract geometry
function RotatingRing({ position, scale, color }: { 
  position: [number, number, number]; 
  scale: number; 
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.x = time * 0.2 + pointer.y * 0.3;
    mesh.current.rotation.y = time * 0.15 + pointer.x * 0.3;
    mesh.current.rotation.z = time * 0.1;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    // Subtle camera movement based on scroll
    camera.position.z = 8 - scrollY * 0.002;
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#4338ca" />
      <pointLight position={[10, 10, 5]} intensity={0.4} color="#6366f1" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, 5, -10]} intensity={0.2} color="#06b6d4" />
      
      {/* Network elements */}
      <NetworkNodes count={50} />
      <ConnectionLines nodeCount={50} />
      
      {/* Particle field - background layer */}
      <ParticleField count={200} />
      
      {/* Floating panels */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <FloatingPanel position={[-5, 2, -4]} size={[1.5, 1]} delay={0} />
      </Float>
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
        <FloatingPanel position={[5, -1, -3]} size={[1.2, 0.8]} delay={1} />
      </Float>
      <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
        <FloatingPanel position={[-4, -2, -5]} size={[1, 0.7]} delay={2} />
      </Float>
      
      {/* Gradient light orbs */}
      <GlowOrb position={[-6, 3, -6]} scale={2} color="#4f46e5" />
      <GlowOrb position={[6, -2, -5]} scale={1.5} color="#7c3aed" />
      <GlowOrb position={[0, 4, -8]} scale={2.5} color="#0891b2" />
      
      {/* Rotating rings */}
      <RotatingRing position={[-4, 0, -3]} scale={1.5} color="#6366f1" />
      <RotatingRing position={[4, 2, -4]} scale={1} color="#8b5cf6" />
      <RotatingRing position={[0, -3, -5]} scale={1.2} color="#06b6d4" />
    </>
  );
}

export function NetworkBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#0c0a1d"]} />
        <fog attach="fog" args={["#0c0a1d", 6, 25]} />
        <Scene />
      </Canvas>
    </div>
  );
}
