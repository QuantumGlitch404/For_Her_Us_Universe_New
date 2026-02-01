import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLove } from '../../store';

export const Aurora: React.FC = () => {
  const { auroraActive } = useLove();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && auroraActive) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  if (!auroraActive) return null;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      float t = time * 0.5;
      vec2 uv = vUv;
      
      // Simple sine wave aurora effect
      float wave = sin(uv.x * 10.0 + t) * 0.1 + sin(uv.x * 20.0 - t * 2.0) * 0.05;
      float strength = 1.0 - abs(uv.y - 0.5 + wave) * 4.0;
      strength = clamp(strength, 0.0, 1.0);
      
      vec3 colorA = vec3(0.0, 1.0, 0.5); // Green
      vec3 colorB = vec3(0.5, 0.0, 1.0); // Purple
      
      vec3 color = mix(colorA, colorB, uv.x + sin(t));
      
      gl_FragColor = vec4(color, strength * 0.6);
    }
  `;

  return (
    <group position={[0, 4, -5]} scale={[15, 5, 1]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial 
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{ time: { value: 0 } }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};