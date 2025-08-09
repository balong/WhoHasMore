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
      className="group relative overflow-hidden bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-heading font-bold px-16 py-6 rounded-3xl shadow-xl border-0 focus-ring"
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
        y: -2
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-4 relative z-10">
        <Play className="h-7 w-7" />
        <span className="tracking-wide">Start Game</span>
      </div>
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-700" />
    </motion.button>
  );
} 