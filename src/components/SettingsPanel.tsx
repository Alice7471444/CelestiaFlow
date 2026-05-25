import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { LiquidType, BackgroundType } from '../store/useStore';

const liquidTypes: { type: LiquidType; name: string; icon: string; gradient: string }[] = [
  { type: 'water', name: 'Water', icon: '💧', gradient: 'from-blue-400 to-cyan-500' },
  { type: 'lava', name: 'Lava', icon: '🌋', gradient: 'from-orange-500 to-red-600' },
  { type: 'nebula', name: 'Nebula', icon: '🌌', gradient: 'from-purple-500 to-pink-600' },
  { type: 'honey', name: 'Honey', icon: '🍯', gradient: 'from-amber-400 to-yellow-500' },
  { type: 'aurora', name: 'Aurora', icon: '🌈', gradient: 'from-emerald-400 to-teal-500' },
  { type: 'crystal', name: 'Crystal', icon: '💎', gradient: 'from-sky-300 to-blue-400' },
  { type: 'void', name: 'Void', icon: '🕳️', gradient: 'from-gray-800 to-indigo-900' },
  { type: 'plasma', name: 'Plasma', icon: '⚡', gradient: 'from-pink-500 to-purple-600' },
];

const backgrounds: { type: BackgroundType; name: string; icon: string }[] = [
  { type: 'space', name: 'Space', icon: '🌌' },
  { type: 'underwater', name: 'Underwater', icon: '🐠' },
  { type: 'forest', name: 'Forest', icon: '🌲' },
  { type: 'abstract', name: 'Abstract', icon: '🎨' },
  { type: 'sunset', name: 'Sunset', icon: '🌅' },
  { type: 'aurora', name: 'Aurora', icon: '🌈' },
  { type: 'nebula', name: 'Nebula', icon: '🌀' },
  { type: 'ocean', name: 'Ocean', icon: '🌊' },
];

const shapes = [
  { id: 'sphere', name: 'Sphere', icon: '⚪' },
  { id: 'blob', name: 'Blob', icon: '🫧' },
  { id: 'crystal', name: 'Crystal', icon: '💠' },
  { id: 'drop', name: 'Drop', icon: '💧' },
];

const textures = [
  { id: 'smooth', name: 'Smooth', icon: '✨' },
  { id: 'rough', name: 'Rough', icon: '🪨' },
  { id: 'crystalline', name: 'Crystal', icon: '💎' },
  { id: 'fluid', name: 'Fluid', icon: '🌊' },
];

