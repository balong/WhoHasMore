'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../_stores/gameStore';
import QuestionCard from './QuestionCard';
import StartButton from './StartButton';
import GameOverModal from './GameOverModal';
import ProgressDots from './ProgressDots';

export default function GameBoard() {
  const {
    gameState,
    currentQuestion,
    currentQuestionIndex,
    submitAnswer,
    nextQuestion,
  } = useGameStore();

  if (gameState === 'idle') {
    return (
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="card-elevated rounded-2xl p-10">
              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center floating">
                  <span className="text-4xl">🎯</span>
                </div>
                
                <div className="space-y-6 px-4">
                  <h3 className="text-2xl font-black gradient-text-bright heading-xl">
                    Ready to Test Your Knowledge?
                  </h3>
                  <p className="text-base text-secondary leading-relaxed">
                    Compare cities, states, and countries across different metrics. Each question presents two options — choose which one has more.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 text-xs px-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                    <span>👥</span>
                    <span className="text-muted">Population</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                    <span>🚨</span>
                    <span className="text-muted">Crime Rates</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                    <span>🌲</span>
                    <span className="text-muted">National Parks</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                    <span>🏠</span>
                    <span className="text-muted">Housing</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                    <span>🌬️</span>
                    <span className="text-muted">Air Quality</span>
                  </div>
                </div>
                
                <div className="pt-6">
                  <StartButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return <GameOverModal />;
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full mx-auto px-6">
      <div className="space-y-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard question={currentQuestion} onAnswer={submitAnswer} />
          </motion.div>
        </AnimatePresence>

        {gameState === 'answered' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={nextQuestion}
              className="glass-button group rounded-xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 interactive-glow"
            >
              <div className="flex items-center gap-4">
                <span className="gradient-text-bright">Next Question</span>
                <span className="text-secondary group-hover:translate-x-1 transition-transform text-xl">→</span>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 