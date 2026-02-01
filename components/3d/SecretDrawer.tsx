import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { ViewState } from '../../types';

export const SecretDrawer: React.FC = () => {
  const { setView, view } = useLove();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  // Presentation Mode: When activated from menu
  const isPresentation = view === ViewState.SecretBoxEntrance;
  // Also active if browsing contents (SecretDrawer) to keep it visible in background if needed, 
  // though typically we might zoom in or hide. For now, let's keep it visible in presentation logic.
  
  useFrame((state, delta) => {
    if (groupRef.current) {
        const t = state.clock.getElapsedTime();
        
        if (isPresentation) {
            // Presentation Float
            groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
            groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1; // Gentle sway
            // Tilt slightly forward to see top
            groupRef.current.rotation.x = 0.3; 
        } else {
            // World Float (if we decide to show it in world later, currently hidden by default logic in LoveScene)
            groupRef.current.position.y = -3.5 + Math.sin(t * 0.8) * 0.1;
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x = 0;
        }
    }

    if (lidRef.current) {
        // Only open when browsing content, closed during presentation "Choice" phase
        const isOpen = view === ViewState.SecretDrawer;
        const targetRotation = isOpen ? -1.8 : 0;
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRotation, delta * 3);
    }
  });

  // Material for the Velvet Box
  const velvetMaterial = (
      <meshStandardMaterial 
        color="#881337" // Deep Rose Red
        roughness={0.9} 
        metalness={0.1}
      />
  );
  
  // Gold Trim Material
  const goldMaterial = (
      <meshStandardMaterial 
        color="#FDBA74" 
        roughness={0.2} 
        metalness={1.0} 
        emissive="#F59E0B"
        emissiveIntensity={0.2}
      />
  );

  return (
    <group>
      {/* Blackout curtain for presentation */}
      {isPresentation && (
          <mesh position={[0, 0, 1]} rotation={[0,0,0]}>
              <planeGeometry args={[20, 20]} />
              <meshBasicMaterial color="#1a0505" transparent opacity={0.95} />
          </mesh>
      )}

      <group 
        ref={groupRef}
        // Center for presentation, offset for world
        // Changed Scale from 0.8 to 0.5 to make it cute and small
        position={isPresentation ? [0, 0, 3] : [3.5, -3.5, 1]} 
        scale={isPresentation ? 0.5 : 0} // Scale 0 effectively hides it in world if logic fails
        onClick={(e) => {
            e.stopPropagation();
            // Click interaction only needed if not in presentation mode (which has UI overlay)
            if (!isPresentation) setView(ViewState.SecretBoxEntrance);
        }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        
        {/* === CHEST BASE === */}
        <group position={[0, 0, 0]}>
            {/* Main Box */}
            <RoundedBox args={[1.8, 1.0, 1.2]} radius={0.1} smoothness={4}>
               {velvetMaterial}
            </RoundedBox>
            
            {/* Gold Corner Reinforcements (Bottom) */}
            {[[-0.9, -0.5, 0.6], [0.9, -0.5, 0.6], [-0.9, -0.5, -0.6], [0.9, -0.5, -0.6]].map((pos, i) => (
                <mesh key={i} position={pos as any}>
                    <sphereGeometry args={[0.15]} />
                    {goldMaterial}
                </mesh>
            ))}
            
            {/* Vertical Gold Straps */}
            <mesh position={[-0.5, 0, 0.61]}>
                <boxGeometry args={[0.1, 1.0, 0.02]} />
                {goldMaterial}
            </mesh>
            <mesh position={[0.5, 0, 0.61]}>
                <boxGeometry args={[0.1, 1.0, 0.02]} />
                {goldMaterial}
            </mesh>
        </group>

        {/* === CHEST LID (Pivots at back: Z = -0.6, Y = 0.5) === */}
        <group position={[0, 0.5, -0.6]} ref={lidRef}>
             <group position={[0, 0, 0.6]}> {/* Shift geometry to pivot correctly */}
                
                {/* Curved Top (Cylinder Segment) */}
                <group position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                    <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
                         <cylinderGeometry args={[0.6, 0.6, 1.8, 32, 1, false, 0, Math.PI]} />
                         {velvetMaterial}
                    </mesh>
                    {/* Flat bottom of lid */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 0.1, 1.8]} />
                        {velvetMaterial}
                    </mesh>
                </group>

                {/* Gold Rim around Lid */}
                <mesh position={[0, -0.05, 0]}>
                    <boxGeometry args={[1.85, 0.1, 1.25]} />
                    {goldMaterial}
                </mesh>

                {/* Heart Lock Plate */}
                <group position={[0, -0.1, 0.62]}>
                    <mesh rotation={[Math.PI/2, 0, 0]}>
                         <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
                         {goldMaterial}
                    </mesh>
                    {/* Keyhole */}
                    <mesh position={[0, 0, 0.03]} rotation={[Math.PI/2, 0, 0]}>
                         <cylinderGeometry args={[0.03, 0.03, 0.05, 32]} />
                         <meshStandardMaterial color="black" />
                    </mesh>
                </group>

             </group>
        </group>

        {/* === MAGIC GLOW INSIDE === */}
        <pointLight position={[0, 0.5, 0]} color="#f472b6" intensity={isPresentation ? 2 : 0} distance={3} decay={2} />
        
        {/* External Sparkles */}
        <Sparkles 
             count={50} 
             scale={3} 
             size={4} 
             speed={0.4} 
             opacity={0.6} 
             color="#FDBA74"
           />

      </group>
    </group>
  );
};