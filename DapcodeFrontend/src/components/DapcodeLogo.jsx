import React from 'react';

export default function DapcodeLogo({ size = 'md', className = '', showGlow = true }) {
  const sizeClasses = {
    xs: 'h-6 w-6 rounded-md',
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-11 w-11 rounded-2xl',
    xl: 'h-14 w-14 rounded-2xl',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 group ${className}`}>
      {showGlow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-amber-500 rounded-xl opacity-40 group-hover:opacity-80 blur-xs transition-opacity duration-300" />
      )}
      <div
        className={`relative flex items-center justify-center overflow-hidden border border-white/20 dark:border-zinc-700/60 bg-[#0c0d14] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 ${currentSize}`}
      >
        <img
          src="/dapcode_logo.png"
          alt="Dapcode - Đập Code"
          className="w-full h-full object-cover select-none pointer-events-none scale-105"
        />
      </div>
    </div>
  );
}
