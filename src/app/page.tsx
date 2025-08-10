'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <ShowHeader />
      <div className="flex-1 flex items-center justify-center px-4 md:px-6">
        <GameBoard />
      </div>
    </main>
  );
}
