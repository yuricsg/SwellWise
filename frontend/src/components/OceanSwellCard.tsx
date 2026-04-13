'use client';

import type { WaveData } from '@/types/beach';

interface OceanSwellCardProps {
  wave: WaveData | null | undefined;
  isLoading?: boolean;
  error?: { message: string } | null;
}

export default function OceanSwellCard({ wave, isLoading, error }: OceanSwellCardProps) {
  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌊</span>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Oceano & Swell</h3>
        </div>
        <p className="text-muted-foreground text-sm">Dados indisponíveis.</p>
      </div>
    );
  }

  if (isLoading || !wave) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-secondary rounded w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="h-3 bg-secondary rounded w-28" />
              <div className="h-4 bg-secondary rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const swellRows = [
    {
      label: 'Altura do Swell',
      value: wave.swell_height != null ? `${wave.swell_height.toFixed(2)} m` : null,
      fallback: `${wave.height.toFixed(2)} m`,
    },
    {
      label: 'Direção da Onda',
      value: wave.direction ? `${wave.direction}` : null,
      fallback: 'N/D',
    },
    {
      label: 'Período',
      value: wave.swell_period != null
        ? `${wave.swell_period.toFixed(2)} s`
        : wave.period != null
          ? `${wave.period.toFixed(2)} s`
          : null,
      fallback: 'N/D',
    },
    {
      label: 'Altura das Ondas',
      value: `${wave.height.toFixed(2)} m`,
      fallback: null,
    },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🌊</span>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Oceano & Swell
        </h3>
      </div>

      <div className="space-y-1">
        {swellRows.map((row, i) => {
          const displayValue = row.value ?? row.fallback;
          const isHighlighted = i === 0;
          return (
            <div
              key={row.label}
              className={`flex items-center justify-between py-3 ${
                i < swellRows.length - 1 ? 'border-b border-border/30' : ''
              } ${isHighlighted ? 'rounded-xl bg-primary/5 px-3 -mx-3' : ''}`}
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className={`font-bold ${isHighlighted ? 'text-primary text-base' : 'text-foreground text-sm'}`}>
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
