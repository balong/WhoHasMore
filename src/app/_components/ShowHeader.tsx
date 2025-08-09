'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const score = useGameStore(state => state.score);
  const answeredQuestions = useGameStore(state => state.answeredQuestions);

  const accuracy = answeredQuestions.size > 0 
    ? Math.round((score / answeredQuestions.size) * 100) 
    : 0;

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Main Title */}
        <div className="text-center space-y-4">
          <h1 className="nintendo-logo font-bold leading-tight">
            Who Has More?
          </h1>
        </div>

        {/* Stats Display */}
        {answeredQuestions.size > 0 && (
          <div className="flex justify-center">
            <div className="nintendo-stats">
              <div className="nintendo-stat-item">
                <span className="nintendo-stat-number">{score}</span>
                <span className="nintendo-stat-label">Score</span>
              </div>
              <div className="w-px h-6 bg-nintendo-border opacity-50"></div>
              <div className="nintendo-stat-item">
                <span className="nintendo-stat-number">{accuracy}%</span>
                <span className="nintendo-stat-label">Accuracy</span>
              </div>
              <div className="w-px h-6 bg-nintendo-border opacity-50"></div>
              <div className="nintendo-stat-item">
                <span className="nintendo-stat-number">{answeredQuestions.size}</span>
                <span className="nintendo-stat-label">Played</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 