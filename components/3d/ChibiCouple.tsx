import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Sphere, Cylinder, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { Mood } from '../../types';

const ChibiCharacter: React.FC<{ 
  color: string, 
  position: [number, number, number], 
  isFemale?: boolean 
}> = ({ color, position, isFemale = false }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      // Cute bounce
      group.current.position.y = position[1] + Math.abs(Math.sin(t * 3 + (isFemale ? 1 : 0))) * 0.1;
      group.current.scale.y = 1 - Math.abs(Math.sin(t * 3 + (isFemale ? 1 : 0))) * 0.05;
      group.current.scale.x = 1 + Math.abs(Math.sin(t * 3 + (isFemale ? 1 : 0))) * 0.05;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Head - Soft Skin Material */}
      <Sphere args={[0.35, 32, 32]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#ffdbac" roughness={0.5} />
      </Sphere>
      
      {/* Hair */}
      <group position={[0, 0.65, 0]}>
        {isFemale ? (
            <mesh>
                 <sphereGeometry args={[0.38, 32, 32]} />
                 <meshStandardMaterial color="#5d4037" roughness={0.8} />
            </mesh>
        ) : (
             <mesh position={[0, 0.05, 0]}>
                 <sphereGeometry args={[0.37, 32, 32]} />
                 <meshStandardMaterial color="#212121" roughness={0.8} />
             </mesh>
        )}
      </group>

      {/* Eyes - Shiny */}
      <group position={[0, 0.6, 0.3]}>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="black" roughness={0} metalness={0.5} />
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="black" roughness={0} metalness={0.5} />
        </mesh>
        {/* Cute Blush */}
        <mesh position={[-0.18, -0.08, -0.02]}>
             <sphereGeometry args={[0.04]} />
             <meshBasicMaterial color="#ff8fab" opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.18, -0.08, -0.02]}>
             <sphereGeometry args={[0.04]} />
             <meshBasicMaterial color="#ff8fab" opacity={0.6} transparent />
        </mesh>
      </group>

      {/* Body */}
      <Cylinder args={[0.1, 0.25, 0.45, 32]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
    </group>
  );
};

export const ChibiCouple: React.FC = () => {
  const { mood } = useLove();
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<THREE.Group>(null);

  // Pop-in animation
  useFrame((state, delta) => {
      if (rootRef.current) {
          rootRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 3);
      }
  });

  return (
    <group position={[4, 2.5, -1]} ref={rootRef} scale={[0,0,0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group 
           onPointerOver={() => { setHovered(true); document.body.style.cursor = 'help'; }}
           onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          {/* Fluffy Cloud Base using multiple spheres for better look than standard geometry */}
          <group position={[0, -0.3, 0]}>
             <Cloud 
                opacity={0.8} 
                speed={0.4} 
                bounds={[2, 0.5, 1.5]}
                segments={10} 
                color="white"
             />
             {/* Internal glow for the cloud */}
             <pointLight position={[0, 0.5, 0]} color="#a78bfa" intensity={0.5} distance={3} />
          </group>

          {/* Characters */}
          <ChibiCharacter color="#60a5fa" position={[-0.35, 0.4, 0]} />
          <ChibiCharacter color="#f472b6" position={[0.35, 0.4, 0]} isFemale />
          
          {/* Animated Heart */}
          <group position={[0, 1.3, 0]}>
             <mesh scale={hovered || mood === Mood.Romantic ? 1 : 0}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
             </mesh>
             {(hovered || mood === Mood.Romantic) && (
                <pointLight color="red" intensity={1} distance={1} />
             )}
          </group>
          
          {hovered && (
             <Html position={[0, 1.8, 0]} center>
                <div className="bg-white/90 px-3 py-1 rounded-2xl text-xs font-hand text-pink-500 whitespace-nowrap shadow-lg pointer-events-none select-none">
                   Together Forever ❤️
                </div>
             </Html>
          )}
        </group>
      </Float>
    </group>
  );
};