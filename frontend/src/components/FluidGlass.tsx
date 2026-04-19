"use client";
/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {} }) {
  // We use a simplified ModeWrapper that renders a "Glass Bob" (Lens effect)
  const modeProps = {
      scale: 0.15,
      ior: 1.15,
      thickness: 10,
      chromaticAberration: 0.05,
      anisotropy: 0.01,
      roughness: 0,
      transmission: 1,
      ...lensProps
  };

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <BobWrapper modeProps={modeProps}>
            <DocumentPreview />
        </BobWrapper>
    </Canvas>
  );
}

const BobWrapper = memo(function BobWrapper({
  children,
  modeProps = {}
}: any) {
  const ref = useRef<any>();
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  
  // Autonomous AI Eye logic state
  const targetPos = useRef(new THREE.Vector2(0, 0));
  const pauseUntil = useRef(0);

  useFrame((state, delta) => {
    const { gl, camera } = state;
    const t = state.clock.getElapsedTime();

    // Autonomous scanning mechanism
    if (t > pauseUntil.current) {
        // Pick a new target coordinate
        targetPos.current.set(
            (Math.random() - 0.5) * 4.5, // X bounds
            (Math.random() - 0.5) * 6.5  // Y bounds
        );
        // Pause briefly upon arrival before moving next (simulating reading)
        pauseUntil.current = t + 1.5 + Math.random() * 2.5; 
    }

    if (ref.current) {
        // AI scanning fluid easing
        easing.damp3(ref.current.position, [targetPos.current.x, targetPos.current.y, 1], 0.4, delta);
        // Subtly rotate to simulate organic eye-tracking micro-movements
        easing.dampE(
            ref.current.rotation, 
            [
                (targetPos.current.y * 0.1), 
                (-targetPos.current.x * 0.1), 
                0
            ], 
            0.5, 
            delta
        );
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as any;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh ref={ref} scale={scale ?? 0.15}>
        {/* We use a flattened Sphere to tightly represent a magnifying lens */}
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 10}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.05}
          roughness={extraMat.roughness ?? 0}
          transmission={extraMat.transmission ?? 1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function DocumentPreview() {
  const { viewport } = useThree();
  
  return (
    <group position={[0,0,-8]}>
        {/* Mock Document Backdrop */}
        <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[10, 14]} />
            <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Glowing Header */}
        <Text
          position={[0, 5, 0.02]}
          fontSize={0.8}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45bgewp.woff"
        >
          ANALYSIS_UPLINK
        </Text>

        {/* Document Formatting Lines */}
        {[...Array(15)].map((_, i) => (
            <mesh key={i} position={[-(Math.random() * 2), 3 - i * 0.7, 0.01]}>
                <planeGeometry args={[Math.random() * 4 + 3, 0.2]} />
                {/* Randomly inject some "found risk" colors mimicking analysis */}
                <meshBasicMaterial color={i === 4 || i === 9 ? "#D9A441" : (i === 12 ? "#B85C5C" : "#cbd5e1")} />
            </mesh>
        ))}
    </group>
  );
}
