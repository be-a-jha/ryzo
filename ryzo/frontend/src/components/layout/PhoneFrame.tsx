'use client';

import { cn } from '@/lib/utils';

interface PhoneFrameProps {
  children: React.ReactNode;
  label: string;
  variant?: 'light' | 'dark';
}

/** Mock status bar icons for phone frame */
function StatusBar({ variant }: { variant: 'light' | 'dark' }) {
  const textColor = variant === 'light' ? 'text-[#1A1A1A]' : 'text-white';
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 h-10 flex-shrink-0',
        variant === 'light' ? 'bg-white' : 'bg-ryzo-black'
      )}
    >
      <span className={cn('text-[13px] font-semibold', textColor)}>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')} />
          <rect x="4" y="5" width="3" height="7" rx="0.5" className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')} />
          <rect x="8" y="2" width="3" height="10" rx="0.5" className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')} />
          <rect x="12" y="0" width="3" height="12" rx="0.5" className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')} />
        </svg>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path
            d="M7 10.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM3.5 8a5 5 0 017 0"
            stroke={variant === 'light' ? '#1A1A1A' : '#FFFFFF'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 5.5a8 8 0 0112 0"
            stroke={variant === 'light' ? '#1A1A1A' : '#FFFFFF'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {/* Battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="20"
            height="11"
            rx="2"
            stroke={variant === 'light' ? '#1A1A1A' : '#FFFFFF'}
            strokeWidth="1"
          />
          <rect
            x="2"
            y="2"
            width="15"
            height="8"
            rx="1"
            className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')}
          />
          <rect
            x="22"
            y="4"
            width="2"
            height="4"
            rx="0.5"
            className={cn(variant === 'light' ? 'fill-[#1A1A1A]' : 'fill-white')}
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

/** Home indicator bar at the bottom of the phone */
function HomeIndicator({ variant }: { variant: 'light' | 'dark' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-2 flex-shrink-0',
        variant === 'light' ? 'bg-white' : 'bg-ryzo-black'
      )}
    >
      <div
        className={cn(
          'w-16 h-1 rounded-full',
          variant === 'light' ? 'bg-[#CCCCCC]' : 'bg-ryzo-text-disabled'
        )}
      />
    </div>
  );
}

export default function PhoneFrame({ children, label, variant = 'dark' }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Phone shell */}
      <div
        className="relative w-[320px] h-[680px] rounded-[44px] bg-ryzo-surface-2 p-[6px]"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Inner screen area */}
        <div
          className={cn(
            'w-full h-full rounded-[38px] overflow-hidden flex flex-col',
            variant === 'light' ? 'bg-white' : 'bg-ryzo-black'
          )}
        >
          {/* Status bar */}
          <StatusBar variant={variant} />

          {/* Screen content area — scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
            {children}
          </div>

          {/* Home indicator */}
          <HomeIndicator variant={variant} />
        </div>
      </div>

      {/* Label below phone */}
      <span className="mt-3 text-[12px] font-medium uppercase tracking-[2px] text-ryzo-text-muted">
        {label}
      </span>
    </div>
  );
}
