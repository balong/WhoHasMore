'use client';

import { useGameStore } from '../_stores/gameStore';
import LogoIcon from './LogoIcon';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / answeredQuestions.size) * 100) : 0;

  return (
    <>
      {/* Desktop Score Display */}
      {gameState !== 'idle' && (
        <div className="score-board">
          <div className="score-segment">
            <span className="score-icon">★</span>
            <span className="score-number">{score}</span>
          </div>
          <div className="score-divider" />
          <div className="score-segment">
            <span className="score-icon">🎯</span>
            <span className="score-number">{accuracyPercentage}%</span>
          </div>
        </div>
      )}

      {/* Logo and mobile score display */}
      <div className="w-full">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <LogoIcon className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="logo-text">Who Has More?</h1>
          </div>

          {gameState !== 'idle' && (
            <div className="score-board-mobile">
              <div className="score-segment">
                <span className="score-icon">★</span>
                <span className="score-number">{score}</span>
              </div>
              <div className="score-segment">
                <span className="score-icon">🎯</span>
                <span className="score-number">{accuracyPercentage}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}