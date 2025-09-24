'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isAnimating: boolean;
  className?: string;
}

export const AudioVisualizer = ({ isAnimating, className }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'hsl(var(--primary))');
      gradient.addColorStop(0.5, 'hsl(var(--accent))');
      gradient.addColorStop(1, 'hsl(var(--primary))');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      ctx.beginPath();
      for (let i = 0; i < canvas.width; i++) {
        const x = i;
        const y = canvas.height / 2 + Math.sin(x * 0.05 + time) * (canvas.height / 4) * Math.sin(time);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      if (isAnimating) {
        animationFrameId = requestAnimationFrame(render);
      } else {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (isAnimating) {
      render();
    } else {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating]);

  return <canvas ref={canvasRef} className={cn('w-full h-full', className)} />;
};
