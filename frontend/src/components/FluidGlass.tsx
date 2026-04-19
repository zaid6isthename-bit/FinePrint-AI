"use client";

import * as THREE from 'three';
import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Text,
  Environment,
  Float,
  useGLTF
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ lensProps = {} }: any) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, minHeight: '600px' }}>
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 35 }} 
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#D9A441" />
          <Environment preset="city" />
          
          <group>
            {/* Document Sheet */}
            <mesh position={[0, 0, -5]}>
              <planeGeometry args={[14, 18]} />
              <meshBasicMaterial color="#ffffff" opacity={0.15} transparent />
            </mesh>
            
            <Text
              position={[0, 6, -4.9]}
              fontSize={0.6}
              color="#D9A441"
              font="https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45bgewp.woff"
            >
              PARSING_LEGAL_STRUCTURES...
            </Text>

            {/* Test Marker to confirm R3F is rendering */}
            <mesh position={[-6, 8, -4.8]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="red" />
            </mesh>

            {/* Lens */}
            <MovingLens lensProps={lensProps} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

function MovingLens({ lensProps }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [target] = useState(() => new THREE.Vector3(0, 0, 2));
  const [nextMove, setNextMove] = useState(0);

  // Safely load GLTF with fallback logic
  const { nodes } = useGLTF("/assets/3d/lens.glb") as any;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (t > nextMove) {
      target.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 2);
      setNextMove(t + 1 + Math.random() * 2);
    }
    if (meshRef.current) {
      easing.damp3(meshRef.current.position, target, 0.4, delta);
      easing.dampE(meshRef.current.rotation, [target.y * 0.1, -target.x * 0.1, 0], 0.5, delta);
    }
  });

  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        ref={meshRef} 
        scale={2.5} 
        geometry={nodes?.Cylinder?.geometry || new THREE.SphereGeometry(1, 32, 32)}
      >
        <MeshTransmissionMaterial 
          thickness={10}
          ior={1.15}
          chromaticAberration={0.05}
          anisotropy={0.1}
          color="white"
          transmission={1}
          roughness={0}
          {...lensProps} 
        />
      </mesh>
    </Float>
  );
}
