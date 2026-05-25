import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import LiquidOrb from './components/LiquidOrb';
import Background from './components/Background';
import SettingsPanel from './components/SettingsPanel';
import Toolbar from './components/Toolbar';
import WidgetDashboard from './components/WidgetDashboard';
import MiniGames from './components/MiniGames';
import Onboarding from './components/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import LiquidGlassUI from './components/LiquidGlassUI';
import ScrollLiquidEffect from './components/ScrollLiquidEffect';
import './styles/globals.css';

function App() {
  const { 
    fullscreen, 
    showSettings, 
    showWidgets, 
    showMiniGames,
    updateStats,
    qualityPreset,
    setScrollY
  } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);

  // Track scroll velocity for liquid effect
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const velocity = currentY - lastScrollY.current;
      setScrollVelocity(velocity);
      lastScrollY.current = currentY;
      setScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [updateStats]);

  const pixelRatio = qualityPreset === 'high' ? Math.min(window.devicePixelRatio, 2) : 
                     qualityPreset === 'medium' ? 1 : 0.75;

  return (
    <div ref={containerRef} className={`app-container ${fullscreen ? 'fullscreen' : ''}`}>
      {/* iOS 26 Liquid Glass Background Layer */}
      <LiquidGlassUI scrollVelocity={scrollVelocity} />

      {/* Loading Screen */}
      <LoadingScreen />

      {/* Onboarding */}
      <Onboarding />

      {/* 3D Canvas with Liquid Effect */}
      <Canvas
        gl={{ 
          antialias: qualityPreset !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={pixelRatio}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Background />
        <LiquidOrb />
        <ScrollLiquidEffect scrollVelocity={scrollVelocity} />
      </Canvas>

      {/* Scroll Content with Liquid Glass Effect */}
      <div className="scroll-container">
        <div className="scroll-content">
          {/* Hero Section */}
          <section className="hero-section">
            <motion.div 
              className="liquid-glass-card hero-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="hero-title">CelestiaFlow</h1>
              <p className="hero-subtitle">Liquid Glass Experience</p>
              <div className="hero-particles" />
            </motion.div>
          </section>

          {/* Feature Sections */}
          <section className="features-section">
            {['Customize', 'Relax', 'Play', 'Connect'].map((feature, i) => (
              <motion.div
                key={feature}
                className="liquid-glass-card feature-card"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="feature-icon">{['✨', '🎵', '🎮', '🌐'][i]}</div>
                <h3>{feature}</h3>
                <p>{['20+ customization options', '16 ambient soundscapes', '5 mini-games', 'Share your creations'][i]}</p>
              </motion.div>
            ))}
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <motion.button 
              className="liquid-glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🌊</span> Change Liquid
            </motion.button>
            <motion.button 
              className="liquid-glass-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🎨</span> Customize
            </motion.button>
          </section>
        </div>
      </div>

      {/* UI Overlays */}
      <Toolbar />
      
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
        {showWidgets && <WidgetDashboard />}
        {showMiniGames && <MiniGames />}
      </AnimatePresence>

      {/* Context Menu */}
      <div id="context-menu" />
    </div>
  );
}

export default App;