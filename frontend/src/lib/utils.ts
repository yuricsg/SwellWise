import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format temperature
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

/**
 * Format wind speed
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

/**
 * Format wave height
 */
export function formatWaveHeight(height: number): string {
  return `${height.toFixed(1)}m`;
}

/**
 * Format date to short format (PT-BR)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/**
 * Format time (PT-BR)
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get wind direction from degrees
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}

/**
 * Get weather description from code (WMO)
 */
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Céu Limpo',
    1: 'Céu Limpo',
    2: 'Parcialmente Nublado',
    3: 'Nublado',
    45: 'Névoa',
    48: 'Névoa',
    51: 'Garoa Leve',
    53: 'Garoa Moderada',
    55: 'Garoa Intensa',
    61: 'Chuva Leve',
    63: 'Chuva Moderada',
    65: 'Chuva Intensa',
    71: 'Neve Leve',
    73: 'Neve Moderada',
    75: 'Neve Intensa',
    80: 'Pancadas Leves',
    81: 'Pancadas Moderadas',
    82: 'Pancadas Intensas',
    95: 'Tempestade',
  };
  return descriptions[code] || 'Desconhecido';
}

/**
 * Get color based on rating score (0-10)
 */
export function getRatingColor(score: number): string {
  if (score < 3) return 'text-red-500';
  if (score < 6) return 'text-yellow-500';
  if (score < 8) return 'text-emerald-500';
  return 'text-cyan-500';
}

/**
 * Get background color for rating
 */
export function getRatingBgColor(score: number): string {
  if (score < 3) return 'bg-red-500/15 border-red-500/30';
  if (score < 6) return 'bg-yellow-500/15 border-yellow-500/30';
  if (score < 8) return 'bg-emerald-500/15 border-emerald-500/30';
  return 'bg-cyan-500/15 border-cyan-500/30';
}

/**
 * Utility delay for async
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
