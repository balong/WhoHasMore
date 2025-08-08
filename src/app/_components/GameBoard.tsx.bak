'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';
import QuestionCard from './QuestionCard';
import StartButton from './StartButton';
import GameOverModal from './GameOverModal';
import ProgressDots from './ProgressDots';

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
      <div className="w-full max-w-2xl mx-auto">
        <motion.div 
          className="card-elevated p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center space-y-8">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full mx-auto flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-4xl">🎯</span>
            </motion.div>
            
            <div className="space-y-4">
              <h3 className="text-heading-lg text-primary font-bold">
                Ready to Test Your Knowledge?
              </h3>
              <p className="text-body text-secondary leading-relaxed max-w-md mx-auto">
                Compare cities, states, and countries across different metrics. Each question presents two options — choose which one has more.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: '👥', label: 'Population' },
                { icon: '🚨', label: 'Crime Rates' },
                { icon: '🌲', label: 'National Parks' },
                { icon: '🏠', label: 'Housing' },
                { icon: '🌬️', label: 'Air Quality' },
                { icon: '💰', label: 'Economics' }
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-surface border border-glass-border"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-caption text-muted font-medium">{category.label}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="pt-4">
              <StartButton />
            </div>
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
      <div className="space-y-16">
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