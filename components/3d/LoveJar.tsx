import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Sparkles, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';

export const LoveJar: React.FC = () => {
  const { triggerReason, activeReason } = useLove();
  const jarRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth entry animation
  useFrame((state, delta) => {
    if (jarRef.current) {
      const t = state.clock.getElapsedTime();
      // Float animation
      jarRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
      jarRef.current.rotation.z = Math.cos(t * 0.1) * 0.05;
      
      // Smooth Scale In logic (Lerp to 1)
      jarRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
    }
  });

  // Generate glowing hearts inside
  const hearts = useMemo(() => {
    return new Array(12).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 0.6, 
        (Math.random() - 0.5) * 1.2, 
        (Math.random() - 0.5) * 0.6
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <group position={[-4.5, 0.5, 2]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group 
          ref={jarRef}
          scale={[0,0,0]} // Start invisible for pop-in effect
          onClick={triggerReason}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          {/* Jar Glass - High Quality Transmission */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.7, 2.2, 32]} />
            <MeshTransmissionMaterial 
              backside
              samples={16}
              resolution={512}
              thickness={0.2}
              roughness={0.1}
              transmission={0.98}
              ior={1.5}
              chromaticAberration={0.04}
              anisotropy={0.1}
              color="#ffe4e6"
            />
          </mesh>

          {/* Glowing Lid */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.2, 32]} />
            <meshStandardMaterial color="#d4a373" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
             <sphereGeometry args={[0.2]} />
             <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={0.5} />
          </mesh>

          {/* Hearts Inside */}
          {hearts.map((h, i) => (
            <FloatingHeart key={i} {...h} />
          ))}

          {/* Internal Glow */}
          <pointLight position={[0, 0, 0]} intensity={1} color="#ff0066" distance={3} decay={2} />

          {/* Particles */}
          <Sparkles count={30} scale={2} size={2} speed={0.4} opacity={0.5} color="#fff" />

          {hovered && (
             <Html position={[0, -1.5, 0]} center distanceFactor={10}>
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-serif-elegant whitespace-nowrap border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse pointer-events-none select-none">
                 Open for Love ✨
               </div>
             </Html>
          )}
        </group>
      </Float>
    </group>
  );
};

const FloatingHeart: React.FC<{ position: [number, number, number], scale: number, speed: number }> = ({ position, scale, speed }) => {
  const ref = useRef<THREE.Group>(null);
  const [initialPos] = useState(position);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = initialPos[1] + Math.sin(t * speed + initialPos[0] * 10) * 0.3;
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.z = Math.sin(t * 2) * 0.1;
    }
  });

  // Simple Heart Shape
  const heartShape = useMemo(() => {
      const x = 0, y = 0;
      const shape = new THREE.Shape();
      shape.moveTo(x + .25, y + .25);
      shape.bezierCurveTo(x + .25, y + .25, x + .20, y, x, y);
      shape.bezierCurveTo(x - .30, y, x - .30, y + .35, x - .30, y + .35);
      shape.bezierCurveTo(x - .30, y + .55, x - .10, y + .77, x + .25, y + .95);
      shape.bezierCurveTo(x + .60, y + .77, x + .80, y + .55, x + .80, y + .35);
      shape.bezierCurveTo(x + .80, y + .35, x + .80, y, x + .50, y);
      shape.bezierCurveTo(x + .35, y, x + .25, y + .25, x + .25, y + .25);
      return shape;
  }, []);

  return (
    <group ref={ref} position={initialPos} scale={scale * 0.3} rotation={[Math.PI, 0, 0]}>
       <mesh>
         <extrudeGeometry args={[heartShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
         <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={0.5} toneMapped={false} />
       </mesh>
    </group>
  );
};

const delta = 0.01; // Approx delta for rotation