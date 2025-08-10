'use client';

import AppLogo from './AppLogo';
import { Trophy, Target } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();
  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage =
    questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <header className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3">
        <AppLogo />
        <h1 className="logo-text">Who Has More?</h1>
      </div>

      {gameState !== 'idle' && (
        <div className="stats-bar">
          <div className="stat-card">
            <Trophy className="stat-icon text-arcade-yellow" />
            <div>
              <div className="stat-label">Score</div>
              <div className="stat-value text-arcade-blue">{score}</div>
            </div>
          </div>
          <div className="stat-card">
            <Target className="stat-icon text-arcade-purple" />
            <div>
              <div className="stat-label">Accuracy</div>
              <div className="stat-value text-arcade-purple">{accuracyPercentage}%</div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
