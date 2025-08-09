'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Share2 } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function GameOverModal() {
  const { score, answeredQuestions, resetGame } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const percentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  const handleShare = async () => {
    const shareText = `I scored ${score}/${questionsAnswered} (${percentage}%) on Who Has More! Can you beat my score? 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Who Has More? - Quiz Results',
          text: shareText,
          url: window.location.href,
        });
      } catch (_err) {
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
        className="w-full max-w-md"
      >
        <div className="nintendo-card text-center">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-heading font-bold text-primary mb-2">
                🎮 Game Complete!
              </h2>
              <p className="text-body text-secondary">
                Great job! Here's how you performed:
              </p>
            </div>

            {/* Final Stats - Nintendo Style */}
            <div className="flex justify-center">
              <div className="nintendo-stats">
                <div className="nintendo-stat-item">
                  <span className="nintendo-stat-number">{score}</span>
                  <span className="nintendo-stat-label">Final Score</span>
                </div>
                <div className="w-px h-6 bg-nintendo-border opacity-50"></div>
                <div className="nintendo-stat-item">
                  <span className="nintendo-stat-number">{percentage}%</span>
                  <span className="nintendo-stat-label">Accuracy</span>
                </div>
                <div className="w-px h-6 bg-nintendo-border opacity-50"></div>
                <div className="nintendo-stat-item">
                  <span className="nintendo-stat-number">{questionsAnswered}</span>
                  <span className="nintendo-stat-label">Questions</span>
                </div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="text-center">
              <p className="text-body text-secondary">
                {percentage >= 80 ? "🌟 Excellent work!" : 
                 percentage >= 60 ? "👍 Well done!" : 
                 "💪 Keep practicing!"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetGame}
                className="nintendo-btn nintendo-btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="nintendo-btn nintendo-btn-secondary flex items-center justify-center gap-2 px-4"
              >
                <Share2 className="h-4 w-4" />
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 