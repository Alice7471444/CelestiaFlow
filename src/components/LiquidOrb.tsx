import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

interface LiquidOrbProps {
  position?: [number, number, number];
}

function LiquidOrbSphere({ position = [0, 0, 0] }: LiquidOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    liquidType, color1, orbSize, speed, shape,
    viscosity, gravityDirection, breathingActive, breathingPhase
  } = useStore();

  const { viewport } = useThree();

  // Dynamic liquid properties based on type
  const liquidProperties = useMemo(() => {
    const props: Record<string, { distort: number; speed: number; roughness: number; metalness: number }> = {
      water: { distort: 0.4, speed: 1.2, roughness: 0.1, metalness: 0.3 },
      lava: { distort: 0.6, speed: 0.8, roughness: 0.4, metalness: 0.6 },
      nebula: { distort: 0.8, speed: 0.5, roughness: 0.2, metalness: 0.5 },
      honey: { distort: 0.3, speed: 0.4, roughness: 0.5, metalness: 0.2 },
      aurora: { distort: 0.7, speed: 0.6, roughness: 0.1, metalness: 0.4 },
      crystal: { distort: 0.5, speed: 1.0, roughness: 0.0, metalness: 0.8 },
      void: { distort: 0.9, speed: 0.3, roughness: 0.6, metalness: 0.7 },
      plasma: { distort: 0.8, speed: 1.5, roughness: 0.2, metalness: 0.5 },
    };
    return props[liquidType] || props.water;
  }, [liquidType]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Mouse interaction
    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;
    
    // Smooth lerp for mouse following
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05 * speed;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05 * speed;
    
    // Breathing animation
    if (breathingActive) {
      const breatheScale = breathingPhase === 'inhale' ? 1.1 : breathingPhase === 'hold' ? 1.15 : 0.95;
      meshRef.current.scale.setScalar(orbSize * breatheScale);
    } else {
      // Normal pulsing
      const pulse = Math.sin(time * 2 * speed) * 0.05;
      meshRef.current.scale.setScalar(orbSize + pulse);
    }
    
    // Gravity influence
    const gravX = gravityDirection.x * 0.001 * (1 - viscosity);
    const gravY = gravityDirection.y * 0.001 * (1 - viscosity);
    const gravZ = gravityDirection.z * 0.001 * (1 - viscosity);
    
    meshRef.current.position.x += gravX;
    meshRef.current.position.y += gravY;
    meshRef.current.position.z += gravZ;
    
    // Rotation
    meshRef.current.rotation.x += 0.001 * speed * (1 - viscosity);
    meshRef.current.rotation.y += 0.002 * speed * (1 - viscosity);
  });

  const handleClick = () => {
    if (meshRef.current) {
      // Ripple effect on click
      const scale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(scale * 1.3);
      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.scale.setScalar(scale);
        }
      }, 300);
    }
  };

  return (
    <Float
      speed={2 * speed}
      rotationIntensity={0.5 * speed}
      floatIntensity={0.5 * (1 - viscosity)}
    >
      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        {shape === 'sphere' && (
          <sphereGeometry args={[1, 64, 64]} />
        )}
        {shape === 'blob' && (
          <icosahedronGeometry args={[1, 3]} />
        )}
        {shape === 'crystal' && (
          <octahedronGeometry args={[1.2, 0]} />
        )}
        {shape === 'drop' && (
          <coneGeometry args={[0.8, 1.5, 32]} />
        )}
        <MeshDistortMaterial
          color={color1}
          envMapIntensity={0.8}
          roughness={liquidProperties.roughness + (1 - viscosity) * 0.2}
          metalness={liquidProperties.metalness}
          distort={liquidProperties.distort * 0.5}
          speed={liquidProperties.speed * speed * 2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const { color1, particleDensity } = useStore();
  const particlesRef = useRef<THREE.Points>(null);
  
  const count = Math.floor(particleDensity * 500);
  
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 1;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      siz[i] = Math.random() * 0.05 + 0.02;
    }
    
    return [pos, siz];
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color1}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function OrbManager() {
  const { orbCount } = useStore();
  
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [1.5, 0, -0.5],
    [-1.5, 0, -0.5],
    [0, 1, -0.5],
  ];

  return (
    <>
      {Array.from({ length: orbCount }).map((_, i) => (
        <LiquidOrbSphere key={i} position={positions[i]} />
      ))}
      <Particles />
    </>
  );
}

export default function LiquidOrb() {
  const { backgroundType, qualityPreset } = useStore();
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#88ccff" />
      
      {/* Dynamic environment */}
      {backgroundType === 'space' && (
        <>
          <Stars radius={100} depth={50} count={5000 * (qualityPreset === 'high' ? 1 : 0.3)} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </>
      )}
      {backgroundType === 'underwater' && (
        <fog attach="fog" args={['#001030', 5, 20]} />
      )}
      {backgroundType === 'forest' && (
        <Environment preset="park" />
      )}
      {backgroundType === 'sunset' && (
        <Environment preset="sunset" />
      )}
      {backgroundType === 'aurora' && (
        <>
          <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.5} fade speed={0.5} />
          <Environment preset="night" />
        </>
      )}
      {backgroundType === 'nebula' && (
        <>
          <Stars radius={80} depth={80} count={8000} factor={5} saturation={0.8} fade speed={0.3} />
          <Environment preset="night" />
        </>
      )}
      
      {/* Main orb(s) */}
      <OrbManager />
    </>
  );
}