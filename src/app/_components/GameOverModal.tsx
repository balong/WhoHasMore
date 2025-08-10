'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, RotateCcw, Share2 } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function GameOverModal() {
  const { score, answeredQuestions, resetGame } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const percentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Incredible! You're a geography genius!", emoji: "🎉", color: "text-yellow-500" };
    if (percentage >= 80) return { message: "Excellent work! Outstanding knowledge!", emoji: "⭐", color: "text-green-500" };
    if (percentage >= 70) return { message: "Great job! Solid performance!", emoji: "🎯", color: "text-blue-500" };
    if (percentage >= 60) return { message: "Good effort! Keep learning!", emoji: "👍", color: "text-purple-500" };
    return { message: "Practice makes perfect! Try again!", emoji: "💪", color: "text-orange-500" };
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
        await navigator.clipboard.writeText(shareText);
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            {emoji}
          </div>
          <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
          <p className={`text-lg font-medium ${color}`}>{message}</p>
        </div>

        <div className="mb-8">
          <div className="mb-6">
            <div className="text-6xl font-bold mb-2">
              <span className="text-blue-600">{score}</span>
              <span className="text-3xl text-gray-500">/{questionsAnswered}</span>
            </div>
            <div className="text-gray-600 mb-4">Questions Correct</div>
            <div className="w-full bg-gray-200 rounded h-3 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-3 rounded bg-blue-500"
              />
            </div>
            <div className={`font-bold ${color}`}>{percentage}% Accuracy</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">Correct</span>
              </div>
              <div className="text-xl font-bold text-green-600">{score}</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Target className="h-5 w-5 text-red-600" />
                <span className="text-gray-600">Missed</span>
              </div>
              <div className="text-xl font-bold text-red-600">{questionsAnswered - score}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={resetGame}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Play Again</span>
          </button>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Results</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
