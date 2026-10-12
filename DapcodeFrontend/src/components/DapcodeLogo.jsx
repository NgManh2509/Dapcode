import React from 'react';

export default function DapcodeLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'h-6 w-6 rounded-md',
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-8 w-8 rounded-lg',
    lg: 'h-10 w-10 rounded-xl',
    xl: 'h-12 w-12 rounded-xl',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden border border-[#E6E6E6] dark:border-[#3E3E3E] bg-[#262626] dark:bg-[#333333] transition-colors ${currentSize}`}
      >
        <img
          src="/dapcode_logo.png"
          alt="Dapcode"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>
    </div>
  );
}
