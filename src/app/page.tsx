'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="h-screen relative flex flex-col overflow-hidden">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="flex flex-col flex-1 px-4 py-4 md:px-6 md:py-6">
        <ShowHeader />
        <div className="flex-1 flex items-center justify-center">
          <GameBoard />
        </div>
      </div>
    </main>
  );
}
