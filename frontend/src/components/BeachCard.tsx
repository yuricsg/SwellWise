'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Beach } from '@/types/beach';

interface BeachCardProps {
  beach: Beach;
  index?: number;
}

export default function BeachCard({ beach, index = 0 }: BeachCardProps) {
  // Generate a consistent color based on beach id
  const colors = [
    'from-blue-600 to-cyan-500',
    'from-emerald-600 to-teal-500',
    'from-purple-600 to-pink-500',
    'from-orange-600 to-amber-500',
    'from-rose-600 to-pink-500',
    'from-indigo-600 to-blue-500',
  ];
  const colorStyle = colors[Math.abs(parseInt(beach.id)) % colors.length];

  return (
    <Link href={`/beach/${beach.id}`} className="group block h-full outline-none">
      <div
        className={cn(
          'bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden',
          'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer',
          'animate-fade-in h-full flex flex-col'
        )}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Image */}
        <div className={cn('relative h-52 overflow-hidden bg-linear-to-br', colorStyle)}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2 opacity-80">🌊</div>
              <p className="text-white/60 text-sm font-medium">{beach.state}</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
            {beach.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm text-muted-foreground">{beach.city}, {beach.state}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{beach.description}</p>

          {/* Coordinates */}
          <div className="pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              📍 {beach.latitude.toFixed(4)}° / {beach.longitude.toFixed(4)}°
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
