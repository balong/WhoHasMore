"use client";

import { useGameStore } from '../_stores/gameStore';

export default function ProgressDots() {
  const { currentQuestionIndex, gameState } = useGameStore();

  if (gameState === 'idle') return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="flex justify-center">
        <div className="card-elevated rounded-full px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-muted font-medium uppercase tracking-wider mb-1">
                Question
              </div>
              <div className="text-lg font-bold text-primary text-mono">
                #{currentQuestionIndex + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 