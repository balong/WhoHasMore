'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function StartButton() {
  const { startGame } = useGameStore();
  
  const handleStart = () => {
    startGame();
  };

  return (
    <motion.button
      onClick={handleStart}
      className="nintendo-btn nintendo-btn-primary"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Play className="h-6 w-6" />
      <span>Start Game</span>
    </motion.button>
  );
} 