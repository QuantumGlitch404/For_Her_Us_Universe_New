import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { Mood } from '../../types';

export const Effects: React.FC = () => {
  const { mood, hugActive } = useLove();
  const hugParticlesRef = useRef<THREE.Group>(null);

  // Animation Logic
  useFrame((state) => {
    // Gentle rotation for hug particles to feel like a swirl
    if (hugParticlesRef.current) {
       hugParticlesRef.current.rotation.y -= 0.001; 
       hugParticlesRef.current.rotation.z += 0.0005;
    }
  });

  const moodColor = useMemo(() => {
    if (mood === Mood.Missing) return '#a78bfa';
    if (mood === Mood.Sleepy) return '#60a5fa';
    if (mood === Mood.Flirty) return '#f87171';
    return '#f472b6';
  }, [mood]);

  return (
    <>
      {/* Deep Background Stars - Static and far */}
      <Stars radius={200} depth={100} count={3000} factor={4} saturation={1} fade speed={0.5} />
      
      {/* Mid-layer Stars - Moving slightly */}
      <Stars radius={100} depth={50} count={2000} factor={6} saturation={0} fade speed={1.5} />
      
      {/* Ambient Floating Particles */}
      <Sparkles 
        count={300} 
        scale={15} 
        size={3} 
        speed={0.6} 
        opacity={0.8} 
        color={moodColor}
      />

      {/* Hug Particles: Warm, enveloping swirl of gold and soft pink */}
      {hugActive && (
        <group ref={hugParticlesRef}>
            <Sparkles 
                count={250} 
                scale={10} 
                size={6} 
                speed={0.5} 
                opacity={0.6} 
                color="#fdb44b" // Golden warmth
                noise={2}
            />
            <Sparkles 
                count={100} 
                scale={8} 
                size={8} 
                speed={0.8} 
                opacity={0.4} 
                color="#f9a8d4" // Pink comfort
                noise={1}
            />
        </group>
      )}
    </>
  );
};