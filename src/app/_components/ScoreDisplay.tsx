'use client';

import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="mx-auto mb-6 w-fit rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <div className="text-sm text-neutral-300">Score</div>
        <div className="text-lg font-semibold">{score}</div>
      </div>
    </div>
  );
} 