import React, { Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { HeartCore } from './HeartCore';
import { FloatingLetters } from './FloatingLetters';
import { Effects } from './Effects';
import { useLove } from '../../store';
import { Mood, ViewState } from '../../types';

// New Features
import { CrystalBall, ReasonsStarfield, OpenWhenSolarSystem } from './WorldFeatures';
import { DreamPortal } from './DreamPortal';
import { SecretDrawer } from './SecretDrawer';
import { PromiseRing } from './PromiseRing';

// Handles Camera movement for special events
const CameraRig: React.FC = () => {
  const { hugActive, view } = useLove();
  const { camera } = useThree();
  const isPromiseEntrance = view === ViewState.PromiseEntrance;
  const isSecretBoxEntrance = view === ViewState.SecretBoxEntrance;
  
  useFrame((state, delta) => {
    // 1. Hug Effect: Zoom in slightly
    if (hugActive) {
      const target = new THREE.Vector3(0, 0, 2.5);
      camera.position.lerp(target, delta * 3);
      camera.lookAt(0, 0, 0); 
    } 
    // 2. Promise Ring OR Secret Box Entrance: Force Camera to Center Front
    else if (isPromiseEntrance || isSecretBoxEntrance) {
      const target = new THREE.Vector3(0, 0, 6); // Fixed center position
      camera.position.lerp(target, delta * 4); // Smooth transition
      
      // Force look at center (where ring/box is)
      const lookAtTarget = new THREE.Vector3(0, 0, 0);
      
      // Manually manage quaternion for smooth rotation reset
      const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(camera.position, lookAtTarget, new THREE.Vector3(0, 1, 0))
      );
      camera.quaternion.slerp(targetQuaternion, delta * 4);
    }
  });

  return null;
};

export const LoveScene: React.FC = () => {
  const { 
    mood, whisperMode, view,
    dreamPortalActive, 
    secretDrawerActive, promiseRingActive,
    hugActive 
  } = useLove();

  const isPromiseEntrance = view === ViewState.PromiseEntrance;
  const isSecretBoxEntrance = view === ViewState.SecretBoxEntrance;

  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ touchAction: 'none' }} // Critical for touch gestures
    >
      <Suspense fallback={null}>
        <CameraRig />
        
        {/* Environment */}
        <Environment preset="sunset" blur={0.8} background={false} />

        {/* Lighting - Dims in Whisper Mode */}
        <ambientLight intensity={whisperMode ? 0.05 : (mood === Mood.Sleepy ? 0.1 : 0.3)} />
        <spotLight 
          position={[5, 10, 7]} 
          angle={0.5} 
          penumbra={1} 
          intensity={whisperMode ? 0.5 : 1.5} 
          castShadow 
          color="#ffd6d6"
          shadow-bias={-0.0001}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={mood === Mood.Missing ? "#4c1d95" : "#fbcfe8"} />
        
        {/* Core Elements (Always Visible unless obscured by Full Screen Features) */}
        <HeartCore />
        <FloatingLetters />
        <Effects />
        
        {/* Existing World Features (Always Visible) */}
        <CrystalBall />
        <ReasonsStarfield />
        <OpenWhenSolarSystem />
        
        {/* --- NEW FEATURES (TOGGLEABLE) --- */}
        {dreamPortalActive && <DreamPortal />}
        
        {/* Secret Box: Render if active in world OR if in Entrance Mode OR if Viewing Content */}
        {(secretDrawerActive || isSecretBoxEntrance || view === ViewState.SecretDrawer) && <SecretDrawer />}
        
        {/* Promise Ring: Render if active in world OR if in Presentation Mode */}
        {(promiseRingActive || isPromiseEntrance) && <PromiseRing />}

        {/* 
           OrbitControls needs makeDefault to bind to the camera correctly.
           enabled={!hugActive} prevents conflict when we are animating the hug.
           NO LIMITS on Zoom.
           Disable interaction during full-screen presentations.
        */}
        <OrbitControls 
          makeDefault
          enabled={!hugActive && !isPromiseEntrance && !isSecretBoxEntrance} 
          enablePan={false} 
          enableZoom={true} 
          minDistance={0} 
          maxDistance={Infinity} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 1.5} 
          autoRotate={!whisperMode && !isPromiseEntrance && !isSecretBoxEntrance}
          autoRotateSpeed={whisperMode ? 0 : 0.3}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Suspense>
    </Canvas>
  );
};