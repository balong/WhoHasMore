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
        } catch {
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
          <div className="card p-8 mb-6">
            <div className="text-6xl font-bold text-mono mb-2 text-center">
              <span className="gradient-accent">{score}</span>
              <span className="text-muted text-3xl">/{questionsAnswered}</span>
            </div>
            <div className="text-center text-secondary mb-4 text-body">Questions Correct</div>
            <div className="w-full bg-primary-700 rounded-lg h-3 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-accent-primary to-accent-secondary h-3 rounded-lg"
              />
            </div>
            <div className={`text-center text-heading font-bold ${color}`}>
              {percentage}% Accuracy
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Trophy className="h-5 w-5 text-success" />
                <span className="text-secondary text-body">Correct</span>
              </div>
              <div className="text-heading font-bold text-success">{score}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Target className="h-5 w-5 text-error" />
                <span className="text-secondary text-body">Missed</span>
              </div>
              <div className="text-heading font-bold text-error">{questionsAnswered - score}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={resetGame}
            className="btn btn-primary w-full text-body-lg py-4 focus-ring"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="font-semibold">Play Again</span>
          </button>
          <button
            onClick={handleShare}
            className="btn btn-secondary w-full text-body py-3 focus-ring"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Results</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 