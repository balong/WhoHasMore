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
          className="relative p-[2px] rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,.4), rgba(139,92,246,.4))' }}
        >
          <div className="card-elevated rounded-2xl p-10">
            <div className="text-center space-y-8">
              <motion.p 
                className="text-heading text-secondary max-w-xl mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Choose which place has more. Test your intuition against real data.
              </motion.p>

              {/* Dramatic Category Chips */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { icon: '👥', label: 'Population' },
                  { icon: '🚨', label: 'Crime Stats' },
                  { icon: '🌲', label: 'Environment' },
                  { icon: '🏠', label: 'Housing' },
                  { icon: '💰', label: 'Economics' },
                  { icon: '🎓', label: 'Education' }
                ].map((c, i) => (
                  <motion.div
                    key={c.label}
                    className="px-4 py-2 rounded-full border border-glass-border bg-surface/60 backdrop-blur-md shadow hover:shadow-lg text-caption text-primary flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="font-semibold tracking-wide">{c.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Glowing Start button below panel */}
        <div className="flex justify-center mt-10">
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