import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLove } from '../../store';

export const Fireflies: React.FC = () => {
  const { firefliesActive } = useLove();
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6,
        speed: Math.random() * 0.5 + 0.2,
        offset: Math.random() * 100
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !firefliesActive) return;
    
    const t = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      // Basic wandering behavior
      const x = particle.x + Math.sin(t * particle.speed + particle.offset) * 0.5;
      const y = particle.y + Math.cos(t * particle.speed + particle.offset) * 0.5;
      const z = particle.z;
      
      dummy.position.set(x, y, z);
      
      // Pulse scale
      const s = 1 + Math.sin(t * 5 + particle.offset) * 0.5;
      dummy.scale.setScalar(s);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!firefliesActive) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#fde047" transparent opacity={0.8} />
    </instancedMesh>
  );
};