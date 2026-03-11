// Modern Condition Badge Component

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
  unit = "",
  highlight = false,
}: ConditionBadgeProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col
      ${highlight 
        ? 'bg-linear-to-br from-brand-blue/20 to-brand-cyan/10 border border-brand-cyan/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]' 
        : 'glass-panel'}
    `}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-muted">
          {label}
        </span>
        {icon && (
          <div className="text-xl sm:text-2xl opacity-80 filter drop-shadow-md">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-auto flex items-baseline gap-1">
        <span className={`text-3xl sm:text-4xl font-black tabular-nums tracking-tight ${highlight ? 'text-white' : 'text-slate-100'}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-base sm:text-lg font-medium mb-1 ${highlight ? 'text-brand-cyan' : 'text-muted'}`}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
