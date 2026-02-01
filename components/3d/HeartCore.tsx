import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLove } from '../../store';
import { Mood } from '../../types';

export const HeartCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { mood, partnerOnline } = useLove();

  const heartGeometry = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 32,
      steps: 8, 
      bevelSize: 0.15,
      bevelThickness: 0.15,
      curveSegments: 128
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();
    geometry.rotateZ(Math.PI);
    return geometry;
  }, []);

  const getColors = () => {
    switch (mood) {
      case Mood.Missing: return { color: '#8b5cf6', emissive: '#4c1d95' };
      case Mood.Happy: return { color: '#fcd34d', emissive: '#fbbf24' };
      case Mood.Sleepy: return { color: '#1e3a8a', emissive: '#172554' };
      case Mood.Flirty: return { color: '#ef4444', emissive: '#b91c1c' };
      default: return { color: '#f472b6', emissive: '#db2777' };
    }
  };

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    const t = state.clock.getElapsedTime();
    const breathing = Math.sin(t * 1.5) * 0.05 + 1;
    const beatRate = partnerOnline ? 2.5 : 1.5;
    const beatImpulse = Math.exp(-Math.pow((t * beatRate % 1 - 0.5) * 10, 2)) * 0.15;
    
    const targetScale = breathing + beatImpulse;
    const currentScale = meshRef.current.scale.x;
    const smoothScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    
    meshRef.current.scale.setScalar(smoothScale);
    meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;

    const colors = getColors();
    materialRef.current.color.lerp(new THREE.Color(colors.color), 0.05);
    materialRef.current.emissive.lerp(new THREE.Color(colors.emissive), 0.05);
    materialRef.current.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.1;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={heartGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial 
          ref={materialRef}
          roughness={0.2}
          metalness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={1}
          iridescence={0.3}
          iridescenceIOR={1.4}
        />
      </mesh>
    </group>
  );
};