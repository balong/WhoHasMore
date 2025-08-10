'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="h-screen relative overflow-hidden flex flex-col">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-8 space-y-4 md:space-y-8">
        <ShowHeader />
        <GameBoard />
      </div>
    </main>
  );
}
