'use client';

import type { ActivityRating, AIReview } from '@/types/beach';
import { cn } from '@/lib/utils';

interface AIAnalysisCardProps {
  ratings: ActivityRating | null | undefined;
  aiReview: AIReview | null | undefined;
  isLoading?: boolean;
  error?: { message: string } | null;
}

function RatingBar({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  const pct = (value / 10) * 100;
  const color =
    value >= 8 ? 'from-emerald-500 to-teal-400' :
    value >= 6 ? 'from-yellow-500 to-amber-400' :
    value >= 4 ? 'from-orange-500 to-amber-400' :
    'from-red-500 to-rose-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground font-medium">
          {emoji} {label}
        </span>
        <span className="text-sm font-bold text-foreground">
          {value.toFixed(1)}<span className="text-muted-foreground font-normal">/10</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
        <div
          className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AIAnalysisCard({ ratings, aiReview, isLoading, error }: AIAnalysisCardProps) {
  if (isLoading || (!ratings && !error)) {
    return (
      <div className="glass rounded-2xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary rounded-xl" />
          <div>
            <div className="h-4 bg-secondary rounded w-40 mb-1.5" />
            <div className="h-3 bg-secondary rounded w-28" />
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-5/6" />
          <div className="h-3 bg-secondary rounded w-4/6" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 bg-secondary rounded w-20" />
                <div className="h-3 bg-secondary rounded w-12" />
              </div>
              <div className="h-2 bg-secondary rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <p className="font-bold text-foreground">SwellWise AI Analysis</p>
            <p className="text-xs text-muted-foreground">Análise preditiva inteligente</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Análise de IA indisponível no momento.
        </p>
        {ratings && (
          <div className="mt-6 space-y-4">
            <RatingBar label="Surf" emoji="🏄" value={ratings.surf_rating} />
            <RatingBar label="Natação" emoji="🏊" value={ratings.swim_rating} />
            <RatingBar label="Pesca" emoji="🎣" value={ratings.fishing_rating} />
          </div>
        )}
      </div>
    );
  }

  if (!ratings) return null;

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
          <span className="text-lg">✨</span>
        </div>
        <div>
          <p className="font-bold text-foreground">SwellWise AI Analysis</p>
          <p className="text-xs text-primary">Análise preditiva inteligente</p>
        </div>
      </div>

      {/* Review text */}
      {aiReview?.review_pt ? (
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {aiReview.review_pt}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Análise baseada nas condições atuais da praia.
        </p>
      )}

      {/* Ratings */}
      <div className="space-y-4 mb-6">
        <RatingBar label="Surf" emoji="🏄" value={ratings.surf_rating} />
        <RatingBar label="Natação" emoji="🏊" value={ratings.swim_rating} />
        <RatingBar label="Pesca" emoji="🎣" value={ratings.fishing_rating} />
      </div>

      {/* Best time */}
      {aiReview?.best_time && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-primary">⏰</span>
          <span className="text-muted-foreground">Janela ideal:</span>
          <span className="font-semibold text-foreground capitalize">{aiReview.best_time}</span>
        </div>
      )}

      {/* Recommendations */}
      {aiReview?.recommendations && aiReview.recommendations.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            ✓ A Favor
          </p>
          <ul className="space-y-1">
            {aiReview.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {aiReview?.warnings && aiReview.warnings.length > 0 && (
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            ⚠ Atenção
          </p>
          <ul className="space-y-1">
            {aiReview.warnings.map((warn, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
