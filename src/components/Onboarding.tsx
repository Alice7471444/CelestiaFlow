import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

const steps = [
  {
    title: 'Welcome to CelestiaFlow',
    description: 'Your immersive liquid glass experience awaits',
    icon: '✨',
  },
  {
    title: 'Interact with Liquid',
    description: 'Click and drag to swirl, tap for ripples and splashes',
    icon: '💧',
  },
  {
    title: 'Customize Everything',
    description: 'Change liquid types, colors, and physics parameters',
    icon: '🎨',
  },
  {
    title: 'Relax & Create',
    description: 'Use ambient sounds, widgets, and mini-games',
    icon: '🧘',
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(
    localStorage.getItem('celestiaflow-onboarding-complete') === 'true'
  );
  const { toggleSettings, toggleWidgets } = useStore();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('celestiaflow-onboarding-complete', 'true');
      setIsComplete(true);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('celestiaflow-onboarding-complete', 'true');
    setIsComplete(true);
  };

  const handleExplore = (action: () => void) => {
    localStorage.setItem('celestiaflow-onboarding-complete', 'true');
    setIsComplete(true);
    action();
  };

  if (isComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="liquid-glass p-8 max-w-md w-full text-center"
        >
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i <= currentStep ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <motion.div
            key={currentStep}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-6xl mb-6"
          >
            {steps[currentStep].icon}
          </motion.div>

          {/* Content */}
          <motion.div
            key={`title-${currentStep}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-3">{steps[currentStep].title}</h2>
            <p className="text-white/60 mb-8">{steps[currentStep].description}</p>
          </motion.div>

          {/* Actions */}
          <div className="space-y-3">
            {currentStep === steps.length - 1 ? (
              <>
                <button
                  onClick={() => handleExplore(toggleSettings)}
                  className="btn-glass-primary w-full py-3"
                >
                  🎨 Start Customizing
                </button>
                <button
                  onClick={() => handleExplore(toggleWidgets)}
                  className="btn-glass w-full py-3"
                >
                  📊 Explore Widgets
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleNext}
                  className="btn-glass-primary w-full py-3"
                >
                  Continue →
                </button>
                <button
                  onClick={handleSkip}
                  className="text-sm text-white/40 hover:text-white/60"
                >
                  Skip tutorial
                </button>
              </>
            )}
          </div>

          {/* Keyboard Hint */}
          <p className="text-xs text-white/30 mt-6">
            Press Space or Enter to continue
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}