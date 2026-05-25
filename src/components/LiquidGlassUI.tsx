import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

interface LiquidGlassUIProps {
  scrollVelocity: number;
}

// Liquid blob that follows mouse/scroll

// Water droplet particles
function WaterParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="water-particle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.5],
        y: [-50, -200],
      }}
      transition={{
        duration: 2,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    />
  );
}

// Glass card with liquid effect
export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { color1 } = useStore();
  
  return (
    <motion.div
      className={`glass-card-ios ${className}`}
      style={{
        '--liquid-color': color1,
      } as React.CSSProperties}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 20px 60px -10px ${color1}40, 0 0 40px -10px ${color1}30`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="glass-shine" />
      <div className="glass-content">{children}</div>
    </motion.div>
  );
}

// Main LiquidGlassUI component
export default function LiquidGlassUI({ scrollVelocity }: LiquidGlassUIProps) {
  const { liquidType } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY + window.scrollY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track touch for mobile
  useEffect(() => {
    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Scroll-based liquid movement
  useEffect(() => {
    setScrollOffset(prev => prev + scrollVelocity * 0.5);
  }, [scrollVelocity]);

  // Generate liquid color based on type
  const liquidColors = useMemo(() => {
    const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
      water: { primary: '#00b4d8', secondary: '#0077b6', accent: '#90e0ef' },
      lava: { primary: '#ff4500', secondary: '#ff6b35', accent: '#ffaa00' },
      nebula: { primary: '#9d4edd', secondary: '#c77dff', accent: '#e0aaff' },
      honey: { primary: '#f4a261', secondary: '#e9c46a', accent: '#ffd166' },
      aurora: { primary: '#06d6a0', secondary: '#1b9aaa', accent: '#64dfdf' },
      crystal: { primary: '#48cae4', secondary: '#90e0ef', accent: '#caf0f8' },
      void: { primary: '#2d2d2d', secondary: '#6c757d', accent: '#adb5bd' },
      plasma: { primary: '#f72585', secondary: '#7209b7', accent: '#b5179e' },
    };
    return colors[liquidType] || colors.water;
  }, [liquidType]);

  // Create ripple effect on scroll
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    if (Math.abs(scrollVelocity) > 8 && !isTouching) {
      const newRipple = {
        id: Date.now(),
        x: mousePos.x + (Math.random() - 0.5) * 200,
        y: window.scrollY + mousePos.y % window.innerHeight,
        age: 0,
      };
      setRipples(prev => [...prev.slice(-10), newRipple]);
    }

    // Age and remove ripples
    const interval = setInterval(() => {
      setRipples(prev => prev.map(r => ({ ...r, age: r.age + 1 })).filter(r => r.age < 30));
    }, 50);

    return () => clearInterval(interval);
  }, [scrollVelocity, mousePos, isTouching]);

  // Generate random water particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 6,
    }));
  }, []);

  return (
    <div ref={containerRef} className="liquid-glass-overlay">
      {/* Main liquid blob that follows cursor/scroll */}
      <div
        className="main-liquid-blob"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${liquidColors.accent}60, ${liquidColors.primary}40, ${liquidColors.secondary}20, transparent)`,
          transform: `translate(${mousePos.x * 0.05}px, ${(mousePos.y + scrollOffset) * 0.03}px)`,
          opacity: isTouching ? 0.8 : 0.6,
        }}
      />

      {/* Secondary smaller blobs */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="secondary-liquid-blob"
          style={{
            background: `radial-gradient(circle, ${liquidColors.secondary}50, transparent)`,
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            transform: `translate(${(mousePos.x + i * 50) * 0.02}px, ${(mousePos.y + scrollOffset + i * 30) * 0.02}px)`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* Water particles */}
      {particles.map(p => (
        <WaterParticle key={p.id} x={p.x} y={p.y} delay={p.delay} />
      ))}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="scroll-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            '--ripple-age': ripple.age,
          } as React.CSSProperties}
        />
      ))}

      {/* Liquid wave effect at bottom */}
      <div 
        className="liquid-wave-container"
        style={{ 
          background: `linear-gradient(to top, ${liquidColors.primary}20, transparent)`,
        }}
      >
        <svg className="liquid-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill={liquidColors.primary}
            fillOpacity="0.1"
            d={`M0,${160 + Math.sin(scrollOffset * 0.01) * 20}
                C${scrollOffset % 720},${180 + Math.sin(scrollOffset * 0.02) * 30}
                ${360 + scrollOffset % 360},${140 + Math.cos(scrollOffset * 0.015) * 20}
                ${720},${160 + Math.sin(scrollOffset * 0.01) * 25}
                C${1080 + scrollOffset % 720},${180 + Math.cos(scrollOffset * 0.02) * 20}
                ${1260 + scrollOffset % 360},${140 + Math.sin(scrollOffset * 0.015) * 30}
                1440,160 L1440,320 L0,320 Z`}
          />
        </svg>
      </div>

      {/* Glassmorphism noise texture */}
      <div className="glass-noise" />
    </div>
  );
}

// Liquid Button component
export function LiquidButton({ children, onClick, variant = 'primary' }: { 
  children: React.ReactNode; 
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const { color1 } = useStore();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className={`liquid-button ${variant}`}
      onClick={onClick}
      onHoverStart={() => setIsPressed(true)}
      onHoverEnd={() => setIsPressed(false)}
      whileTap={{ scale: 0.95 }}
      style={{
        '--btn-color': color1,
      } as React.CSSProperties}
    >
      <span className="liquid-button-shine" />
      <span className="liquid-button-text">{children}</span>
      {isPressed && <div className="liquid-button-ripple" />}
    </motion.button>
  );
}

// Liquid Navigation component
export function LiquidNav({ items }: { items: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { color1 } = useStore();

  return (
    <nav className="liquid-nav">
      <div className="liquid-nav-track">
        <motion.div
          className="liquid-nav-indicator"
          initial={false}
          animate={{ x: activeIndex * 25 + '%' }}
          style={{ background: color1 }}
        />
      </div>
      {items.map((item, i) => (
        <button
          key={item}
          className={`liquid-nav-item ${activeIndex === i ? 'active' : ''}`}
          onClick={() => setActiveIndex(i)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}