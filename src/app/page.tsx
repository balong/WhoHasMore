'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="w-full h-full flex flex-col items-center justify-center px-4 py-4 md:px-6 md:py-8 space-y-6">
        <ShowHeader />
        <GameBoard />
      </div>
    </main>
  );
}
