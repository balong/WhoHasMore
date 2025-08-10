'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <>
      {/* Separated Score Display - Top Right */}
      {gameState !== 'idle' && (
        <div className="score-container-separated">
          <div className="score-item">
            <span className="text-caption">SCORE</span>
            <span className="text-heading-xl text-nintendo-blue">{score}</span>
          </div>
          <div className="score-item">
            <span className="text-caption">ACCURACY</span>
            <span className="text-heading-xl text-nintendo-purple">{accuracyPercentage}%</span>
            <span className="text-caption">{answeredQuestions.size} answered</span>
          </div>
        </div>
      )}

      {/* Main Title - Centered */}
      <div className="w-full">
        <div className="text-center">
          <h1 className="logo-text">
            Who Has More?
          </h1>
        </div>
      </div>
    </>
  );
} 