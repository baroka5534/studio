import { cn } from '@/lib/utils';
import React from 'react';

export type AvatarStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'analyzing';

interface RobotAvatarProps extends React.SVGProps<SVGSVGElement> {
  status?: AvatarStatus;
}

export const RobotAvatar = ({ status = 'idle', className, ...props }: RobotAvatarProps) => {
  const energyColor = {
    idle: 'hsl(198, 93%, 60%)',      // Neon Turquoise (Primary)
    listening: 'hsl(198, 100%, 75%)',   // Brighter blue
    thinking: 'hsl(45, 100%, 60%)',     // Yellow
    speaking: 'hsl(120, 100%, 60%)',    // Green
    analyzing: 'hsl(280, 100%, 65%)',   // Purple
  };

  const isThinking = status === 'thinking';
  const isAnalyzing = status === 'analyzing';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={cn("w-full h-full", className)}
      {...props}
    >
      <defs>
        {/* Glow Filter */}
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for Visor */}
        <linearGradient id="visor-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={energyColor[status]} stopOpacity="0.5" />
          <stop offset="50%" stopColor={energyColor[status]} stopOpacity="1" />
          <stop offset="100%" stopColor={energyColor[status]} stopOpacity="0.5" />
        </linearGradient>

        {/* Gradient for T logo */}
        <radialGradient id="t-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={energyColor[status]} stopOpacity="1" />
            <stop offset="100%" stopColor={energyColor[status]} stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* --- Main Body --- */}
      <g>
        {/* Torso */}
        <path d="M75 85 L125 85 L135 125 L120 160 L80 160 L65 125 Z" fill="#E5E7EB" />
        {/* Abdomen Plates (Cybernetics) */}
        <g fill="#4B5563">
            <rect x="85" y="127" width="30" height="4" rx="2" />
            <rect x="82" y="134" width="36" height="4" rx="2" />
            <rect x="80" y="141" width="40" height="4" rx="2" />
        </g>
        
        {/* Chest Plate with 'T' */}
        <path d="M70 80 Q100 70 130 80 L125 90 L75 90 Z" fill="#F9FAFB" />
        <path d="M95 82 H 105 V 90 H 108 V 93 H 92 V 90 H 95 Z" fill={`url(#t-glow)`} filter="url(#neon-glow)" className="transition-all" />

        {/* Head */}
        <path d="M 80 35 C 80 20, 120 20, 120 35 L 125 65 L 75 65 Z" fill="#F9FAFB" />
        <rect x="78" y="55" width="44" height="6" fill="url(#visor-gradient)" rx="3" className="transition-all" >
           {status === 'listening' && <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />}
        </rect>

        {/* Neck */}
        <rect x="92" y="68" width="16" height="12" fill="#4B5563"/>
        
        {/* --- Limbs --- */}
        {/* Shoulders */}
        <circle cx="70" cy="90" r="12" fill="#E5E7EB"/>
        <circle cx="130" cy="90" r="12" fill="#E5E7EB"/>

        {/* Arms */}
        <g>
            <rect x="65" y="100" width="10" height="35" rx="5" fill="#F9FAFB" />
            <rect x="125" y="100" width="10" height="35" rx="5" fill="#F9FAFB" />
            {/* Energy Joints */}
            <circle cx="70" cy="105" r="4" fill={energyColor[status]} filter="url(#neon-glow)" className={cn('transition-all', {'animate-pulse': isThinking || isAnalyzing})} />
            <circle cx="130" cy="105" r="4" fill={energyColor[status]} filter="url(#neon-glow)" className={cn('transition-all', {'animate-pulse': isThinking || isAnalyzing})}/>
        </g>
        
         {/* Legs */}
        <g>
            {/* Upper */}
            <path d="M78 160 L85 180 L70 185 L68 160 Z" fill="#E5E7EB" />
            <path d="M122 160 L115 180 L130 185 L132 160 Z" fill="#E5E7EB" />
            {/* Lower */}
            <path d="M65 188 L75 200 L65 205 Z" fill="#F9FAFB" />
            <path d="M135 188 L125 200 L135 205 Z" fill="#F9FAFB" />

             {/* Energy Joints */}
            <circle cx="78" cy="165" r="3" fill={energyColor[status]} className={cn('transition-all', {'animate-pulse': isThinking})} />
            <circle cx="122" cy="165" r="3" fill={energyColor[status]} className={cn('transition-all', {'animate-pulse': isThinking})} />
        </g>

        {/* Analysis Rings */}
        {isAnalyzing && (
            <g strokeWidth="1.5" fill="none" filter="url(#neon-glow)">
                <circle cx="100" cy="100" r="85" stroke={energyColor[status]} strokeDasharray="4 4" strokeOpacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="95" stroke={energyColor[status]} strokeDasharray="5 3" strokeOpacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="12s" repeatCount="indefinite" />
                </circle>
            </g>
        )}

      </g>
    </svg>
  );
};