type TabType = 'liquid' | 'physics' | 'audio' | 'visual' | 'recipes' | 'stats';

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('liquid');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  const {
    liquidType, setLiquidType, color1, color2, setColors,
    blurIntensity, setBlurIntensity, refractionIndex, setRefractionIndex,
    orbSize, setOrbSize, particleDensity, setParticleDensity,
    glowIntensity, setGlowIntensity, speed, setSpeed,
    shape, setShape, surfaceTexture, setSurfaceTexture,
    backgroundType, setBackgroundType,
    currentSound, playSound, stopSound, soundVolume, setSoundVolume,
    orbCount, setOrbCount, gravityDirection, setGravityDirection,
    temperature, setTemperature, viscosity, setViscosity,
    recipes, loadRecipe, deleteRecipe, exportRecipes, importRecipes,
    totalTimeSpent, creationsMade, achievements, qualityPreset, setQualityPreset,
    resetToDefaults, randomize
  } = useStore();

  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = achievements.length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const tabs = [
    { id: 'liquid', name: 'Liquid', icon: '💧' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'audio', name: 'Audio', icon: '🎵' },
    { id: 'visual', name: 'Visual', icon: '🎨' },
    { id: 'recipes', name: 'Recipes', icon: '📚' },
    { id: 'stats', name: 'Stats', icon: '📊' },
  ];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] z-50 overflow-hidden"
    >
      <div className="h-full liquid-glass flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customize</h2>
          <button
            onClick={() => useStore.getState().toggleSettings()}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-400 bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Liquid Tab */}
          {activeTab === 'liquid' && (
            <>
              {/* Liquid Type */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Liquid Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {liquidTypes.map((lt) => (
                    <button
                      key={lt.type}
                      onClick={() => setLiquidType(lt.type)}
                      className={`p-3 rounded-xl glass-card transition-all ${
                        liquidType === lt.type ? 'ring-2 ring-blue-400 scale-105' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${lt.gradient} mx-auto mb-2`} />
                      <span className="text-xs">{lt.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Pickers */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Colors</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-white/40 mb-1 block">Primary</label>
                    <input
                      type="color"
                      value={color1}
                      onChange={(e) => setColors(e.target.value, color2)}
                      className="w-full h-12 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-white/40 mb-1 block">Secondary</label>
                    <input
                      type="color"
                      value={color2}
                      onChange={(e) => setColors(color1, e.target.value)}
                      className="w-full h-12 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Shape */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Shape</label>
                <div className="grid grid-cols-4 gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id as any)}
                      className={`p-3 rounded-xl glass-card text-center transition-all ${
                        shape === s.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <div className="text-xs mt-1">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texture */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Surface</label>
                <div className="grid grid-cols-4 gap-2">
                  {textures.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSurfaceTexture(t.id as any)}
                      className={`p-3 rounded-xl glass-card text-center transition-all ${
                        surfaceTexture === t.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <div className="text-xs mt-1">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Physics Tab */}
          {activeTab === 'physics' && (
            <>
              {/* Orb Count */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Orb Count: {orbCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={orbCount}
                  onChange={(e) => setOrbCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Speed */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Speed: {speed.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Viscosity */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Viscosity: {viscosity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={viscosity}
                  onChange={(e) => setViscosity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Temperature: {temperature}°C
                </label>
                <input
                  type="range"
                  min="-50"
                  max="100"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Gravity Direction */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Gravity Direction</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setGravityDirection({ x: 0, y: -1, z: 0 })}
                    className={`p-3 rounded-xl glass-card text-center transition-all ${
                      gravityDirection.y === -1 ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    ⬇️ Down
                  </button>
                  <button
                    onClick={() => setGravityDirection({ x: 0, y: 1, z: 0 })}
                    className={`p-3 rounded-xl glass-card text-center transition-all ${
                      gravityDirection.y === 1 ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    ⬆️ Up
                  </button>
                  <button
                    onClick={() => setGravityDirection({ x: 0, y: 0, z: 0 })}
                    className={`p-3 rounded-xl glass-card text-center transition-all ${
                      gravityDirection.y === 0 ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    🚫 None
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <>
              {/* Volume */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Volume: {Math.round(soundVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Sound Presets */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Ambient Sounds</label>
                <div className="grid grid-cols-3 gap-2">
                  {['🌧️ Rain', '🌊 Ocean', '🔥 Fire', '🍃 Wind', '🎵 Lo-fi', '🌌 Space'].map((sound) => (
                    <button
                      key={sound}
                      onClick={() => currentSound === sound ? stopSound() : playSound(sound)}
                      className={`p-3 rounded-xl glass-card text-center transition-all ${
                        currentSound === sound ? 'ring-2 ring-blue-400 bg-blue-500/20' : ''
                      }`}
                    >
                      <span className="text-2xl">{sound.split(' ')[0]}</span>
                      <div className="text-xs mt-1">{sound.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <>
              {/* Background */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Background</label>
                <div className="grid grid-cols-4 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.type}
                      onClick={() => setBackgroundType(bg.type)}
                      className={`p-3 rounded-xl glass-card text-center transition-all ${
                        backgroundType === bg.type ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <span className="text-2xl">{bg.icon}</span>
                      <div className="text-xs mt-1">{bg.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Properties */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Blur: {blurIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={blurIntensity}
                  onChange={(e) => setBlurIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Refraction: {refractionIndex.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.01"
                  value={refractionIndex}
                  onChange={(e) => setRefractionIndex(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Orb Size: {orbSize.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.01"
                  value={orbSize}
                  onChange={(e) => setOrbSize(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Particles: {particleDensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={particleDensity}
                  onChange={(e) => setParticleDensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Glow: {glowIntensity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Quality Preset */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQualityPreset(q)}
                      className={`p-3 rounded-xl glass-card text-center capitalize transition-all ${
                        qualityPreset === q ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <>
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button onClick={randomize} className="btn-glass flex-1">
                  🎲 Surprise Me
                </button>
                <button onClick={resetToDefaults} className="btn-glass flex-1">
                  🔄 Reset
                </button>
              </div>

              {/* Import/Export */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const data = exportRecipes();
                    navigator.clipboard.writeText(data);
                    alert('Recipes copied to clipboard!');
                  }}
                  className="btn-glass flex-1"
                >
                  📤 Export
                </button>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="btn-glass flex-1"
                >
                  📥 Import
                </button>
              </div>

              {/* Saved Recipes */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Saved Recipes ({recipes.length})
                </label>
                {recipes.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    No recipes saved yet
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="glass-card p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{recipe.name}</div>
                          <div className="text-xs text-white/40">
                            {recipe.liquidType} • {new Date(recipe.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadRecipe(recipe.id)}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteRecipe(recipe.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <>
              {/* Time Stats */}
              <div className="glass-card p-4">
                <div className="text-3xl font-bold text-center">
                  {formatTime(totalTimeSpent)}
                </div>
                <div className="text-sm text-white/60 text-center mt-1">
                  Time Spent
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="text-3xl font-bold text-center">
                  {creationsMade}
                </div>
                <div className="text-sm text-white/60 text-center mt-1">
                  Creations Made
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="text-sm text-white/60 mb-3 block">
                  Achievements ({unlockedAchievements}/{totalAchievements})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className={`glass-card p-3 flex items-center gap-3 ${
                        a.unlockedAt ? '' : 'opacity-50'
                      }`}
                    >
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-white/40">{a.description}</div>
                      </div>
                      {a.unlockedAt && (
                        <span className="ml-auto text-green-400">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Import Recipes</h3>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON data here..."
                className="input-glass h-32 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    importRecipes(importData);
                    setImportData('');
                    setShowImportModal(false);
                  }}
                  className="btn-glass-primary flex-1"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="btn-glass flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}