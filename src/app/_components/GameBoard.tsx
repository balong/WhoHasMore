'use client';

import { useGameStore } from '../_stores/gameStore';
import { motion } from 'framer-motion';
import QuestionCard from './QuestionCard';
import GameOverModal from './GameOverModal';
import StartButton from './StartButton';

export default function GameBoard() {
  const { gameState, nextQuestion } = useGameStore();

  const handleNextQuestion = () => {
    nextQuestion();
  };

  if (gameState === 'gameOver') {
    return <GameOverModal />;
  }

  if (gameState === 'idle') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 space-y-10">
        {/* Intro Copy */}
        <div className="text-center space-y-3 md:space-y-4 lg:space-y-6">
          <h2 className="text-display-lg md:text-display-hero text-white font-bold leading-tight">
            Who Comes Out on Top?
          </h2>
          <p className="text-body md:text-body-lg text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
            Guess which place wins in categories from population to culture.
          </p>
        </div>

        {/* Gameplay Preview */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="text-small text-center text-white/80">Example Round</div>
          <div className="answer-card pointer-events-none">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div className="letter-badge">A</div>
              <div className="flex-1 text-left">
                <div className="text-body-lg font-semibold text-nintendo-primary-text">New York</div>
              </div>
            </div>
          </div>
          <div className="answer-card pointer-events-none">
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div className="letter-badge">B</div>
              <div className="flex-1 text-left">
                <div className="text-body-lg font-semibold text-nintendo-primary-text">California</div>
              </div>
            </div>
          </div>
          <p className="text-small text-center text-white/80">Which has more people?</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 py-4 md:py-6 lg:py-8">
          <div className="category-chip">
            <span className="category-chip-icon">👥</span>
            <span>Population</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">🚔</span>
            <span>Crime</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">💰</span>
            <span>Economics</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">🏠</span>
            <span>Housing</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">📚</span>
            <span>Education</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">🏥</span>
            <span>Health</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">🚗</span>
            <span>Transport</span>
          </div>
          <div className="category-chip">
            <span className="category-chip-icon">🎨</span>
            <span>Culture</span>
          </div>
        </div>

        {/* Start Button Section */}
        <div className="text-center">
          <StartButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <QuestionCard />
    
      {gameState === 'answered' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 30 }}
          className="flex justify-center next-button-spacing"
        >
          <button
            onClick={handleNextQuestion}
            className="nintendo-btn nintendo-btn-primary"
          >
            Next Question
          </button>
        </motion.div>
      )}
    </div>
  );
} 