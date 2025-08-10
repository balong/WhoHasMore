'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';

export default function StartButton() {
  const startGame = useGameStore(state => state.startGame);

  return (
    <motion.button
      onClick={startGame}
      className="arcade-btn arcade-btn-primary text-xl px-12 py-4"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
    >
      Start Playing
    </motion.button>
  );
} 