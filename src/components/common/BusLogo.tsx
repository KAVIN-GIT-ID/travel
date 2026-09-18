import React from 'react';

interface BusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'brand';
  layout?: 'horizontal' | 'stacked';
  showTagline?: boolean;
}

export const BusLogo: React.FC<BusLogoProps> = ({
  size = 'md',
  variant = 'brand',
  layout = 'horizontal',
  showTagline = true,
}) => {
  const isLight = variant === 'light';

  if (layout === 'stacked') {
    return (
      <div className="inline-flex flex-col items-center text-center select-none group">
        {/* Speeding Bus Emblem (LorryGuru reference style) */}
        <div
          className={`relative overflow-hidden flex items-center justify-center ${
            isLight ? 'bg-white px-3 py-1 rounded-xl shadow-sm' : ''
          }`}
        >
          <img
            src="/tourist-bus-logo.jpg"
            alt="South India Travels Speeding Bus"
            className={`object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply ${
              size === 'sm' ? 'h-9 w-24' : size === 'lg' ? 'h-18 w-44' : 'h-13 w-32'
            }`}
          />
        </div>

        {/* Brand Typography in LorryGuru style */}
        <div className="mt-1">
          <div className="font-black text-lg sm:text-xl tracking-tighter uppercase italic leading-none flex items-center justify-center">
            <span className={isLight ? 'text-white' : 'text-[#0f2444]'}>SouthIndia</span>
            <span className="text-[#f97316]">Travels</span>
          </div>

          {showTagline && (
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <span className="w-5 h-[1.5px] bg-[#f97316] inline-block" />
              <span
                className={`text-[9px] font-extrabold uppercase tracking-widest ${
                  isLight ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Tour South India in Comfort
              </span>
              <span className={`w-5 h-[1.5px] ${isLight ? 'bg-slate-500' : 'bg-[#0f2444]'} inline-block`} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal layout for Navbar
  const busHeights = {
    sm: 'h-8 w-20',
    md: 'h-11 w-28',
    lg: 'h-14 w-36',
  }[size];

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl',
  }[size];

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-xs',
  }[size];

  return (
    <div className="inline-flex items-center gap-2.5 select-none group cursor-pointer">
      {/* Dynamic Speeding Bus in 3/4 Perspective with Motion Trails */}
      <div
        className={`relative shrink-0 flex items-center justify-center ${
          isLight ? 'bg-white px-2 py-0.5 rounded-lg' : ''
        }`}
      >
        <img
          src="/tourist-bus-logo.jpg"
          alt="South India Travels Speeding Bus"
          className={`object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply ${busHeights}`}
        />
      </div>

      {/* Brand Typography in exact reference style */}
      <div className="text-left">
        <div
          className={`font-black tracking-tight italic uppercase leading-none flex items-center gap-1 ${titleSizes}`}
        >
          <span className={isLight ? 'text-white' : 'text-[#0f2444]'}>SouthIndia</span>
          <span className="text-[#f97316]">Travels</span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-3.5 h-[1.5px] bg-[#f97316] inline-block shrink-0" />
            <span
              className={`font-extrabold uppercase tracking-wider whitespace-nowrap leading-none ${taglineSizes} ${
                isLight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Holiday Tours &amp; Tourist Buses
            </span>
            <span className={`w-3.5 h-[1.5px] ${isLight ? 'bg-slate-500' : 'bg-[#0f2444]'} inline-block shrink-0`} />
          </div>
        )}
      </div>
    </div>
  );
};
