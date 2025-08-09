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
      <div className="w-full max-w-2xl mx-auto">
        <div className="nintendo-card text-center">
          <div className="space-y-6"> {/* Reduced from space-y-8 */}
            <p className="text-heading text-secondary">
              Choose which place has more. Test your intuition against real data.
            </p>
            <div>
              <StartButton />
            </div>
          </div>
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
            style={{ marginTop: '1rem' }} // Reduced from 1.5rem
          >
            <motion.button
              onClick={nextQuestion}
              className="nintendo-btn nintendo-btn-secondary focus-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-semibold">Next Question</span>
              <span className="text-xl">→</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 