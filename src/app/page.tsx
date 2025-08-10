'use client';

import ShowHeader from './_components/ShowHeader';
import GameBoard from './_components/GameBoard';
import ConfettiEffect from './_components/ConfettiEffect';
import { useGameStore } from './_stores/gameStore';

export default function Home() {
  const { showConfetti, showStarburst } = useGameStore();

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 md:p-8">
      <ConfettiEffect trigger={showConfetti} type="confetti" />
      <ConfettiEffect trigger={showStarburst} type="starburst" />
      <div className="w-full max-w-5xl space-y-6 rounded-3xl bg-white/30 p-6 shadow-xl backdrop-blur-lg md:space-y-10 md:p-12">
        <ShowHeader />
        <GameBoard />
      </div>
    </main>
  );
}
