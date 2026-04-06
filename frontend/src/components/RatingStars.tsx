'use client';

import { getRatingColor } from '@/lib/utils';

interface RatingStarsProps {
  label: string;
  rating: number;
  icon?: string;
}

export default function RatingStars({ label, rating, icon }: RatingStarsProps) {
  const percentage = (rating / 10) * 100;
  const color = getRatingColor(rating);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className={`font-bold text-sm ${color}`}>{rating}/10</span>
      </div>
      <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${color.replace('text', 'bg')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
