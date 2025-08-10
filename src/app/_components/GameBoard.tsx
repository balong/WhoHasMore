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
      <div className="h-full w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">Test Your Knowledge</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
              Compare facts across cities and states. Can you guess which location has more?
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs md:text-sm text-gray-700">
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>👥</span>
              <span>Population</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>🚔</span>
              <span>Crime</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>💰</span>
              <span>Economics</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>🏠</span>
              <span>Housing</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>📚</span>
              <span>Education</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>🏥</span>
              <span>Health</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>🚗</span>
              <span>Transport</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md shadow">
              <span>🎨</span>
              <span>Culture</span>
            </div>
          </div>
          <StartButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 md:space-y-6">
      <QuestionCard />

      {gameState === 'answered' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 30 }}
          className="flex justify-center"
        >
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none"
          >
            Next Question
          </button>
        </motion.div>
      )}
    </div>
  );
}