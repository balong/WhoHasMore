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
      className="group relative overflow-hidden bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-body-lg font-bold px-12 py-5 rounded-2xl shadow-lg border-0 focus-ring"
      whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-3 relative z-10">
        <Play className="h-6 w-6" />
        <span>Start Game</span>
      </div>
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
} 