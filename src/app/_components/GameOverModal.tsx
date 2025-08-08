'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, RotateCcw, Share2 } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function GameOverModal() {
  const { score, answeredQuestions, resetGame } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const percentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;
  
  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Incredible! You're a geography genius!", emoji: "🎉", color: "text-yellow-400" };
    if (percentage >= 80) return { message: "Excellent work! Outstanding knowledge!", emoji: "⭐", color: "text-emerald-400" };
    if (percentage >= 70) return { message: "Great job! Solid performance!", emoji: "🎯", color: "text-blue-400" };
    if (percentage >= 60) return { message: "Good effort! Keep learning!", emoji: "👍", color: "text-purple-400" };
    return { message: "Practice makes perfect! Try again!", emoji: "💪", color: "text-orange-400" };
  };

  const { message, emoji, color } = getScoreMessage();

  const handleShare = async () => {
    const shareText = `I scored ${score}/${questionsAnswered} (${percentage}%) on Who Has More! Can you beat my score? 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Who Has More? - Quiz Results',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="glass-card w-full max-w-md rounded-3xl p-8 text-center"
      >
        {/* Celebration Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl floating">
            {emoji}
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Game Complete!</h2>
          <p className={`text-lg font-medium ${color}`}>{message}</p>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <div className="glass-card rounded-2xl p-6 mb-4">
            <div className="text-6xl font-bold gradient-text text-mono mb-2">
              {score}<span className="text-3xl text-slate-400">/{questionsAnswered}</span>
            </div>
            <div className="text-slate-300 mb-3">Questions Correct</div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              />
            </div>
            <div className={`text-2xl font-bold ${color}`}>
              {percentage}% Accuracy
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 justify-center">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300">Correct</span>
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{score}</div>
            </div>
            <div className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-2 justify-center">
                <Target className="h-4 w-4 text-red-400" />
                <span className="text-slate-300">Missed</span>
              </div>
              <div className="text-xl font-bold text-red-400 mt-1">{questionsAnswered - score}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="glass-button group w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            <div className="flex items-center justify-center gap-3">
              <RotateCcw className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="gradient-text font-bold">Play Again</span>
            </div>
          </button>
          
          <button
            onClick={handleShare}
            className="glass-button group w-full rounded-2xl px-6 py-3 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="text-slate-300">Share Results</span>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 