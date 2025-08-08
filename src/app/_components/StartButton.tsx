'use client';

import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function StartButton() {
  const { gameState, startGame, resetGame } = useGameStore();

  const isIdle = gameState === 'idle';
  const isGameOver = gameState === 'gameOver';

  const handleClick = () => {
    if (isGameOver) {
      resetGame();
    } else {
      startGame();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="glass-button group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative z-10 flex items-center gap-3">
        {isGameOver ? (
          <>
            <RotateCcw className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="gradient-text font-bold">Play Again</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            <span className="gradient-text font-bold">Start Game</span>
          </>
        )}
      </div>
      
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.button>
  );
} 