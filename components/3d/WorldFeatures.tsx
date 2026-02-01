import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, Text, MeshTransmissionMaterial, Sparkles, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useLove } from '../../store';
import { ViewState, OpenWhenPlanet } from '../../types';

// --- Feature 2: High-End Crystal Ball ---
export const CrystalBall: React.FC = () => {
  const { view, crystalBallAnswer, askCrystalBall } = useLove();
  const active = view === ViewState.CrystalBall;
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t) * 0.1;
      
      if (innerRef.current) {
         innerRef.current.rotation.x = t * 0.5;
         innerRef.current.rotation.y = t * 0.3;
      }
    }
  });

  if (!active) return null;

  return (
    <group position={[2.8, -1.2, 2.5]}>
       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
         <mesh ref={meshRef} onClick={askCrystalBall} onPointerOver={() => document.body.style.cursor = 'pointer'}>
           <sphereGeometry args={[1, 64, 64]} />
           <MeshTransmissionMaterial 
              backside
              thickness={1.5}
              roughness={0}
              transmission={1}
              ior={1.52}
              chromaticAberration={0.06}
              anisotropy={0.1}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.1}
              clearcoat={1}
              attenuationDistance={0.5}
              attenuationColor="#e0f2fe"
              color="#ffffff"
           />
         </mesh>
         
         <mesh ref={innerRef} scale={0.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color="#a855f7" 
              emissive="#a855f7"
              emissiveIntensity={2}
              transparent
              opacity={0.3}
              wireframe
            />
         </mesh>

         <Sparkles count={50} scale={2.5} size={3} speed={0.4} opacity={0.6} color="#d8b4fe" />

         <Html center distanceFactor={1.5} transform pointerEvents="none">
            <div className={`transition-all duration-1000 ${crystalBallAnswer ? 'opacity-100 scale-100 blur-none' : 'opacity-60 scale-95 blur-[1px]'}`}>
              <div className="text-center w-64 select-none">
                <div className="text-white font-serif-elegant text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] leading-tight">
                  {crystalBallAnswer || "Shake Me"}
                </div>
              </div>
            </div>
         </Html>
       </Float>
    </group>
  );
};

// --- Feature 3: Ultra Smooth Cinematic Meteor Shower ---
export const MeteorShower: React.FC = () => {
  const { meteorShowerActive } = useLove();
  if (!meteorShowerActive) return null;

  const compliments = ["Beautiful", "Smart", "Sexy", "Kind", "Radiant", "My Soul", "Perfect", "Goddess"];

  return (
    <group>
      {compliments.map((text, i) => (
        <Meteor key={i} delay={i * 8} text={text} /> // Increased delay for spacing
      ))}
    </group>
  );
};

const Meteor: React.FC<{ delay: number, text: string }> = ({ delay, text }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  const startPos = useRef(new THREE.Vector3(12, 12, -8)); 
  const speed = useRef(0.05); // Much slower base speed
  
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const cycleDuration = 30; // Very long cycle
    const localTime = (t + delay) % cycleDuration;
    
    // Active for roughly 15 seconds of slow falling
    if (localTime < 15) { 
      if (!active) {
        if (groupRef.current) {
           startPos.current.set(
             4 + Math.random() * 8, 
             6 + Math.random() * 4, 
             -5 - Math.random() * 5
           );
           groupRef.current.position.copy(startPos.current);
           // Very slight speed variation
           speed.current = 0.08 + Math.random() * 0.05;
        }
        setActive(true);
      }

      if (groupRef.current) {
        // Slow majestic drift
        // Vector is -1.5x, -1y
        groupRef.current.position.x -= delta * speed.current * 1.5; 
        groupRef.current.position.y -= delta * speed.current;
        
        // Alignment
        groupRef.current.rotation.z = 0.58; 
      }
    } else {
      if (active) setActive(false);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {/* Head: Glowing Sphere */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      
      {/* Head Glow */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Tail: Very Long fade-out cylinder */}
      <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.04, 5, 8]} />
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={0.1} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Html position={[0.4, 0.4, 0]} style={{ pointerEvents: 'none' }}>
        <div className="text-white/60 font-hand text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] whitespace-nowrap opacity-0 animate-[fadeIn_3s_ease_forwards]">
           {text}
        </div>
      </Html>
    </group>
  );
};

