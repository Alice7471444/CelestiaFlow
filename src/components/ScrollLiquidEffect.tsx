import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

interface ScrollLiquidEffectProps {
  scrollVelocity: number;
}

export default function ScrollLiquidEffect({ scrollVelocity }: ScrollLiquidEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Points>(null);
  const { liquidType } = useStore();

  // Create liquid distortion particles
  const particleCount = 2000;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = Math.random() * 0.05 + 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const velocity = scrollVelocity * 0.001;

    // Animate main liquid mesh
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1 + velocity * 0.5;
      meshRef.current.rotation.y = Math.cos(time * 0.3) * 0.1;
      
      // Liquid wobble effect
      const positions = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        const noise = Math.sin(x * 5 + time) * Math.cos(y * 5 + time) * 0.1;
        positions.setXYZ(i, x, y + noise * (1 + Math.abs(velocity)), z);
      }
      positions.needsUpdate = true;
    }

    // Animate particles to follow scroll
    if (particleRef.current) {
      const positions = particleRef.current.geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);

        // Move particles up/down based on scroll
        y += velocities[i * 3 + 1] + velocity * 2;
        
        // Add wave motion
        x += Math.sin(time * 2 + i * 0.1) * 0.02;
        z += Math.cos(time * 2 + i * 0.1) * 0.01;

        // Reset particles that go off screen
        if (y > 10) y = -10;
        if (y < -10) y = 10;

        positions.setXYZ(i, x, y, z);
      }
      positions.needsUpdate = true;

      // Rotate particle system
      particleRef.current.rotation.y = time * 0.1;
    }
  });

  // Get liquid color based on type
  const liquidColors = useMemo(() => {
    const colors: Record<string, [string, string]> = {
      water: ['#00b4d8', '#0077b6'],
      lava: ['#ff4500', '#ff6b35'],
      nebula: ['#9d4edd', '#c77dff'],
      honey: ['#f4a261', '#e9c46a'],
      aurora: ['#06d6a0', '#1b9aaa'],
      crystal: ['#48cae4', '#90e0ef'],
      void: ['#2d2d2d', '#6c757d'],
      plasma: ['#f72585', '#7209b7'],
    };
    return colors[liquidType] || colors.water;
  }, [liquidType]);

  return (
    <group>
      {/* Main liquid surface */}
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <planeGeometry args={[30, 30, 64, 64]} />
        <meshStandardMaterial
          color={liquidColors[0]}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Liquid particles that follow scroll */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={liquidColors[1]}
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Scroll ripple effect */}
      <ScrollRipples scrollVelocity={scrollVelocity} />
    </group>
  );
}

// Sub-component for scroll ripples
function ScrollRipples({ scrollVelocity }: { scrollVelocity: number }) {
  const ripplesRef = useRef<THREE.Mesh>(null);
  const rippleData = useRef<{ x: number; y: number; age: number; size: number }[]>([]);

  useFrame((_state, delta) => {
    // Create new ripple on fast scroll
    if (Math.abs(scrollVelocity) > 5) {
      rippleData.current.push({
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        age: 0,
        size: 0.5,
      });
    }

    // Update and remove old ripples
    rippleData.current = rippleData.current
      .map(ripple => ({
        ...ripple,
        age: ripple.age + delta,
        size: ripple.size + delta * 2,
      }))
      .filter(ripple => ripple.age < 2);

    // Update mesh geometry
    if (ripplesRef.current && rippleData.current.length > 0) {
      // geometry unused: ripplesRef.current.geometry as THREE.RingGeometry
      // Animate based on ripples
      ripplesRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <mesh ref={ripplesRef} position={[0, 0, 1]}>
      <ringGeometry args={[0.5, 0.8, 32]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}