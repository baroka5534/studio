import { cn } from '@/lib/utils';
import React from 'react';

export type AvatarStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

interface RobotAvatarProps extends React.SVGProps<SVGSVGElement> {
  status?: AvatarStatus;
}

export const RobotAvatar = ({ status = 'idle', className, ...props }: RobotAvatarProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={cn("w-full h-full", className)}
      {...props}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.75 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0 }} />
        </radialGradient>
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
      </defs>

      {/* Main Body Glow */}
      <circle cx="100" cy="100" r="80" fill="url(#glow)" className={cn('transition-all duration-500', { 'animate-pulse': status === 'thinking' })} />

      {/* Head */}
      <g>
        <path d="M 60 40 Q 100 20 140 40 L 150 100 Q 100 120 50 100 Z" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2"/>
      </g>
      
      {/* Antennas */}
      <line x1="80" y1="40" x2="70" y2="25" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" />
      <circle cx="70" cy="25" r="3" fill="hsl(var(--primary))" className={cn({'animate-pulse': status === 'listening' || status === 'thinking'})}/>

      <line x1="120" y1="40" x2="130" y2="25" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" />
      <circle cx="130" cy="25" r="3" fill="hsl(var(--primary))" className={cn({'animate-pulse': status === 'listening' || status === 'thinking'})}/>

      {/* Eyes */}
      <g>
        <ellipse cx="85" cy="70" rx="15" ry="20" fill="hsl(var(--background))" />
        <ellipse cx="115" cy="70" rx="15" ry="20" fill="hsl(var(--background))" />
        <circle cx="85" cy="70" r="10" fill="hsl(var(--primary))" filter="url(#glowFilter)" className={cn('transition-transform duration-300', {'scale-110': status === 'listening'})} />
        <circle cx="115" cy="70" r="10" fill="hsl(var(--primary))" filter="url(#glowFilter)" className={cn('transition-transform duration-300', {'scale-110': status === 'listening'})} />
        {/* Blinking animation */}
        <animateTransform attributeName="transform" type="scale" values="1 1; 1 0.1; 1 1" begin="0s" dur="5s" repeatCount="indefinite" additive="sum" attributeType="XML" calcMode="spline" keyTimes="0; 0.05; 0.1" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
      </g>
      
      {/* Mouth */}
      <g>
        {status === 'speaking' ? (
          <path d="M 90 95 Q 100 105 110 95" stroke="hsl(var(--primary))" strokeWidth="2" fill="none">
             <animate attributeName="d" values="M 90 95 Q 100 105 110 95; M 90 95 Q 100 98 110 95; M 90 95 Q 100 105 110 95" dur="0.5s" repeatCount="indefinite" />
          </path>
        ) : (
          <line x1="90" y1="95" x2="110" y2="95" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" />
        )}
      </g>
      
      {/* Body */}
      <g>
        <path d="M 50 105 L 150 105 L 130 160 Q 100 180 70 160 Z" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <circle cx="100" cy="130" r="10" fill="hsl(var(--primary))" filter="url(#glowFilter)" className={cn('transition-all duration-500', { 'animate-pulse': status === 'thinking' })} />
      </g>
    </svg>
  );
};
