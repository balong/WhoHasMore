import React from 'react';

export default function AppLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="8" width="12" height="10" rx="2" fill="var(--arcade-blue)" />
      <rect x="21" y="18" width="12" height="10" rx="2" fill="var(--arcade-purple)" />
      <text
        x="18"
        y="17"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fill="white"
        fontFamily="sans-serif"
      >
        VS
      </text>
      <circle cx="9" cy="13" r="1" fill="#ffffff" />
      <circle cx="27" cy="23" r="1" fill="#ffffff" />
    </svg>
  );
}
