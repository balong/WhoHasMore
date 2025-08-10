'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <ShowHeader />
      <div className="w-full mt-8">
        <GameBoard />
      </div>
    </main>
  );
}
