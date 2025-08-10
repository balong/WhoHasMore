'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage =
    questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <header className="flex w-full items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Who Has More?</h1>
      {gameState !== 'idle' && (
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-xs uppercase text-gray-500">Score</p>
            <p className="text-lg md:text-xl font-semibold text-blue-600">{score}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-500">Accuracy</p>
            <p className="text-lg md:text-xl font-semibold text-purple-600">{accuracyPercentage}%</p>
          </div>
        </div>
      )}
    </header>
  );
}