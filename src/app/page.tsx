'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="min-h-screen relative">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="px-4 py-4 space-y-4 md:px-6 md:py-8 md:space-y-8">
        <ShowHeader />
        <GameBoard />
      </div>
    </main>
  );
}
