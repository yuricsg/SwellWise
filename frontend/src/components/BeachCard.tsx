'use client';

import Link from 'next/link';
import { MapPin, TriangleAlert, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Beach } from '@/types/beach';

interface BeachCardProps {
  beach: Beach;
  index?: number;
}

const ACCENT_COLORS = [
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-violet-500 to-pink-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-pink-400',
  'from-indigo-500 to-blue-400',
];

const QUALITY_LABEL: Record<string, string> = {
  excellent: '🏄 Excelente',
  good: '👍 Boa',
  fair: '😐 Regular',
  poor: '🌊 Tranquila',
};

export default function BeachCard({ beach, index = 0 }: BeachCardProps) {
  const accent = ACCENT_COLORS[Math.abs(parseInt(beach.id)) % ACCENT_COLORS.length];

  return (
    <Link href={`/beach/${beach.id}`} className="group block h-full outline-none">
      <div
        className={cn(
          'bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden',
          'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer',
          'animate-fade-in h-full flex flex-col',
          beach.warning && 'border-red-500/30 hover:border-red-500/50'
        )}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Accent bar – thin colored stripe at top */}
        <div className={cn('h-1 w-full bg-gradient-to-r shrink-0', accent)} />

        {/* Card body */}
        <div className="p-5 flex flex-col flex-1">

          {/* Name + surf quality badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
              {beach.name}
            </h3>
            {beach.surf_quality && (
              <span className="shrink-0 text-[10px] font-semibold text-muted-foreground bg-secondary/60 border border-border/40 rounded-full px-2 py-0.5 whitespace-nowrap mt-0.5">
                {QUALITY_LABEL[beach.surf_quality] ?? beach.surf_quality}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-sm text-muted-foreground">{beach.city}, {beach.state}</span>
            {beach.region && (
              <span className="ml-auto text-[10px] text-muted-foreground/50 font-semibold uppercase tracking-wide">
                {beach.region}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
            {beach.description}
          </p>

          {/* Shark / safety warning */}
          {beach.warning && (
            <div className="mt-3 flex items-start gap-2 bg-red-950/50 border border-red-500/25 rounded-xl px-3 py-2.5">
              <TriangleAlert className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-300 leading-relaxed line-clamp-2">{beach.warning}</p>
            </div>
          )}

          {/* Footer: season + coords */}
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Waves className="h-3.5 w-3.5 text-primary/50" />
              <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                {beach.best_season ?? 'Ano todo'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/40 font-mono">
              {beach.latitude.toFixed(2)}° / {beach.longitude.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
