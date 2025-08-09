'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';
import QuestionCard from './QuestionCard';
import StartButton from './StartButton';
import GameOverModal from './GameOverModal';

export default function GameBoard() {
  const {
    gameState,
    currentQuestion,
    currentQuestionIndex,
    submitAnswer,
    nextQuestion,
  } = useGameStore();

  if (gameState === 'idle') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <motion.div 
          className="card-elevated p-16 pb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center space-y-12">
            
            {/* Hero Icon */}
            <motion.div 
              className="w-32 h-32 bg-gradient-to-br from-accent-primary via-accent-secondary to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="text-6xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
              >
                🎯
              </motion.span>
            </motion.div>
            
            {/* Simplified Hero Text */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-display text-primary font-bold leading-tight">
                Ready to Play?
              </h2>
              <p className="text-body-lg text-secondary leading-relaxed max-w-lg mx-auto">
                Choose which place has more. Test your intuition against real data.
              </p>
            </motion.div>
            
            {/* Enhanced Category Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                { icon: '👥', label: 'Population', color: 'from-blue-500 to-cyan-400' },
                { icon: '🚨', label: 'Crime Stats', color: 'from-red-500 to-orange-400' },
                { icon: '🌲', label: 'Environment', color: 'from-green-500 to-emerald-400' },
                { icon: '🏠', label: 'Housing', color: 'from-purple-500 to-pink-400' },
                { icon: '💰', label: 'Economics', color: 'from-yellow-500 to-amber-400' },
                { icon: '🎓', label: 'Education', color: 'from-indigo-500 to-blue-400' }
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br border border-glass-border backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, rgba(var(--surface-card-rgb), 0.8), rgba(var(--surface-card-rgb), 0.6))`
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8 + (index * 0.1),
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <div className="p-4 text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {category.icon}
                    </div>
                    <div className="text-caption text-primary font-medium tracking-wide">
                      {category.label}
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Premium Call-to-Action */}
            <motion.div 
              className="pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <StartButton />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return <GameOverModal />;
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full mx-auto px-6">
      <div className="space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard question={currentQuestion} onAnswer={submitAnswer} />
          </motion.div>
        </AnimatePresence>

        {gameState === 'answered' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
            style={{ marginTop: '3rem' }}
          >
            <button
              onClick={nextQuestion}
              className="btn btn-primary text-body-lg px-8 py-4 focus-ring"
            >
              <span className="font-semibold">Next Question</span>
              <span className="text-xl">→</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 