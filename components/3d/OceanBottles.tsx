import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Cylinder, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';

const Bottle: React.FC<{ position: [number, number, number], delay: number }> = ({ position, delay }) => {
  const { openBottle } = useLove();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      // Realistic Bobbing physics
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + delay) * 0.15;
      ref.current.rotation.z = Math.sin(t * 0.5 + delay) * 0.15;
      ref.current.rotation.x = Math.cos(t * 0.3 + delay) * 0.1;
      
      // Scale on hover
      ref.current.scale.lerp(new THREE.Vector3(hovered ? 1.3 : 1, hovered ? 1.3 : 1, hovered ? 1.3 : 1), delta * 5);
    }
  });

  return (
    <group ref={ref} position={position}>
      <group 
        onClick={openBottle}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {/* Glass Bottle */}
        <Cylinder args={[0.12, 0.12, 0.5, 32]}>
           <MeshTransmissionMaterial 
             color={hovered ? "#a7f3d0" : "#6ee7b7"} 
             transmission={0.95}
             thickness={0.1} 
             roughness={0.1}
             ior={1.5}
           />
        </Cylinder>
        {/* Neck */}
        <mesh position={[0, 0.3, 0]}>
           <cylinderGeometry args={[0.04, 0.08, 0.15, 32]} />
           <MeshTransmissionMaterial color="#6ee7b7" transmission={0.9} thickness={0.1} />
        </mesh>
        
        {/* Cork */}
        <mesh position={[0, 0.4, 0]}>
           <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
           <meshStandardMaterial color="#d4a373" roughness={1} />
        </mesh>
        
        {/* Paper Scroll Inside - Glowing */}
        <mesh position={[0, 0, 0]}>
           <cylinderGeometry args={[0.06, 0.06, 0.35, 8]} />
           <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.2} />
        </mesh>
        
        {/* Internal Light */}
        <pointLight color="#fcd34d" intensity={0.5} distance={0.5} />
      </group>
    </group>
  );
};

export const OceanBottles: React.FC = () => {
  const oceanRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
      if(oceanRef.current) {
          // Slide up animation
          oceanRef.current.position.y = THREE.MathUtils.lerp(oceanRef.current.position.y, -5, delta * 2);
      }
  });

  return (
    <group position={[0, -10, 0]} ref={oceanRef}>
       {/* Stylized Ocean Volume */}
       <mesh position={[0, -1, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <boxGeometry args={[30, 15, 2]} />
          <MeshTransmissionMaterial 
             color="#1e40af" 
             transmission={0.8}
             opacity={0.8}
             roughness={0.2}
             metalness={0.1}
             thickness={2}
             ior={1.33}
             distortion={0.5}
             distortionScale={0.5}
             temporalDistortion={0.2}
          />
       </mesh>
       
       <Bottle position={[-2.5, 0.2, 1]} delay={0} />
       <Bottle position={[2.5, 0.1, -1]} delay={2} />
       <Bottle position={[0, 0.3, 3]} delay={4} />
    </group>
  );
};