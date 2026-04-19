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
  // We use a simplified ModeWrapper that renders a "Glass Bob" since 3D assets might not be available.
  const modeProps = {
      scale: 2,
      ior: 1.15,
      thickness: 5,
      chromaticAberration: 0.1,
      anisotropy: 0.01,
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

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    // Bob floats and follows pointer slightly, simulating highlighting random parts 
    // or we can add a time-based drift if pointer is idle
    const t = state.clock.getElapsedTime();
    const destX = pointer.x !== 0 ? (pointer.x * v.width) / 2 : Math.sin(t) * 1.5;
    const destY = pointer.y !== 0 ? (pointer.y * v.height) / 2 : Math.cos(t * 0.8) * 1.5;
    
    if (ref.current) {
        easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
        // Add some rotation spin
        ref.current.rotation.x += delta * 0.2;
        ref.current.rotation.y += delta * 0.3;
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
      <mesh ref={ref} scale={scale ?? 2} {...modeProps}>
        {/* We use an Icosahedron to represent a multifaceted "glass bob" */}
        <icosahedronGeometry args={[1, 4]} />
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function DocumentPreview() {
  const { viewport } = useThree();
  
  return (
    <group position={[0,0,10]}>
        {/* Mock Document Backdrop */}
        <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[viewport.width * 0.6, viewport.height * 0.8]} />
            <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        {/* Document Lines */}
        {[...Array(12)].map((_, i) => (
            <mesh key={i} position={[0, 3 - i * 0.6, 0.01]}>
                <planeGeometry args={[Math.random() * 2 + 2, 0.15]} />
                <meshBasicMaterial color={i % 4 === 0 ? "#D9A441" : "#1e293b"} />
            </mesh>
        ))}

        <Text
          position={[0, 4, 0.02]}
          fontSize={0.4}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          CONFIDENTIAL
        </Text>
    </group>
  );
}
