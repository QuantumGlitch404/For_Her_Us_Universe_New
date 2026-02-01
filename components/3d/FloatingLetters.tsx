import React, { useState, useMemo } from 'react';
import { Html, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { LoveLetter } from '../../types';

const Envelope: React.FC<{ letter: LoveLetter; onClick: () => void }> = ({ letter, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // Create the triangular flap shape
  const flapShape = useMemo(() => {
    const shape = new THREE.Shape();
    // Inverted triangle for the closed flap
    shape.moveTo(-0.75, 0.5);
    shape.lineTo(0.75, 0.5);
    shape.lineTo(0, -0.1); // Tip of the flap
    shape.lineTo(-0.75, 0.5);
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 4
  };

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5} 
      floatingRange={[-0.1, 0.1]}
      position={new THREE.Vector3(...letter.position)}
    >
      <group 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        scale={hovered ? 1.1 : 1}
      >
        {/* INVISIBLE HITBOX for better click detection. 
            Must be transparent opacity=0, NOT visible=false for events to work. 
        */}
        <mesh>
          <boxGeometry args={[1.9, 1.4, 0.5]} /> {/* Slightly larger hitbox */}
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Main Envelope Body */}
        <RoundedBox args={[1.5, 1.0, 0.05]} radius={0.05} smoothness={8} castShadow receiveShadow>
          <meshStandardMaterial 
            color="#fff1f2" // Soft paper white/pink
            roughness={0.9} // Paper texture
            metalness={0.1}
          />
        </RoundedBox>

        {/* The Folded Flap */}
        <mesh position={[0, 0, 0.026]} rotation={[0, 0, 0]} castShadow>
          <extrudeGeometry args={[flapShape, extrudeSettings]} />
          <meshStandardMaterial color="#ffe4e6" roughness={0.9} />
        </mesh>

        {/* Wax Seal */}
        <group position={[0, 0.15, 0.06]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.05, 32]} />
            <meshStandardMaterial color="#9f1239" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Inner Seal Detail */}
          <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
             <meshStandardMaterial color="#881337" roughness={0.4} />
          </mesh>
        </group>
        
        {/* Floating Label */}
        <Html position={[0, -0.6, 0]} center transform sprite distanceFactor={5} style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}>
          <div className="text-sm text-white font-serif-elegant tracking-wide drop-shadow-lg whitespace-nowrap bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 select-none">
            {letter.title}
          </div>
        </Html>
      </group>
    </Float>
  );
};

export const FloatingLetters: React.FC = () => {
  const { openLetter } = useLove();
  
  // IDs must match keys in UIOverlay
  // Adjusted positions to fit around new features
  const letters: LoveLetter[] = [
    { id: 'lonely', title: 'Open when lonely', content: '', date: '2023-10-01', unlocked: true, position: [-2, 1.5, 2] },
    { id: 'anniversary', title: 'Our Promise', content: '', date: '2023-11-15', unlocked: true, position: [2, 0.5, 2] },
    // Lowered 'morning' drastically from 2.5 to 1.8 to ensure it's below the header area
    { id: 'morning', title: 'Good Morning', content: '', date: '2024-01-20', unlocked: true, position: [0, 1.8, -1] },
  ];

  return (
    <group>
      {letters.map(l => (
        <Envelope key={l.id} letter={l} onClick={() => openLetter(l.id)} />
      ))}
    </group>
  );
};