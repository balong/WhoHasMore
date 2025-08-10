'use client';

import { MapPin, ArrowLeftRight } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center">
        <MapPin className="h-6 w-6 text-arcade-blue" />
        <ArrowLeftRight className="h-4 w-4 mx-1 text-white" />
        <MapPin className="h-6 w-6 text-arcade-purple" />
      </div>
      <h1 className="logo-text">Who Has More?</h1>
    </div>
  );
}
