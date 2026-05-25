import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LiquidType = 'water' | 'lava' | 'nebula' | 'honey' | 'aurora' | 'crystal' | 'void' | 'plasma';
export type BackgroundType = 'space' | 'underwater' | 'forest' | 'abstract' | 'sunset' | 'aurora' | 'nebula' | 'ocean';
export type ThemeId = string;

export interface Recipe {
  id: string;
  name: string;
  liquidType: LiquidType;
  color1: string;
  color2: string;
  blurIntensity: number;
  refractionIndex: number;
  orbSize: number;
  particleDensity: number;
  glowIntensity: number;
  speed: number;
  shape: 'sphere' | 'blob' | 'crystal' | 'drop';
  surfaceTexture: 'smooth' | 'rough' | 'crystalline' | 'fluid';
  createdAt: number;
}

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'todo' | 'quote' | 'music' | 'stats';
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
  icon: string;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}

export interface Sound {
  id: string;
  name: string;
  url: string;
  category: 'nature' | 'ambient' | 'music' | 'white-noise';
}

interface AppState {
  // Liquid Orb Settings
  liquidType: LiquidType;
  color1: string;
  color2: string;
  blurIntensity: number;
  refractionIndex: number;
  orbSize: number;
  particleDensity: number;
  glowIntensity: number;
  speed: number;
  shape: 'sphere' | 'blob' | 'crystal' | 'drop';
  surfaceTexture: 'smooth' | 'rough' | 'crystalline' | 'fluid';
  
  // Background
  backgroundType: BackgroundType;
  customBackground: string | null;
  
  // Theme
  currentTheme: ThemeId;
  
  // Audio
  currentSound: string | null;
  soundVolume: number;
  isMuted: boolean;
  
  // Multiple Orbs
  orbCount: number;
  
  // Time & Physics
  dayNightMode: 'auto' | 'day' | 'night';
  gravityDirection: { x: number; y: number; z: number };
  temperature: number;
  viscosity: number;
  
  // UI State
  showSettings: boolean;
  showWidgets: boolean;
  showMiniGames: boolean;
  fullscreen: boolean;
  
  // Widgets
  widgets: Widget[];
  
  // Recipes (Presets)
  recipes: Recipe[];
  
  // Achievements
  achievements: Achievement[];
  
  // Statistics
  totalTimeSpent: number;
  creationsMade: number;
  favoritesCount: number;
  currentStreak: number;
  
  // Favorites
  favorites: string[];
  
  // History
  history: Recipe[];
  historyIndex: number;
  
  // Pomodoro Timer
  pomodoroMinutes: number;
  pomodoroActive: boolean;
  
  // Breathing
  breathingActive: boolean;
  breathingPhase: 'inhale' | 'hold' | 'exhale';
  
  // Sleep Mode
  sleepMode: boolean;
  
  // Performance
  qualityPreset: 'low' | 'medium' | 'high';
  showPerformanceStats: boolean;
  scrollY: number;
  setScrollY: (y: number) => void;
  
  // Actions
  setLiquidType: (type: LiquidType) => void;
  setColors: (color1: string, color2: string) => void;
  setBlurIntensity: (value: number) => void;
  setRefractionIndex: (value: number) => void;
  setOrbSize: (value: number) => void;
  setParticleDensity: (value: number) => void;
  setGlowIntensity: (value: number) => void;
  setSpeed: (value: number) => void;
  setShape: (shape: 'sphere' | 'blob' | 'crystal' | 'drop') => void;
  setSurfaceTexture: (texture: 'smooth' | 'rough' | 'crystalline' | 'fluid') => void;
  setBackgroundType: (type: BackgroundType) => void;
  setCustomBackground: (url: string | null) => void;
  setCurrentTheme: (theme: ThemeId) => void;
  playSound: (soundId: string) => void;
  stopSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleMute: () => void;
  setOrbCount: (count: number) => void;
  setDayNightMode: (mode: 'auto' | 'day' | 'night') => void;
  setGravityDirection: (dir: { x: number; y: number; z: number }) => void;
  setTemperature: (temp: number) => void;
  setViscosity: (visc: number) => void;
  toggleSettings: () => void;
  toggleWidgets: () => void;
  toggleMiniGames: () => void;
  toggleFullscreen: () => void;
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  saveRecipe: (name: string) => void;
  loadRecipe: (id: string) => void;
  deleteRecipe: (id: string) => void;
  exportRecipes: () => string;
  importRecipes: (json: string) => void;
  unlockAchievement: (id: string) => void;
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  undo: () => void;
  redo: () => void;
  randomize: () => void;
  resetToDefaults: () => void;
  setPomodoroMinutes: (minutes: number) => void;
  togglePomodoro: () => void;
  toggleBreathing: () => void;
  setBreathingPhase: (phase: 'inhale' | 'hold' | 'exhale') => void;
  toggleSleepMode: () => void;
  setQualityPreset: (preset: 'low' | 'medium' | 'high') => void;
  togglePerformanceStats: () => void;
  updateStats: (timeSpent?: number, creations?: number) => void;
}

