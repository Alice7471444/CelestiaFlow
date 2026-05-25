import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

type GameType = 'marble' | 'color-mix' | 'memory' | 'zen' | 'orchestra';

export default function MiniGames() {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const games = [
    { id: 'marble', name: 'Liquid Marble', icon: '🎱', description: 'Navigate through obstacles' },
    { id: 'color-mix', name: 'Color Mixer', icon: '🎨', description: 'Match target colors' },
    { id: 'memory', name: 'Memory Game', icon: '🧠', description: 'Remember patterns' },
    { id: 'zen', name: 'Zen Garden', icon: '🪨', description: 'Create peaceful patterns' },
    { id: 'orchestra', name: 'Particle Orchestra', icon: '🎵', description: 'Make music with liquid' },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-[450px] z-40 max-h-[70vh] overflow-y-auto"
    >
      <div className="liquid-glass p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mini Games</h3>
          <button
            onClick={() => useStore.getState().toggleMiniGames()}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Game Selection */}
        {!activeGame ? (
          <div className="grid grid-cols-2 gap-3">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id as GameType)}
                className="glass-card p-4 text-center hover:bg-white/10 transition-colors"
              >
                <span className="text-4xl mb-2 block">{game.icon}</span>
                <div className="font-medium">{game.name}</div>
                <div className="text-xs text-white/60 mt-1">{game.description}</div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveGame(null)}
              className="mb-4 flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              ← Back to games
            </button>
            {activeGame === 'marble' && <MarbleGame />}
            {activeGame === 'color-mix' && <ColorMixGame />}
            {activeGame === 'memory' && <MemoryGame />}
            {activeGame === 'zen' && <ZenGarden />}
            {activeGame === 'orchestra' && <ParticleOrchestra />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Marble Game Component
function MarbleGame() {
  const [score, setScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setBallPos({ x: 50, y: 50 });
  };

  const handleMove = (direction: string) => {
    if (!isPlaying) return;
    
    const step = 5;
    setBallPos((prev) => {
      let newPos = { ...prev };
      switch (direction) {
        case 'up': newPos.y = Math.max(0, prev.y - step); break;
        case 'down': newPos.y = Math.min(100, prev.y + step); break;
        case 'left': newPos.x = Math.max(0, prev.x - step); break;
        case 'right': newPos.x = Math.min(100, prev.x + step); break;
      }
      // Check for score
      const distance = Math.sqrt(Math.pow(newPos.x - 85, 2) + Math.pow(newPos.y - 15, 2));
      if (distance < 10) {
        setScore((s) => s + 1);
        return { x: 50, y: 50 }; // Reset position
      }
      return newPos;
    });
  };

  return (
    <div className="glass-card p-4">
      <h4 className="text-center font-semibold mb-4">🎱 Liquid Marble</h4>
      
      <div 
        className="w-full h-48 rounded-xl bg-black/30 relative overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Goal */}
        <div 
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-pulse"
          style={{ top: '15%', right: '15%', left: 'auto', transform: 'translate(-50%, -50%)' }}
        />
        
        {/* Ball */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg"
          style={{ 
            top: `${ballPos.y}%`, 
            left: `${ballPos.x}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s ease'
          }}
        />
        
        {/* Obstacles */}
        <div className="absolute top-1/3 left-1/4 w-16 h-2 bg-white/20 rounded-full" />
        <div className="absolute top-2/3 right-1/4 w-16 h-2 bg-white/20 rounded-full" />
      </div>
      
      <div className="text-center my-4">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-sm text-white/60 ml-2">Score</span>
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
        <div />
        <button onClick={() => handleMove('up')} className="btn-glass py-2">↑</button>
        <div />
        <button onClick={() => handleMove('left')} className="btn-glass py-2">←</button>
        <button onClick={() => handleMove('down')} className="btn-glass py-2">↓</button>
        <button onClick={() => handleMove('right')} className="btn-glass py-2">→</button>
      </div>
      
      {!isPlaying && (
        <button onClick={handleStart} className="btn-glass-primary w-full mt-4">
          Start Game
        </button>
      )}
    </div>
  );
}

// Color Mix Game Component
function ColorMixGame() {
  const [targetColor, setTargetColor] = useState({ r: 0, g: 0, b: 0 });
  const [currentColor, setCurrentColor] = useState({ r: 128, g: 128, b: 128 });
  const [score, setScore] = useState(0);

  const generateTarget = () => {
    setTargetColor({
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    });
    setCurrentColor({ r: 128, g: 128, b: 128 });
  };

  const adjustColor = (channel: 'r' | 'g' | 'b', delta: number) => {
    setCurrentColor((prev) => ({
      ...prev,
      [channel]: Math.max(0, Math.min(255, prev[channel] + delta)),
    }));
  };

  const checkMatch = () => {
    const diff = Math.abs(targetColor.r - currentColor.r) +
                 Math.abs(targetColor.g - currentColor.g) +
                 Math.abs(targetColor.b - currentColor.b);
    
    if (diff < 100) {
      setScore((s) => s + 1);
    }
    generateTarget();
  };

  return (
    <div className="glass-card p-4">
      <h4 className="text-center font-semibold mb-4">🎨 Color Mixer</h4>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="text-xs text-white/60 mb-1 text-center">Target</div>
          <div 
            className="w-full h-24 rounded-xl"
            style={{ backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})` }}
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-white/60 mb-1 text-center">Your Mix</div>
          <div 
            className="w-full h-24 rounded-xl"
            style={{ backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})` }}
          />
        </div>
      </div>
      
      {/* RGB Sliders */}
      <div className="space-y-3 mb-4">
        {(['r', 'g', 'b'] as const).map((channel) => (
          <div key={channel} className="flex items-center gap-2">
            <span className="w-4 text-sm font-mono uppercase">{channel}</span>
            <input
              type="range"
              min="0"
              max="255"
              value={currentColor[channel]}
              onChange={() => adjustColor(channel, 0)}
              onInput={(e) => adjustColor(channel, parseInt(e.currentTarget.value) - currentColor[channel])}
              className="flex-1"
            />
            <span className="w-8 text-sm text-right">{currentColor[channel]}</span>
          </div>
        ))}
      </div>
      
      <div className="text-center mb-4">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-sm text-white/60 ml-2">Matches</span>
      </div>
      
      <button onClick={checkMatch} className="btn-glass-primary w-full">
        Submit
      </button>
      
      <button onClick={generateTarget} className="btn-glass w-full mt-2">
        New Target
      </button>
    </div>
  );
}

// Memory Game Component
function MemoryGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const colors = ['🔴', '🔵', '🟢', '🟡'];

  const addToSequence = () => {
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    showSequence(newSeq);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowing(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsShowing(false);
  };

  const handleClick = (index: number) => {
    if (isShowing || gameOver) return;
    
    const newPlayerSeq = [...playerSeq, index];
    setPlayerSeq(newPlayerSeq);
    
    // Check if correct
    if (sequence[newPlayerSeq.length - 1] !== index) {
      setGameOver(true);
      return;
    }
    
    // Check if complete
    if (newPlayerSeq.length === sequence.length) {
      setScore((s) => s + 1);
      setPlayerSeq([]);
      setTimeout(() => addToSequence(), 1000);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerSeq([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="glass-card p-4">
      <h4 className="text-center font-semibold mb-4">🧠 Memory Game</h4>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-20 rounded-xl text-4xl transition-all ${
              isShowing ? 'bg-white/10' : 'bg-white/5 hover:bg-white/20'
            } ${playerSeq.includes(i) ? 'ring-2 ring-white/50' : ''}`}
          >
            {color}
          </button>
        ))}
      </div>
      
      <div className="text-center mb-4">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-sm text-white/60 ml-2">Sequence Length</span>
      </div>
      
      {gameOver ? (
        <div className="text-center">
          <p className="text-lg mb-2">Game Over!</p>
          <p className="text-white/60 mb-4">You reached sequence of {sequence.length}</p>
          <button onClick={resetGame} className="btn-glass-primary">Play Again</button>
        </div>
      ) : sequence.length === 0 ? (
        <button onClick={addToSequence} className="btn-glass-primary w-full">
          Start Game
        </button>
      ) : isShowing ? (
        <div className="text-center text-white/60">Watch the sequence...</div>
      ) : (
        <div className="text-center text-white/60">Your turn! ({playerSeq.length}/{sequence.length})</div>
      )}
    </div>
  );
}

