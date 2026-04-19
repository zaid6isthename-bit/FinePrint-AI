"use client";

import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Text,
  Environment,
  Float
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ lensProps = {} }: any) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 35 }} 
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#D9A441" />
        <Environment preset="city" />
        
        <group>
          {/* Document Sheet - Simplified */}
          <mesh position={[0, 0, -5]}>
            <planeGeometry args={[14, 18]} />
            <meshBasicMaterial color="#ffffff" opacity={0.08} transparent />
          </mesh>
          
          <Text
            position={[0, 5.5, -4.9]}
            fontSize={0.5}
            color="#D9A441"
            font="https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45bgewp.woff"
          >
            CONFIDENTIAL ARCHIVE ANALYSIS
          </Text>

          {/* Lens */}
          <MovingLens lensProps={lensProps} />
        </group>
      </Canvas>
    </div>
  );
}

function MovingLens({ lensProps }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [target] = useState(() => new THREE.Vector3(0, 0, 2));
  const [nextMove, setNextMove] = useState(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (t > nextMove) {
      target.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 2);
      setNextMove(t + 1 + Math.random() * 2);
    }
    if (meshRef.current) {
      easing.damp3(meshRef.current.position, target, 0.4, delta);
      easing.dampE(meshRef.current.rotation, [target.y * 0.1, -target.x * 0.1, 0], 0.5, delta);
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial 
          thickness={10}
          ior={1.12}
          chromaticAberration={0.05}
          anisotropy={0.1}
          color="white"
          transmission={1}
          roughness={0}
          distortion={0.2}
          distortionScale={0.3}
          {...lensProps} 
        />
      </mesh>
    </Float>
  );
}
