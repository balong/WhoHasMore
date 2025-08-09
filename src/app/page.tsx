'use client';

import GameBoard from './_components/GameBoard';
import ShowHeader from './_components/ShowHeader';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto px-3 py-3 space-y-3 md:px-4 md:py-4 md:space-y-4">
          <div className="slide-up">
            <ShowHeader />
          </div>
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <GameBoard />
          </div>
        </div>
      </div>
      
      {/* Floating background elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl floating" style={{ animationDelay: '0s' }} />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl floating" style={{ animationDelay: '4s' }} />
    </main>
  );
}
