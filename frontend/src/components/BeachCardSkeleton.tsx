'use client';

export default function BeachCardSkeleton() {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="h-52 bg-secondary/60" />

      {/* Content skeleton */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="h-5 bg-secondary rounded-lg w-3/4" />
        <div className="h-4 bg-secondary rounded-lg w-1/2" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-secondary rounded w-full" />
          <div className="h-3 bg-secondary rounded w-5/6" />
        </div>
        <div className="pt-3 border-t border-border/30">
          <div className="h-3 bg-secondary rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}