// --- Feature 4: 100 Reasons Starfield (Twinkling) ---
export const ReasonsStarfield: React.FC = () => {
  const reasons = useMemo(() => [
    "Your smile", "Your laugh", "Your kindness", "Your eyes", "Your cooking", "Your hugs", "The way you sleep",
    "Your jokes", "Your support", "Your brain", "Your ambition", "Your style", "Your scent", "Your voice",
    "Our memories", "Our future", "How you handle stress", "Your patience", "Your love for animals", "You are you"
  ], []);
  
  const stars = useMemo(() => {
    return new Array(25).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8 - 4
      ] as [number, number, number],
      reason: reasons[i % reasons.length]
    }));
  }, [reasons]);

  return (
    <group>
       {stars.map((s, i) => (
         <ReasonStar key={i} position={s.position} text={s.reason} />
       ))}
    </group>
  );
};

const ReasonStar: React.FC<{ position: [number, number, number], text: string }> = ({ position, text }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if(ref.current) {
        // Twinkle
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 3 + position[0]) * 0.3;
        ref.current.scale.setScalar(hovered ? 1.5 : scale);
        
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.5 + Math.sin(t * 5 + position[1]) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'help'; }} 
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={hovered ? "#f472b6" : "#ffffff"} transparent />
      </mesh>
      
      {/* Outer Glow */}
      <mesh scale={2}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.1} />
      </mesh>

      {hovered && (
        <Html distanceFactor={6} zIndexRange={[100, 0]}>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] pointer-events-none select-none">
             <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Reason</div>
             <div className="text-white font-serif-elegant whitespace-nowrap text-lg">
               {text}
             </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- Feature 5: Planetary System (High Fidelity) ---
export const OpenWhenSolarSystem: React.FC = () => {
  const { view, setOpenWhenActive } = useLove();
  if (view !== ViewState.SolarSystem) return null;
  
  const planets: OpenWhenPlanet[] = [
    { id: 'angry', label: 'Angry', color: '#ef4444', emotion: 'Angry', message: "Take a deep breath. I love you even when we fight." },
    { id: 'sad', label: 'Sad', color: '#3b82f6', emotion: 'Sad', message: "It's okay to cry. You are strong, and this will pass." },
    { id: 'happy', label: 'Happy', color: '#eab308', emotion: 'Happy', message: "Your smile is my favorite thing in the world!" },
    { id: 'insecure', label: 'Insecure', color: '#a855f7', emotion: 'Insecure', message: "You are enough. You are beautiful. You are loved." },
    { id: 'excited', label: 'Excited', color: '#f97316', emotion: 'Excited', message: "Go get 'em tiger! I'm cheering for you!" },
  ];

  return (
    <group>
      {planets.map((p, i) => <Planet key={p.id} planet={p} index={i} total={planets.length} setOpenWhenActive={setOpenWhenActive} />)}
    </group>
  );
};

const Planet: React.FC<{ planet: OpenWhenPlanet, index: number, total: number, setOpenWhenActive: any }> = ({ planet, index, total, setOpenWhenActive }) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return (
      <group position={[x, 0, z]}>
         <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
            <group 
                onClick={(e) => { e.stopPropagation(); setOpenWhenActive(planet); }} 
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <mesh>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial 
                    color={planet.color} 
                    roughness={0.7}
                    metalness={0.2}
                  />
                </mesh>
                
                <mesh scale={1.2}>
                   <sphereGeometry args={[0.5, 32, 32]} />
                   <meshBasicMaterial color={planet.color} transparent opacity={0.2} side={THREE.BackSide} />
                </mesh>

                <mesh rotation={[Math.PI/3, 0, 0]}>
                   <ringGeometry args={[0.7, 0.9, 64]} />
                   <meshBasicMaterial color={planet.color} transparent opacity={0.4} side={THREE.DoubleSide} />
                </mesh>
                
                <Billboard position={[0, -1, 0]}>
                   <Text fontSize={0.2} font="https://fonts.gstatic.com/s/quicksand/v30/6xKtdSZaM9iE8KbpRA_hK1QN.woff2" color="white" outlineWidth={0.01} outlineColor="black">
                     {planet.label.toUpperCase()}
                   </Text>
                </Billboard>
            </group>
         </Float>
      </group>
    );
}