const defaultColors = {
  water: ['#4FC3F7', '#0288D1'],
  lava: ['#FF5722', '#BF360C'],
  nebula: ['#9C27B0', '#4A148C'],
  honey: ['#FFC107', '#FF8F00'],
  aurora: ['#00E676', '#00C853'],
  crystal: ['#E1F5FE', '#81D4FA'],
  void: ['#1A1A2E', '#16213E'],
  plasma: ['#FF0080', '#8000FF'],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default Liquid Orb Settings
      liquidType: 'water',
      color1: '#4FC3F7',
      color2: '#0288D1',
      blurIntensity: 0.5,
      refractionIndex: 1.33,
      orbSize: 1,
      particleDensity: 0.5,
      glowIntensity: 0.5,
      speed: 0.5,
      shape: 'sphere',
      surfaceTexture: 'smooth',
      
      // Background
      backgroundType: 'space',
      customBackground: null,
      
      // Theme
      currentTheme: 'cosmic',
      
      // Audio
      currentSound: null,
      soundVolume: 0.5,
      isMuted: false,
      
      // Multiple Orbs
      orbCount: 1,
      
      // Time & Physics
      dayNightMode: 'auto',
      gravityDirection: { x: 0, y: -1, z: 0 },
      temperature: 20,
      viscosity: 0.5,
      
      // UI State
      showSettings: false,
      showWidgets: false,
      showMiniGames: false,
      fullscreen: false,
      
      // Widgets
      widgets: [],
      
      // Recipes (Presets)
      recipes: [],
      
      // Achievements
      achievements: [
        { id: 'first_orb', name: 'First Steps', description: 'Create your first orb', icon: '🌟' },
        { id: 'color_mixer', name: 'Color Master', description: 'Mix 10 different colors', icon: '🎨' },
        { id: 'recipe_saver', name: 'Collector', description: 'Save 5 recipes', icon: '📚' },
        { id: 'sound_explorer', name: 'Audio Explorer', description: 'Try all sound presets', icon: '🎵' },
        { id: 'widget_builder', name: 'Architect', description: 'Create 3 widget layouts', icon: '🏗️' },
        { id: 'multi_orb', name: 'Orb Commander', description: 'Control 4 orbs simultaneously', icon: '👑' },
        { id: 'zen_master', name: 'Zen Master', description: 'Use breathing mode for 10 minutes', icon: '🧘' },
        { id: 'pomodoro_pro', name: 'Pomodoro Pro', description: 'Complete 5 pomodoro sessions', icon: '🍅' },
        { id: 'speed_demon', name: 'Speed Demon', description: 'Set speed to maximum', icon: '⚡' },
        { id: 'glass_thick', name: 'Glass Cannon', description: 'Max out blur intensity', icon: '💎' },
      ],
      
      // Statistics
      totalTimeSpent: 0,
      creationsMade: 0,
      favoritesCount: 0,
      currentStreak: 0,
      
      // Favorites
      favorites: [],
      
      // History
      history: [],
      historyIndex: -1,
      
      // Pomodoro Timer
      pomodoroMinutes: 25,
      pomodoroActive: false,
      
      // Breathing
      breathingActive: false,
      breathingPhase: 'inhale',
      
      // Sleep Mode
      sleepMode: false,
      
      // Performance
      qualityPreset: 'high',
      showPerformanceStats: false,
      
      scrollY: 0,
      setScrollY: (scrollY) => set({ scrollY }),
      // Actions
      setLiquidType: (type) => set(() => {
        const colors = defaultColors[type] || ['#4FC3F7', '#0288D1'];
        return { 
          liquidType: type, 
          color1: colors[0] || '#4FC3F7',
          color2: colors[1] || '#0288D1'
        };
      }),
      setColors: (color1, color2) => set({ color1, color2 }),
      setBlurIntensity: (blurIntensity) => set({ blurIntensity }),
      setRefractionIndex: (refractionIndex) => set({ refractionIndex }),
      setOrbSize: (orbSize) => set({ orbSize }),
      setParticleDensity: (particleDensity) => set({ particleDensity }),
      setGlowIntensity: (glowIntensity) => set({ glowIntensity }),
      setSpeed: (speed) => set({ speed }),
      setShape: (shape) => set({ shape }),
      setSurfaceTexture: (surfaceTexture) => set({ surfaceTexture }),
      setBackgroundType: (backgroundType) => set({ backgroundType }),
      setCustomBackground: (customBackground) => set({ customBackground }),
      setCurrentTheme: (currentTheme) => set({ currentTheme }),
      playSound: (soundId) => set({ currentSound: soundId }),
      stopSound: () => set({ currentSound: null }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setOrbCount: (orbCount) => set({ orbCount: Math.min(Math.max(orbCount, 1), 4) }),
      setDayNightMode: (dayNightMode) => set({ dayNightMode }),
      setGravityDirection: (gravityDirection) => set({ gravityDirection }),
      setTemperature: (temperature) => set({ temperature: Math.min(Math.max(temperature, -50), 100) }),
      setViscosity: (viscosity) => set({ viscosity }),
      toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
      toggleWidgets: () => set((state) => ({ showWidgets: !state.showWidgets })),
      toggleMiniGames: () => set((state) => ({ showMiniGames: !state.showMiniGames })),
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
      removeWidget: (id) => set((state) => ({ widgets: state.widgets.filter(w => w.id !== id) })),
      updateWidget: (id, updates) => set((state) => ({ 
        widgets: state.widgets.map(w => w.id === id ? { ...w, ...updates } : w) 
      })),
      saveRecipe: (name) => set((state) => {
        const recipe: Recipe = {
          id: `recipe_${Date.now()}`,
          name,
          liquidType: state.liquidType,
          color1: state.color1,
          color2: state.color2,
          blurIntensity: state.blurIntensity,
          refractionIndex: state.refractionIndex,
          orbSize: state.orbSize,
          particleDensity: state.particleDensity,
          glowIntensity: state.glowIntensity,
          speed: state.speed,
          shape: state.shape,
          surfaceTexture: state.surfaceTexture,
          createdAt: Date.now(),
        };
        return { recipes: [...state.recipes, recipe], creationsMade: state.creationsMade + 1 };
      }),
      loadRecipe: (id) => set((state) => {
        const recipe = state.recipes.find(r => r.id === id);
        if (recipe) {
          return {
            liquidType: recipe.liquidType,
            color1: recipe.color1,
            color2: recipe.color2,
            blurIntensity: recipe.blurIntensity,
            refractionIndex: recipe.refractionIndex,
            orbSize: recipe.orbSize,
            particleDensity: recipe.particleDensity,
            glowIntensity: recipe.glowIntensity,
            speed: recipe.speed,
            shape: recipe.shape,
            surfaceTexture: recipe.surfaceTexture,
          };
        }
        return state;
      }),
      deleteRecipe: (id) => set((state) => ({ recipes: state.recipes.filter(r => r.id !== id) })),
      exportRecipes: () => JSON.stringify(get().recipes),
      importRecipes: (json) => {
        try {
          const imported = JSON.parse(json);
          if (Array.isArray(imported)) {
            set((state) => ({ recipes: [...state.recipes, ...imported] }));
          }
        } catch (e) {
          console.error('Failed to import recipes');
        }
      },
      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(a => 
          a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
        )
      })),
      addToFavorites: (recipeId) => set((state) => ({
        favorites: [...state.favorites, recipeId],
        favoritesCount: state.favoritesCount + 1
      })),
      removeFromFavorites: (recipeId) => set((state) => ({
        favorites: state.favorites.filter(f => f !== recipeId),
        favoritesCount: Math.max(0, state.favoritesCount - 1)
      })),
      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          const recipe = state.history[newIndex];
          return {
            historyIndex: newIndex,
            liquidType: recipe.liquidType,
            color1: recipe.color1,
            color2: recipe.color2,
            // ... other properties
          };
        }
        return state;
      }),
      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          const recipe = state.history[newIndex];
          return {
            historyIndex: newIndex,
            liquidType: recipe.liquidType,
            color1: recipe.color1,
            color2: recipe.color2,
            // ... other properties
          };
        }
        return state;
      }),
      randomize: () => set(() => {
        const liquidTypes: LiquidType[] = ['water', 'lava', 'nebula', 'honey', 'aurora', 'crystal', 'void', 'plasma'];
        const shapes: ('sphere' | 'blob' | 'crystal' | 'drop')[] = ['sphere', 'blob', 'crystal', 'drop'];
        const textures: ('smooth' | 'rough' | 'crystalline' | 'fluid')[] = ['smooth', 'rough', 'crystalline', 'fluid'];
        const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
        
        return {
          liquidType: liquidTypes[Math.floor(Math.random() * liquidTypes.length)],
          color1: randomColor(),
          color2: randomColor(),
          blurIntensity: Math.random(),
          refractionIndex: 1 + Math.random() * 0.5,
          orbSize: 0.5 + Math.random() * 1,
          particleDensity: Math.random(),
          glowIntensity: Math.random(),
          speed: Math.random(),
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          surfaceTexture: textures[Math.floor(Math.random() * textures.length)],
        };
      }),
      resetToDefaults: () => set({
        liquidType: 'water',
        color1: '#4FC3F7',
        color2: '#0288D1',
        blurIntensity: 0.5,
        refractionIndex: 1.33,
        orbSize: 1,
        particleDensity: 0.5,
        glowIntensity: 0.5,
        speed: 0.5,
        shape: 'sphere',
        surfaceTexture: 'smooth',
        backgroundType: 'space',
        orbCount: 1,
        dayNightMode: 'auto',
        temperature: 20,
        viscosity: 0.5,
      }),
      setPomodoroMinutes: (pomodoroMinutes) => set({ pomodoroMinutes }),
      togglePomodoro: () => set((state) => ({ pomodoroActive: !state.pomodoroActive })),
      toggleBreathing: () => set((state) => ({ breathingActive: !state.breathingActive })),
      setBreathingPhase: (breathingPhase) => set({ breathingPhase }),
      toggleSleepMode: () => set((state) => ({ sleepMode: !state.sleepMode })),
      setQualityPreset: (qualityPreset) => set({ qualityPreset }),
      togglePerformanceStats: () => set((state) => ({ showPerformanceStats: !state.showPerformanceStats })),
      updateStats: (timeSpent, creations) => set((state) => ({
        totalTimeSpent: timeSpent !== undefined ? state.totalTimeSpent + timeSpent : state.totalTimeSpent,
        creationsMade: creations !== undefined ? state.creationsMade + creations : state.creationsMade,
      })),
    }),
    {
      name: 'celestiaflow-storage',
      partialize: (state) => ({
        liquidType: state.liquidType,
        color1: state.color1,
        color2: state.color2,
        blurIntensity: state.blurIntensity,
        refractionIndex: state.refractionIndex,
        orbSize: state.orbSize,
        particleDensity: state.particleDensity,
        glowIntensity: state.glowIntensity,
        speed: state.speed,
        shape: state.shape,
        surfaceTexture: state.surfaceTexture,
        backgroundType: state.backgroundType,
        currentTheme: state.currentTheme,
        soundVolume: state.soundVolume,
        isMuted: state.isMuted,
        orbCount: state.orbCount,
        dayNightMode: state.dayNightMode,
        temperature: state.temperature,
        viscosity: state.viscosity,
        recipes: state.recipes,
        favorites: state.favorites,
        achievements: state.achievements,
        totalTimeSpent: state.totalTimeSpent,
        creationsMade: state.creationsMade,
        qualityPreset: state.qualityPreset,
        widgets: state.widgets,
      }),
    }
  )
);