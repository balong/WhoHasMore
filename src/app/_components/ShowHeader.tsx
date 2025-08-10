'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage =
    questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <header className="flex flex-col items-center space-y-4">
      <h1 className="logo-text text-center">Who Has More?</h1>
      {gameState !== 'idle' && (
        <div className="flex gap-8">
          <div className="text-center">
            <span className="text-caption block">SCORE</span>
            <span className="text-heading-xl text-nintendo-blue">{score}</span>
          </div>
          <div className="text-center">
            <span className="text-caption block">ACCURACY</span>
            <span className="text-heading-xl text-nintendo-purple">{accuracyPercentage}%</span>
          </div>
        </div>
      )}
    </header>
  );
}
