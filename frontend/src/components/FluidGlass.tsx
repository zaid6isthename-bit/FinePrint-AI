"use client";

import * as THREE from 'three';
import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text, Environment } from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ lensProps = {} }: any) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene lensProps={lensProps} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({ lensProps }: any) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#D9A441" />
      <Environment preset="city" />

      {/* Background plane — gives transmission material something to refract */}
      <mesh position={[0, 0, -6]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#0d0d10" />
      </mesh>

      {/* Document lines */}
      <DocumentLines />

      {/* Lens — no GLB dependency for instant loading */}
      <MovingLens lensProps={lensProps} />
    </>
  );
}

function DocumentLines() {
  const lines = [
    { pos: [-3, 6, -4], w: 6, label: "SERVICE AGREEMENT — SECTION 4.2" },
    { pos: [-3, 5, -4], w: 5, label: "Indemnification & Liability" },
    { pos: [-3, 3.5, -4], w: 4.5, label: "The Client shall indemnify and hold harmless..." },
    { pos: [-3, 2.8, -4], w: 5.5, label: "...including reasonable attorneys fees, arising from..." },
    { pos: [-3, 2.1, -4], w: 3.8, label: "...breach of representations herein." },
    { pos: [-3, 0.8, -4], w: 4.2, label: "TERMINATION CLAUSE — 30 days written notice" },
    { pos: [-3, 0.1, -4], w: 5.2, label: "Either party may terminate this agreement upon..." },
    { pos: [-3, -0.6, -4], w: 3.5, label: "...without cause, subject to obligations." },
    { pos: [-3, -2, -4], w: 4.8, label: "PAYMENT TERMS — Net 30" },
    { pos: [-3, -2.7, -4], w: 5, label: "Invoices are due within thirty (30) calendar days..." },
    { pos: [-3, -3.4, -4], w: 3.2, label: "...late fees of 1.5% per month apply." },
    { pos: [-3, -5, -4], w: 4, label: "ARBITRATION — Binding arbitration clause" },
    { pos: [-3, -5.7, -4], w: 5.3, label: "Disputes shall be resolved by arbitration per..." },
  ];

  return (
    <group>
      {/* White paper background */}
      <mesh position={[0, 0, -4.5]}>
        <planeGeometry args={[14, 18]} />
        <meshBasicMaterial color="#f8f6f0" />
      </mesh>

      {lines.map((line, i) => (
        <group key={i}>
          <mesh position={[line.pos[0] + line.w / 2, line.pos[1], line.pos[2] - 0.01]}>
            <planeGeometry args={[line.w, i === 0 || i === 5 || i === 8 || i === 11 ? 0.25 : 0.12]} />
            <meshBasicMaterial
              color={i === 0 || i === 5 || i === 8 || i === 11 ? "#1a1a2e" : "#555577"}
              opacity={i === 0 || i === 5 || i === 8 || i === 11 ? 1 : 0.6}
              transparent
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MovingLens({ lensProps }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 2));
  const nextMove = useRef(0);

  // Waypoints that hover over document zones
  const waypoints = [
    [0, 6], [-1, 5], [1, 3.5], [0, 0.8],
    [-1, -0.6], [0, -2], [1, -3.4], [-1, -5],
    [2, 2], [-2, -1], [0, 4],
  ];
  const wpIdx = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (t > nextMove.current) {
      const wp = waypoints[wpIdx.current % waypoints.length];
      target.current.set(
        wp[0] + (Math.random() - 0.5) * 1.5,
        wp[1] + (Math.random() - 0.5) * 0.8,
        2
      );
      wpIdx.current++;
      nextMove.current = t + 1.5 + Math.random() * 2;
    }

    if (meshRef.current) {
      easing.damp3(meshRef.current.position, target.current, 0.6, delta);
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5} rotation={[Math.PI / 2, 0, 0]}>
      {/* Rotated cylinder creates the precise 'disc' lens shape */}
      <cylinderGeometry args={[1, 1, 0.2, 64]} />
      <MeshTransmissionMaterial
        thickness={15}
        ior={1.5}
        chromaticAberration={0.1}
        anisotropy={0.1}
        transmission={1}
        roughness={0}
        color="white"
        resolution={256}
        {...lensProps} 
      />
    </mesh>
  );
}