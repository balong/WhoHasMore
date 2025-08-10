import React from 'react';

export default function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leftState" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="rightState" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="vsCircle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
      <path
        d="M5 4h12l3 8-3 14-10-3-2-11z"
        fill="url(#leftState)"
      />
      <path
        d="M43 8h12l2 8-2 8h-10l-4 4-2-6-4-4z"
        fill="url(#rightState)"
      />
      <circle cx="32" cy="16" r="8" fill="url(#vsCircle)" />
      <text
        x="32"
        y="16"
        textAnchor="middle"
        dy="0.35em"
        fontSize="8"
        fontWeight="700"
        fill="#fff"
      >
        VS
      </text>
    </svg>
  );
}