// Zen Garden Component
function ZenGarden() {
  const [rocks, setRocks] = useState<{ x: number; y: number; size: number }[]>([]);

  const addRock = (x: number, y: number) => {
    setRocks([...rocks, { x, y, size: 10 + Math.random() * 20 }]);
  };

  const clearAll = () => {
    setRocks([]);
  };

  return (
    <div className="glass-card p-4">
      <h4 className="text-center font-semibold mb-4">🪨 Zen Garden</h4>
      
      <div 
        className="w-full h-48 rounded-xl bg-gradient-to-b from-amber-200 to-amber-300 relative overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          addRock(x, y);
        }}
        style={{ cursor: 'pointer' }}
      >
        {rocks.map((rock, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-600 shadow-lg"
            style={{
              left: `${rock.x}%`,
              top: `${rock.y}%`,
              width: rock.size,
              height: rock.size * 0.8,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
      
      <p className="text-center text-sm text-white/60 mt-2 mb-4">
        Click to place rocks
      </p>
      
      <button onClick={clearAll} className="btn-glass w-full">
        Clear Garden
      </button>
    </div>
  );
}

// Particle Orchestra Component
function ParticleOrchestra() {
  const [notes, setNotes] = useState<string[]>([]);
  const frequencies = [
    { note: 'C4', freq: 261.63 },
    { note: 'D4', freq: 293.66 },
    { note: 'E4', freq: 329.63 },
    { note: 'G4', freq: 392.00 },
    { note: 'A4', freq: 440.00 },
    { note: 'C5', freq: 523.25 },
  ];

  const playNote = (index: number) => {
    setNotes([...notes, frequencies[index].note]);
    // In a real app, we'd use Web Audio API here
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[index].freq;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <div className="glass-card p-4">
      <h4 className="text-center font-semibold mb-4">🎵 Particle Orchestra</h4>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {frequencies.map((f, i) => (
          <button
            key={i}
            onClick={() => playNote(i)}
            className="p-4 rounded-xl glass-card text-center hover:bg-white/20 transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">♪</div>
            <div className="text-sm">{f.note}</div>
            <div className="text-xs text-white/40">{f.freq}Hz</div>
          </button>
        ))}
      </div>
      
      {notes.length > 0 && (
        <div className="text-center text-sm text-white/60">
          Playing: {notes.slice(-5).join(' → ')}
        </div>
      )}
      
      <button onClick={() => setNotes([])} className="btn-glass w-full mt-2">
        Clear
      </button>
    </div>
  );
}