"use client";

import { useGameStore } from '../_stores/gameStore';

export default function ProgressDots() {
  const { currentQuestionIndex, gameState } = useGameStore();

  if (gameState === 'idle') return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center">
        <div className="progress-track">
          <div className="text-center">
            <div className="text-caption text-muted uppercase tracking-wider font-medium mb-1">
              Question
            </div>
            <div className="text-heading font-bold text-accent text-mono">
              #{currentQuestionIndex + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 