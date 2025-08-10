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
          <h1 className="logo-text">
            Who Has More?
          </h1>
        </div>

        {/* Score Display */}
        {gameState !== 'idle' && (
          <div className="flex justify-center">
            <div className="score-container">
              <div className="flex gap-12 md:gap-16">
                <div className="score-stat">
                  <span className="score-label">Score</span>
                  <span className="score-value">{score}</span>
                </div>
                <div className="score-stat">
                  <span className="score-label">Accuracy</span>
                  <div className="flex flex-col items-center">
                    <span className="score-value">{accuracyPercentage}%</span>
                    <span className="score-percentage">
                      {answeredQuestions.size} answered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 