'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';

export default function StartButton() {
  const startGame = useGameStore(state => state.startGame);

  return (
    <motion.button
      onClick={startGame}
      className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none"
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