'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <div className="w-full">
      {/* Main Title with inline score info for mobile */}
      <div className="text-center">
        <h1 className="logo-text">
          Who Has More?
        </h1>
        
        {/* Inline score display for mobile */}
        {gameState !== 'idle' && (
          <div className="mobile-score-display">
            <div className="score-inline">
              <span className="score-label">Score:</span>
              <span className="score-value score-blue">{score}</span>
            </div>
            <div className="score-inline">
              <span className="score-label">Accuracy:</span>
              <span className="score-value score-purple">{accuracyPercentage}%</span>
            </div>
            <div className="score-inline">
              <span className="score-label">Questions:</span>
              <span className="score-value score-text">{questionsAnswered}/10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 