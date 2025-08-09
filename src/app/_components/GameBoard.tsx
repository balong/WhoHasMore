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
          className="card-elevated p-12 pb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center space-y-10">
            
            {/* Simplified Hero Text */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-heading text-secondary leading-relaxed max-w-lg mx-auto">
                Choose which place has more. Test your intuition against real data.
              </p>
            </motion.div>
            
            {/* Compact Category Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                  className="group relative overflow-hidden rounded-xl bg-surface-card border border-glass-border backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.5 + (index * 0.06),
                    type: "spring",
                    stiffness: 120,
                    damping: 14
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -2
                  }}
                >
                  <div className="p-4 text-center">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                      {category.icon}
                    </div>
                    <div className="text-caption text-primary font-semibold tracking-wide">
                      {category.label}
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
        {/* Start button separated from card box */}
        <div className="flex justify-center mt-8">
          <StartButton />
        </div>
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