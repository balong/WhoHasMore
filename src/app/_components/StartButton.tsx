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
      className="btn btn-primary text-body-lg px-8 py-4 focus-ring"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Play className="h-5 w-5" />
      <span className="font-semibold">Start Game</span>
    </motion.button>
  );
} 