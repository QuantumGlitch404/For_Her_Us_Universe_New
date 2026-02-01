import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshTransmissionMaterial, Sparkles, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { ViewState } from '../../types';

export const PromiseRing: React.FC = () => {
  const { setView, view } = useLove();
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Group>(null);
  
  // Presentation Mode: When activated from menu
  const isPresentation = view === ViewState.PromiseEntrance;

  useFrame((state, delta) => {
    if (ringRef.current) {
        const t = state.clock.getElapsedTime();
        
        if (isPresentation) {
            // Majestic presentation spin
            // Rotate around Y to show all sides, but keep it mostly upright
            ringRef.current.rotation.y = Math.sin(t * 0.4) * 0.4; 
            // Slight tilt to show the diamond facets
            ringRef.current.rotation.x = 0.2 + Math.sin(t * 0.2) * 0.05; 
            ringRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
            
            // Gentle floating
            ringRef.current.position.y = Math.sin(t * 0.5) * 0.05;
        } else {
            // Idle animation in world (Spinning slowly)
            ringRef.current.rotation.y += delta * 0.5;
            ringRef.current.rotation.x = 0; 
            ringRef.current.rotation.z = 0;
        }
    }
  });

  // Rose Gold Material props
  const roseGoldMaterial = (
    <meshPhysicalMaterial 
        color="#E0BFB8" // Rose Gold base
        emissive="#502a2a"
        emissiveIntensity={0.1}
        metalness={1} 
        roughness={0.1} 
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
    />
  );

  return (
    <group>
      {/* Background Blackout Curtain for Presentation Mode */}
      {isPresentation && (
          <mesh position={[0, 0, 1]} rotation={[0,0,0]}>
              <planeGeometry args={[20, 20]} />
              <meshBasicMaterial color="#1a0505" transparent opacity={0.95} />
          </mesh>
      )}

      {/* THE RING CONTAINER */}
      <group 
        // Position: Camera is at [0,0,6] looking at [0,0,0]. Ring at [0,0,3] is perfectly centered.
        position={isPresentation ? [0, 0, 3] : [-3.2, 1.5, 0.5]} 
        // Scale: Adjusted for new distance
        scale={isPresentation ? 0.8 : 1}
      >
        <Float speed={isPresentation ? 0.5 : 2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group 
            ref={ringRef}
            onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { 
                e.stopPropagation(); 
                if(!isPresentation) setView(ViewState.PromiseList); 
            }}
            >
            {/* BAND - REMOVED ROTATION so it stands vertically in XY plane */}
            <mesh>
                <torusGeometry args={[1, 0.08, 64, 100]} />
                {roseGoldMaterial}
            </mesh>

            {/* DIAMOND SETTING (The Head) - Positioned at Top (Y=1) */}
            <group position={[0, 1, 0]}>
                
                {/* 4 Prongs (Claws) - Oriented around Y axis */}
                {[45, 135, 225, 315].map((angle, i) => (
                    <mesh key={i} position={[
                        Math.sin(angle * Math.PI / 180) * 0.25, 
                        0.1, 
                        Math.cos(angle * Math.PI / 180) * 0.25
                    ]} rotation={[0.2, 0, angle * Math.PI / 180]}>
                        <cylinderGeometry args={[0.03, 0.05, 0.45, 16]} />
                        {roseGoldMaterial}
                    </mesh>
                ))}

                {/* Base of Diamond Seat */}
                <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.22, 0.08, 0.2, 32]} />
                    {roseGoldMaterial}
                </mesh>

                {/* THE DIAMOND */}
                <mesh position={[0, 0.25, 0]}>
                    <octahedronGeometry args={[0.38, 0]} />
                    <MeshTransmissionMaterial 
                        backside
                        samples={8}
                        resolution={1024}
                        thickness={1.5} // Thicker for more refraction
                        roughness={0}
                        transmission={1}
                        ior={2.4} // Diamond IOR
                        chromaticAberration={0.06} // Rainbow sparkles
                        anisotropy={0.2}
                        color="#ffffff"
                        attenuationColor="#ffffff"
                        attenuationDistance={0.5}
                    />
                </mesh>
                
                {/* Realistic Sparkle Glint overlay */}
                <mesh position={[0, 0.25, 0]} scale={1.1}>
                   <octahedronGeometry args={[0.35, 0]} />
                   <meshBasicMaterial color="white" wireframe transparent opacity={0.05} />
                </mesh>

                {/* Local Glow for the stone */}
                <pointLight position={[0, 0.5, 0]} color="white" intensity={isPresentation ? 4 : 2} distance={3} decay={2} />
            </group>
            
            {/* Ambient Sparkles around ring */}
            <Sparkles 
                count={isPresentation ? 30 : 10} 
                scale={isPresentation ? 2.5 : 1.5} 
                size={isPresentation ? 2 : 4} 
                speed={0.4} 
                opacity={0.6} 
                color="#ffe4e6"
            />

            {/* Floating Label (Only show in World Mode) */}
            {!isPresentation && hovered && (
                <Html position={[0, -1.3, 0]} center style={{ pointerEvents: 'none' }}>
                <div className="text-pink-100 text-xs font-serif-elegant whitespace-nowrap bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)] select-none">
                    Our Promises 💍
                </div>
                </Html>
            )}
            </group>
        </Float>
      </group>
    </group>
  );
};