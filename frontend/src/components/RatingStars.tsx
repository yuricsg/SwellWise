// Modern Rating Stars Component & Score Bar
interface RatingStarsProps {
  rating: number; // 0-10
  label: string;
  icon?: string;
}

export default function RatingStars({ rating, label, icon }: RatingStarsProps) {
  // Normalize score
  const score = Math.max(0, Math.min(10, rating));
  const percentage = (score / 10) * 100;
  
  // Decide color logic based on score Quality
  let colorClass = "from-red-500 to-orange-500";
  let textClass = "text-red-400";
  if (score >= 4) {
    colorClass = "from-yellow-400 to-orange-400";
    textClass = "text-yellow-400";
  }
  if (score >= 7) {
    colorClass = "from-green-400 to-emerald-500";
    textClass = "text-green-400";
  }
  if (score >= 9) {
    colorClass = "from-brand-cyan to-brand-blue";
    textClass = "text-brand-cyan";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg opacity-80">{icon}</span>}
          <span className="text-sm font-semibold text-white tracking-wide">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-black tabular-nums leading-none ${textClass}`}>
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted font-bold">/10</span>
        </div>
      </div>
      
      {/* Sleek Progress Bar */}
      <div className="h-1.5 w-full bg-surface-border/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
