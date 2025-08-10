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
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="nintendo-card text-center space-y-6 md:space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-display-lg md:text-display-hero text-white font-bold leading-tight">
              Test Your Knowledge
            </h2>
            <p className="text-body md:text-body-lg text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Compare facts across cities and states. Can you guess which location has more?
            </p>
          </div>
          
          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 md:py-8 mb-8">
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
          <div>
            <StartButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
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