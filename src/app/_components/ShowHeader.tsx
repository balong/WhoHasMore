'use client';

import { useGameStore } from '../_stores/gameStore';

export default function ShowHeader() {
  const { gameState, score, answeredQuestions } = useGameStore();

  const questionsAnswered = answeredQuestions.size;
  const accuracyPercentage = questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="text-center space-y-10">
        {/* Title Section */}
        <div className="space-y-6">
          <h1 className="game-show-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl floating px-4">
            Who Has More?
          </h1>
          
          <div className="space-y-4 max-w-2xl mx-auto px-4">
            <p className="text-lg sm:text-xl text-secondary leading-relaxed font-medium">
              Test your knowledge of cities, states, and countries across different metrics.
            </p>
            <p className="text-base text-muted leading-relaxed">
              Each question presents two options — choose which one has 
              <span className="gradient-text font-semibold mx-1">more</span>
              of the given metric.
            </p>
          </div>
        </div>

        {/* Score Display - Only show when game is active */}
        {gameState !== 'idle' && (
          <div className="flex justify-center px-4">
            <div className="card-elevated rounded-xl px-8 py-5 scale-in">
              <div className="flex items-center gap-10">
                <div className="text-center">
                  <div className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">Score</div>
                  <div className="text-2xl font-black gradient-text text-mono">
                    {score}/{questionsAnswered}
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">Accuracy</div>
                  <div className="text-2xl font-black text-primary">
                    {accuracyPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 