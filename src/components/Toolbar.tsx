import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

const menuItems = [
  { icon: '🎨', label: 'Customize', action: () => useStore.getState().toggleSettings() },
  { icon: '📊', label: 'Widgets', action: () => useStore.getState().toggleWidgets() },
  { icon: '🎮', label: 'Games', action: () => useStore.getState().toggleMiniGames() },
  { icon: '📷', label: 'Screenshot', action: () => handleScreenshot() },
  { icon: '⏱️', label: 'Pomodoro', action: () => {} },
  { icon: '🧘', label: 'Breathing', action: () => useStore.getState().toggleBreathing() },
  { icon: '🌙', label: 'Sleep Mode', action: () => useStore.getState().toggleSleepMode() },
  { icon: '🎲', label: 'Surprise Me', action: () => useStore.getState().randomize() },
  { icon: '💾', label: 'Save Recipe', action: () => handleSaveRecipe() },
  { icon: '📤', label: 'Export', action: () => handleExport() },
];

export default function Toolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    fullscreen, toggleFullscreen, showSettings, 
    breathingActive, pomodoroActive, sleepMode, currentSound, isMuted,
    achievements, favoritesCount, qualityPreset, togglePerformanceStats
  } = useStore();

  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = achievements.length;

  return (
    <>
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="liquid-glass flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              CelestiaFlow
            </span>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="glass-card px-3 py-1.5 flex items-center gap-2">
              <span>🏆</span>
              <span>{unlockedAchievements}/{totalAchievements}</span>
            </div>
            <div className="glass-card px-3 py-1.5 flex items-center gap-2">
              <span>⭐</span>
              <span>{favoritesCount}</span>
            </div>
            <button 
              className="glass-card px-3 py-1.5 hover:bg-white/10 transition-colors"
              onClick={togglePerformanceStats}
            >
              📊
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button 
              className="btn-glass"
              onClick={() => useStore.getState().toggleMute()}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {/* Fullscreen */}
            <button 
              className="btn-glass"
              onClick={toggleFullscreen}
            >
              {fullscreen ? '⛶' : '⛶'}
            </button>

            {/* Settings Toggle */}
            <button 
              className={`btn-glass ${showSettings ? 'btn-glass-primary' : ''}`}
              onClick={() => useStore.getState().toggleSettings()}
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Menu */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="liquid-glass p-2"
        >
          <div className="flex items-center gap-1">
            {/* Main Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
            </button>

            {/* Quick Actions */}
            <AnimatePresence>
              {isOpen && (
                <>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2 ml-3"
                  >
                    {menuItems.slice(0, 5).map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/20 transition-colors"
                        title={item.label}
                      >
                        <span>{item.icon}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2">
        {breathingActive && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg">🧘</span>
            <span className="text-sm">Breathing</span>
          </motion.div>
        )}
        {sleepMode && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg">🌙</span>
            <span className="text-sm">Sleep Mode</span>
          </motion.div>
        )}
        {pomodoroActive && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg">🍅</span>
            <span className="text-sm">Pomodoro</span>
          </motion.div>
        )}
        {currentSound && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card px-3 py-2 flex items-center gap-2"
          >
            <span className="text-lg">🎵</span>
            <span className="text-sm">Playing</span>
          </motion.div>
        )}
      </div>

      {/* Quality Indicator */}
      <div className="fixed bottom-24 right-6 z-40">
        <div className="glass-card px-3 py-1.5 text-xs flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            qualityPreset === 'high' ? 'bg-green-400' : 
            qualityPreset === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
          }`} />
          <span>{qualityPreset.toUpperCase()}</span>
        </div>
      </div>
    </>
  );
}

function handleScreenshot() {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = `celestiaflow-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }
}

function handleSaveRecipe() {
  const name = prompt('Enter recipe name:');
  if (name) {
    useStore.getState().saveRecipe(name);
  }
}

function handleExport() {
  const data = useStore.getState().exportRecipes();
  const blob = new Blob([data], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = `celestiaflow-recipes-${Date.now()}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
}