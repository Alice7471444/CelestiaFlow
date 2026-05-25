import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Minimum display time
    const timeout = setTimeout(() => {
      if (progress >= 100) {
        setTimeout(() => setIsLoading(false), 300);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        >
          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                  <motion.span
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="text-4xl"
                  >
                    ✨
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
            >
              CelestiaFlow
            </motion.h1>

            {/* Loading Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-48 h-1 bg-white/10 rounded-full mx-auto mt-8 overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(139, 92, 246, 0.5)',
                    '0 0 20px rgba(139, 92, 246, 0.8)',
                    '0 0 10px rgba(139, 92, 246, 0.5)',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-sm mt-4"
            >
              Loading liquid experience... {Math.min(Math.round(progress), 100)}%
            </motion.p>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                  }}
                  animate={{
                    y: [null, Math.random() * -200 - 100],
                    opacity: [0.3, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}