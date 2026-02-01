import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles, MeshDistortMaterial, Circle } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { ViewState } from '../../types';

export const DreamPortal: React.FC = () => {
  const { setView } = useLove();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
        // Smooth Scale In
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
    }
    
    // Dr. Strange Portal Spin Effect - uneven speeds
    if (ringRef1.current) ringRef1.current.rotation.z -= delta * 3;
    if (ringRef2.current) ringRef2.current.rotation.z -= delta * 2;
  });

  return (
    <group position={[-3.5, -2, 2]} rotation={[0, 0.4, 0]}>
      <group 
        ref={groupRef}
        scale={[0,0,0]}
        onClick={() => setView(ViewState.DreamDate)}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {/* Main Fiery Energy Ring */}
        <mesh ref={ringRef1}>
           <torusGeometry args={[1.2, 0.12, 16, 100]} />
           <MeshDistortMaterial 
              color="#ea580c" // Orange-600
              emissive="#ff7b00"
              emissiveIntensity={3}
              roughness={0.2}
              metalness={0.1}
              speed={5} 
              distort={0.5}
           />
        </mesh>

         {/* Secondary Outer Sparks Ring */}
         <mesh ref={ringRef2} position={[0,0,-0.1]}>
           <torusGeometry args={[1.3, 0.05, 16, 60]} />
           <MeshDistortMaterial 
              color="#fdb44b" 
              emissive="#fdb44b"
              emissiveIntensity={2}
              roughness={0}
              speed={8} 
              distort={0.8}
              transparent
              opacity={0.6}
           />
        </mesh>

        {/* The Inner Void / Destination Window */}
        <Circle args={[1.1, 64]} position={[0,0,-0.15]}>
             <meshBasicMaterial color="#1a0b2e" />
        </Circle>
        
        {/* Floating Embers/Sparks */}
        <Sparkles 
          count={120} 
          scale={[3.5, 3.5, 1]} 
          size={5} 
          speed={0.6} 
          opacity={1} 
          color="#fdba74"
          noise={0.5} 
        />
        
        {/* Center Glow */}
        <pointLight position={[0,0,1]} color="#ff8800" intensity={2} distance={3} decay={2} />

        {/* Interactive Text */}
        {hovered && (
            <Html position={[0, -1.8, 0]} center>
                <div className="text-orange-100 text-sm font-serif-elegant drop-shadow-[0_0_10px_rgba(251,146,60,0.8)] whitespace-nowrap bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-orange-500/50 pointer-events-none select-none animate-pulse">
                    Open Dream World ✨
                </div>
            </Html>
        )}
      </group>
    </group>
  );
};