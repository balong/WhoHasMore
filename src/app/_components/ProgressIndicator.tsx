'use client';

import { useGameStore } from '../_stores/gameStore';
import { motion } from 'framer-motion';

export default function ProgressIndicator() {
  const { gameState, answeredQuestions } = useGameStore();

  if (gameState === 'idle') return null;

  const totalQuestions = 10; // We'll show progress out of 10 questions
  const currentQuestion = answeredQuestions.size + (gameState === 'playing' || gameState === 'answered' ? 1 : 0);
  const progress = Math.min((answeredQuestions.size / totalQuestions) * 100, 100);

  return (
    <>
      {/* Progress Bar - Top of screen */}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Question Counter - Top left */}
      <div className="progress-indicator">
        Q {Math.min(currentQuestion, totalQuestions)}/{totalQuestions}
      </div>
    </>
  );
} 