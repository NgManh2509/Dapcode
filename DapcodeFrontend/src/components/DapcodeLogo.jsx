import React from 'react';

export default function DapcodeLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg
        className={`${currentSize} transition-transform hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lietcodeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252525" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
          <linearGradient id="lietcodeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
          <filter id="lietcodeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Squircle Container */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#lietcodeBg)"
          stroke="#FFA116"
          strokeWidth="2.5"
          strokeOpacity="0.75"
        />
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="22"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.08"
        />

        {/* Wheelchair Main Wheel (Large drive wheel) */}
        <circle cx="44" cy="62" r="19" fill="none" stroke="url(#lietcodeGold)" strokeWidth="4.5" />
        <circle cx="44" cy="62" r="6.5" fill="#2A2A2A" stroke="url(#lietcodeGold)" strokeWidth="3" />
        
        {/* Wheel Spokes */}
        <line x1="44" y1="45" x2="44" y2="79" stroke="#FFA116" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="27" y1="62" x2="61" y2="62" stroke="#FFA116" strokeWidth="2" strokeOpacity="0.8" />
        <line x1="32" y1="50" x2="56" y2="74" stroke="#FFA116" strokeWidth="1.8" strokeOpacity="0.65" />
        <line x1="32" y1="74" x2="56" y2="50" stroke="#FFA116" strokeWidth="1.8" strokeOpacity="0.65" />

        {/* Wheelchair Frame & Seat */}
        <path
          d="M 33 39 L 41 55 L 59 55"
          fill="none"
          stroke="#EFF1F6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M 59 55 L 68 73" fill="none" stroke="#EFF1F6" strokeWidth="3.5" strokeLinecap="round" />
        {/* Small front caster wheel */}
        <circle cx="68" cy="77" r="4.5" fill="#FFA116" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Programmer Person */}
        {/* Head with Headphones */}
        <circle cx="44" cy="25" r="7.5" fill="#EFF1F6" />
        <path d="M 38 25 C 38 18 50 18 50 25" fill="none" stroke="#FFA116" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="36.5" y="23" width="3" height="5" rx="1.5" fill="#FFA116" />
        <rect x="48.5" y="23" width="3" height="5" rx="1.5" fill="#FFA116" />

        {/* Body / Torso (Leaning forward into code) */}
        <path
          d="M 43 32 L 42 45 L 58 47"
          fill="none"
          stroke="#EFF1F6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arms typing on laptop */}
        <path
          d="M 43 38 L 57 44 L 67 43"
          fill="none"
          stroke="#FFA116"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Laptop on lap */}
        <line x1="58" y1="46" x2="76" y2="46" stroke="#E6E6E6" strokeWidth="3" strokeLinecap="round" />
        <line
          x1="72"
          y1="45"
          x2="79"
          y2="33"
          stroke="url(#lietcodeGold)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#lietcodeGlow)"
        />

        {/* Code glyphs on screen < / > */}
        <path
          d="M 72 37 L 70 39 L 72 41"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 75 37 L 77 39 L 75 41"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Export alias LietCodeLogo for clear semantics
export { DapcodeLogo as LietCodeLogo };
