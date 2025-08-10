'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ProgressIndicator from './_components/ProgressIndicator';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="min-h-screen relative">
      <ProgressIndicator />
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="px-6 py-8 space-y-8">
        <ShowHeader />
        <GameBoard />
      </div>
    </main>
  );
}
