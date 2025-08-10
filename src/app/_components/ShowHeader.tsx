'use client';

import Image from 'next/image';
import { Trophy, Target } from 'lucide-react';
import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / answeredQuestions.size) * 100) : 0;

  return (
    <>
      {/* Desktop stats */}
      {gameState !== 'idle' && (
        <div className="stats-floating">
          <div className="stat-box">
            <Trophy className="stat-icon text-arcade-blue" />
            <div>
              <div className="stat-label">Score</div>
              <div className="stat-value">{score}</div>
            </div>
          </div>
          <div className="stat-box">
            <Target className="stat-icon text-arcade-purple" />
            <div>
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">{accuracyPercentage}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src="/logo.svg" alt="" width={40} height={40} />
            <h1 className="logo-text">Who Has More?</h1>
          </div>

          {gameState !== 'idle' && (
            <div className="stats-inline md:hidden">
              <div className="stat-box">
                <Trophy className="stat-icon text-arcade-blue" />
                <div>
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{score}</div>
                </div>
              </div>
              <div className="stat-box">
                <Target className="stat-icon text-arcade-purple" />
                <div>
                  <div className="stat-label">Accuracy</div>
                  <div className="stat-value">{accuracyPercentage}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}