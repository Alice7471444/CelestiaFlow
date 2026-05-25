import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export default function Background() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { backgroundType } = useStore();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  const getBackgroundGradient = () => {
    const gradients: Record<string, string[]> = {
      space: ['#0a0a1a', '#1a1a3e', '#0f0f2a'],
      underwater: ['#001030', '#003060', '#001520'],
      forest: ['#0a1a0a', '#1a2e1a', '#0f1a0f'],
      abstract: ['#1a0a2e', '#2e1a4e', '#0a1a2e'],
      sunset: ['#1a0a0a', '#3e1a1a', '#2e0a0a'],
      aurora: ['#0a1a1a', '#1a3e2e', '#0a2e2a'],
      nebula: ['#1a0a2e', '#3e0a4e', '#2e0a3e'],
      ocean: ['#001a2e', '#003050', '#001a3e'],
    };
    return gradients[backgroundType] || gradients.space;
  };

  const [color1, color2, color3] = getBackgroundGradient();

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[50, 50, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float time;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec2 uv = vUv;
            
            // Animated gradient
            float t = time * 0.1;
            vec2 p = uv + vec2(t * 0.1, t * 0.05);
            
            float n = noise(p * 3.0) * 0.5 + noise(p * 6.0) * 0.25;
            
            vec3 col1 = mix(color1, color2, uv.y + n * 0.2);
            vec3 col2 = mix(col1, color3, uv.x + n * 0.1);
            
            // Add subtle shimmer
            float shimmer = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time) * 0.02;
            
            gl_FragColor = vec4(col2 + shimmer, 1.0);
          }
        `}
        uniforms={{
          color1: { value: new THREE.Color(color1) },
          color2: { value: new THREE.Color(color2) },
          color3: { value: new THREE.Color(color3) },
          time: { value: 0 },
        }}
      />
    </mesh>
  );
}