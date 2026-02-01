import React from 'react';

export enum Mood {
  Romantic = 'ROMANTIC',
  Missing = 'MISSING',
  Happy = 'HAPPY',
  Sleepy = 'SLEEPY',
  Flirty = 'FLIRTY'
}

export enum ViewState {
  Orbit = 'ORBIT',
  Letter = 'LETTER',
  Focus = 'FOCUS',
  Chat = 'CHAT',
  CrystalBall = 'CRYSTAL_BALL',
  SolarSystem = 'SOLAR_SYSTEM',
  DreamDate = 'DREAM_DATE',
  PromiseList = 'PROMISE_LIST',
  SecretDrawer = 'SECRET_DRAWER',
  PortalEntrance = 'PORTAL_ENTRANCE',
  PromiseEntrance = 'PROMISE_ENTRANCE',
  SecretBoxEntrance = 'SECRET_BOX_ENTRANCE'
}

export interface LoveLetter {
  id: string;
  title: string;
  content: string;
  date: string;
  unlocked: boolean;
  position: [number, number, number];
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  timestamp: number;
}

export interface OpenWhenPlanet {
  id: string;
  label: string;
  color: string;
  emotion: string;
  message: string;
}

// --- NEW FEATURE TYPES ---

export interface LoveReason {
  id: number;
  category: 'physical' | 'personality' | 'memory' | 'future' | 'daily' | 'intimate';
  text: string;
}

export interface PromiseItem {
  id: number;
  text: string;
  kept: boolean;
}

export interface FlirtyNote {
  id: number;
  level: 1 | 2 | 3; // 1=Flirty, 2=Spicy, 3=Private
  text: string;
  read: boolean;
}

export interface DreamDestination {
  id: string;
  title: string;
  description: string;
  emoji: string;
  loveNote: string;
  color: string;
}

export interface BottleMessage {
  id: number;
  category: 'love' | 'memory' | 'future';
  text: string;
}

// Define the custom elements interface once
interface CustomIntrinsicElements {
  // Core
  group: any;
  mesh: any;
  instancedMesh: any;
  primitive: any;
  object3D: any;

  // Lights
  ambientLight: any;
  pointLight: any;
  spotLight: any;
  directionalLight: any;
  hemisphereLight: any;
  rectAreaLight: any;

  // Geometries
  sphereGeometry: any;
  boxGeometry: any;
  cylinderGeometry: any;
  planeGeometry: any;
  torusGeometry: any;
  extrudeGeometry: any;
  ringGeometry: any;
  octahedronGeometry: any;
  dodecahedronGeometry: any;
  icosahedronGeometry: any;
  tetrahedronGeometry: any;
  circleGeometry: any;
  coneGeometry: any;
  tubeGeometry: any;
  latheGeometry: any;
  capsuleGeometry: any;
  polyhedronGeometry: any;
  edgesGeometry: any;
  wireframeGeometry: any;
  shapeGeometry: any;
  torusKnotGeometry: any;

  // Materials
  meshPhysicalMaterial: any;
  meshStandardMaterial: any;
  meshBasicMaterial: any;
  meshPhongMaterial: any;
  meshLambertMaterial: any;
  meshDepthMaterial: any;
  meshNormalMaterial: any;
  meshMatcapMaterial: any;
  meshToonMaterial: any;
  shaderMaterial: any;
  pointsMaterial: any;
  spriteMaterial: any;
  shadowMaterial: any;
  meshTransmissionMaterial: any;
  meshDistortMaterial: any;

  // Others
  points: any;
  line: any;
  lineLoop: any;
  lineSegments: any;
  sprite: any;
  
  // Audio
  audioListener: any;
  positionalAudio: any;

  // Cameras
  perspectiveCamera: any;
  orthographicCamera: any;
  cubeCamera: any;

  // Catch-all
  [elemName: string]: any;
}

// Augment Global JSX
declare global {
  namespace JSX {
    interface IntrinsicElements extends CustomIntrinsicElements {}
  }
}

// Augment React JSX module
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends CustomIntrinsicElements {}
  }
}
