'use client';

import { RefreshCw } from 'lucide-react';
import type { BeachCondition } from '@/types/beach';
import { cn } from '@/lib/utils';

interface BeachConditionsCardProps {
  conditions: BeachCondition | null | undefined;
  isLoading?: boolean;
  error?: { message: string } | null;
  onRefresh?: () => void;
}

function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '❄️';
  if (code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export default function BeachConditionsCard({
  conditions,
  isLoading,
  error,
  onRefresh,
}: BeachConditionsCardProps) {
  const ts = conditions?.timestamp
    ? new Date(conditions.timestamp)
    : null;
  const timeStr = ts
    ? `${ts.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${ts.getHours().toString().padStart(2, '0')}:${ts.getMinutes().toString().padStart(2, '0')}`
    : null;

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">⚠ Condições Agora</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Dados ambientais temporariamente indisponíveis.
        </p>
      </div>
    );
  }

  if (isLoading || !conditions) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 bg-secondary rounded w-40" />
          <div className="h-4 bg-secondary rounded w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-secondary/40 rounded-xl p-4 space-y-2">
              <div className="h-3 bg-secondary rounded w-16" />
              <div className="h-8 bg-secondary rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { wave, wind, weather } = conditions;
  const weatherEmoji = weatherCodeToEmoji(weather.weather_code);

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Condições Agora
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {timeStr && (
            <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
              {timeStr}
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Atualizar"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Ondas */}
        <div className={cn(
          'bg-primary/10 border border-primary/20 rounded-xl p-4',
          'flex flex-col gap-1 col-span-1'
        )}>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Ondas 🌊
          </span>
          <span className="text-2xl font-extrabold text-primary">
            {wave.height.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">m</span>
          </span>
        </div>

        {/* Temperatura */}
        <div className="bg-secondary/40 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Temperatura 🌡️
          </span>
          <span className="text-2xl font-extrabold text-foreground">
            {weather.temperature.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">°C</span>
          </span>
        </div>

        {/* Vento */}
        <div className="bg-secondary/40 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Vento 💨
          </span>
          <span className="text-2xl font-extrabold text-foreground">
            {wind.speed.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">km/h</span>
          </span>
          {wind.direction && (
            <span className="text-xs text-muted-foreground">{wind.direction}</span>
          )}
        </div>

        {/* Clima */}
        <div className="bg-secondary/40 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Clima {weatherEmoji}
          </span>
          <span className="text-lg font-bold text-foreground leading-tight">
            {weather.condition}
          </span>
        </div>
      </div>

      {/* Extra info */}
      {(weather.humidity != null || weather.visibility != null) && (
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          {weather.humidity != null && (
            <span>💧 Umidade: <strong>{weather.humidity}%</strong></span>
          )}
          {weather.visibility != null && (
            <span>👁 Visibilidade: <strong>{weather.visibility.toFixed(1)} km</strong></span>
          )}
        </div>
      )}
    </div>
  );
}
