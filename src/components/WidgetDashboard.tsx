import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const widgetTypes = [
  { type: 'clock', icon: '🕐', name: 'Clock' },
  { type: 'weather', icon: '🌤️', name: 'Weather' },
  { type: 'todo', icon: '📝', name: 'To-Do' },
  { type: 'quote', icon: '💬', name: 'Quote' },
  { type: 'music', icon: '🎵', name: 'Music' },
  { type: 'stats', icon: '📊', name: 'Stats' },
];

const quotes = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "In the middle of difficulty lies opportunity. — Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
];

export default function WidgetDashboard() {
  const { widgets, addWidget, removeWidget, updateWidget, totalTimeSpent, creationsMade, achievements } = useStore();
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addNewWidget = (type: string) => {
    const id = `widget_${Date.now()}`;
    addWidget({
      id,
      type: type as any,
      position: { x: 100 + widgets.length * 50, y: 100 + widgets.length * 50 },
      size: { width: 250, height: 200 },
      visible: true,
    });
  };

  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 max-h-[60vh] overflow-y-auto"
    >
      <div className="liquid-glass p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Widgets</h3>
          <button
            onClick={() => useStore.getState().toggleWidgets()}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Add Widget Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {widgetTypes.map((wt) => (
            <button
              key={wt.type}
              onClick={() => addNewWidget(wt.type)}
              className="px-3 py-2 rounded-xl glass-card text-sm flex items-center gap-2 hover:bg-white/10"
            >
              <span>{wt.icon}</span>
              <span>{wt.name}</span>
            </button>
          ))}
        </div>

        {/* Widget Grid */}
        <div className="space-y-3">
          {widgets.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              Click a button above to add widgets
            </div>
          ) : (
            widgets.map((widget) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                onRemove={() => removeWidget(widget.id)}
                onUpdate={(updates) => updateWidget(widget.id, updates)}
                totalTimeSpent={totalTimeSpent}
                creationsMade={creationsMade}
                unlockedAchievements={unlockedAchievements}
                currentQuote={currentQuote}
              />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface WidgetCardProps {
  widget: any;
  onRemove: () => void;
  onUpdate: (updates: any) => void;
  totalTimeSpent: number;
  creationsMade: number;
  unlockedAchievements: number;
  currentQuote: string;
}

function WidgetCard({ widget, onRemove, totalTimeSpent, creationsMade, unlockedAchievements, currentQuote }: WidgetCardProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="glass-card p-4 relative group"
    >
      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>

      {/* Clock Widget */}
      {widget.type === 'clock' && (
        <div className="text-center">
          <div className="text-4xl font-bold">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}

      {/* Weather Widget (Mock) */}
      {widget.type === 'weather' && (
        <div className="text-center">
          <div className="text-4xl mb-2">☀️</div>
          <div className="text-3xl font-bold">22°C</div>
          <div className="text-sm text-white/60">Sunny</div>
        </div>
      )}

      {/* To-Do Widget */}
      {widget.type === 'todo' && (
        <div>
          <h4 className="font-semibold mb-2">To-Do</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-white/30" />
              <span>Try new liquid type</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded border border-white/30" />
              <span>Save favorite recipe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">✓</span>
              <span className="line-through text-white/40">Explore widgets</span>
            </div>
          </div>
        </div>
      )}

      {/* Quote Widget */}
      {widget.type === 'quote' && (
        <div>
          <div className="text-sm italic text-white/80">"{currentQuote}"</div>
        </div>
      )}

      {/* Music Widget (Mock) */}
      {widget.type === 'music' && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            🎵
          </div>
          <div className="flex-1">
            <div className="font-semibold">Chill Vibes</div>
            <div className="text-xs text-white/60">Lo-fi Study Mix</div>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            ▶
          </button>
        </div>
      )}

      {/* Stats Widget */}
      {widget.type === 'stats' && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="glass p-2 rounded-lg">
            <div className="text-xl font-bold">{formatTime(totalTimeSpent)}</div>
            <div className="text-xs text-white/60">Time</div>
          </div>
          <div className="glass p-2 rounded-lg">
            <div className="text-xl font-bold">{creationsMade}</div>
            <div className="text-xs text-white/60">Creates</div>
          </div>
          <div className="glass p-2 rounded-lg col-span-2">
            <div className="text-xl font-bold">{unlockedAchievements}/10</div>
            <div className="text-xs text-white/60">Achievements</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}