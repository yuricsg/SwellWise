'use client';

interface ConditionBadgeProps {
  label: string;
  value: string | number;
  icon?: string;
  unit?: string;
  highlight?: boolean;
}

export default function ConditionBadge({
  label,
  value,
  icon,
  unit = '',
  highlight = false,
}: ConditionBadgeProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 flex flex-col cursor-default
        transition-all duration-300 hover:-translate-y-0.5
        ${
          highlight
            ? 'bg-primary/15 border border-primary/40 shadow-lg shadow-primary/10'
            : 'bg-card/60 backdrop-blur-xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
          {label}
        </span>
        {icon && <span className="text-xl opacity-70">{icon}</span>}
      </div>

      <div className="mt-auto flex items-baseline gap-1.5">
        <span
          className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${
            highlight ? 'text-primary' : 'text-foreground'
          }`}
        >
          {value}
        </span>
        {unit && (
          <span className={`text-xs font-bold ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
