'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / answeredQuestions.size) * 100) : 0;

  return (
    <>
      {/* Desktop Score Display - Top Right */}
      {gameState !== 'idle' && (
        <div className="score-container-separated">
          <div className="score-item">
            <span className="text-caption">SCORE</span>
            <span className="text-heading-xl text-sky-400">{score}</span>
          </div>
          <div className="score-item">
            <span className="text-caption">ACCURACY</span>
            <span className="text-heading-xl text-violet-400">{accuracyPercentage}%</span>
          </div>
        </div>
      )}

      {/* Main Title with inline score info for mobile */}
      <div className="w-full">
        <div className="text-center">
          <h1 className="logo-text">
            Who Has More?
          </h1>
          
          {/* Inline score display for mobile only */}
          {gameState !== 'idle' && (
            <div className="mobile-score-display">
              <div className="score-inline">
                <span className="score-label">Score:</span>
                <span className="score-value text-sky-400">{score}</span>
              </div>
              <div className="score-inline">
                <span className="score-label">Accuracy:</span>
                <span className="score-value text-violet-400">{accuracyPercentage}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 