import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useStore } from './store/useStore';
import LiquidOrb from './components/LiquidOrb';
import Background from './components/Background';
import SettingsPanel from './components/SettingsPanel';
import Toolbar from './components/Toolbar';
import WidgetDashboard from './components/WidgetDashboard';
import MiniGames from './components/MiniGames';
import Onboarding from './components/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import './styles/globals.css';

function App() {
  const { 
    fullscreen, 
    showSettings, 
    showWidgets, 
    showMiniGames,
    updateStats,
    qualityPreset
  } = useStore();

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
    <div className={`app-container ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Onboarding */}
      <Onboarding />

      {/* 3D Canvas */}
      <Canvas
        gl={{ 
          antialias: qualityPreset !== 'low',
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={pixelRatio}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Background />
        <LiquidOrb />
      </Canvas>

      {/* UI Overlays */}
      <Toolbar />
      
      {showSettings && <SettingsPanel />}
      {showWidgets && <WidgetDashboard />}
      {showMiniGames && <MiniGames />}

      {/* Context Menu */}
      <div id="context-menu" />
    </div>
  );
}

export default App;
