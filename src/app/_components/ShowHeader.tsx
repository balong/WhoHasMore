'use client';

import { useGameStore } from '../_stores/gameStore';
import { motion } from 'framer-motion';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Main Title */}
        <div className="text-center space-y-4">
          <h1 className="text-display-lg text-primary font-bold leading-tight">
            Who Has More?
          </h1>
        </div>

        {/* Score Display - Only show when game is active */}
        {gameState !== 'idle' && (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="progress-track">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-caption text-muted uppercase tracking-wider font-medium mb-1">
                    Score
                  </div>
                  <div className="text-heading font-bold text-accent text-mono">
                    {score}/{questionsAnswered}
                  </div>
                </div>
                <div className="w-px h-8 bg-glass-border"></div>
                <div className="text-center">
                  <div className="text-caption text-muted uppercase tracking-wider font-medium mb-1">
                    Accuracy
                  </div>
                  <div className="text-heading font-bold text-primary">
                    {accuracyPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 