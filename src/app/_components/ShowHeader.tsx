'use client';

import Logo from './Logo';
import { useGameStore } from '../_stores/gameStore';
import { Trophy, Target } from 'lucide-react';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage =
    questionsAnswered > 0 ? Math.round((score / answeredQuestions.size) * 100) : 0;

  return (
    <>
      {gameState !== 'idle' && (
        <div className="stats-bar">
          <div className="stat-box">
            <Trophy className="stat-icon text-arcade-blue" />
            <div className="stat-content">
              <span className="stat-label">Score</span>
              <span className="stat-value text-arcade-blue">{score}</span>
            </div>
          </div>
          <div className="stat-box">
            <Target className="stat-icon text-arcade-purple" />
            <div className="stat-content">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value text-arcade-purple">{accuracyPercentage}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full text-center">
        <Logo />
        {gameState !== 'idle' && (
          <div className="stats-bar-mobile">
            <div className="stat-box">
              <Trophy className="stat-icon text-arcade-blue" />
              <div className="stat-content">
                <span className="stat-label">Score</span>
                <span className="stat-value text-arcade-blue">{score}</span>
              </div>
            </div>
            <div className="stat-box">
              <Target className="stat-icon text-arcade-purple" />
              <div className="stat-content">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value text-arcade-purple">{accuracyPercentage}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
