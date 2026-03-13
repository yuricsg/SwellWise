// Modern Beach Card Component
import Link from "next/link";
import type { Beach } from "@/types";

interface BeachCardProps {
  beach: Beach;
}

export default function BeachCard({ beach }: BeachCardProps) {
  return (
    <Link href={`/beach/${beach.id}`} className="block h-full outline-none">
      <div className="group relative h-full glass-panel rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-brand-cyan/40 hover:shadow-[0_8px_30px_rgba(0,240,255,0.12)] overflow-hidden flex flex-col min-h-70 sm:min-h-80">
        
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-brand-cyan/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6 gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-1.5 sm:mb-2 group-hover:text-brand-cyan transition-colors line-clamp-1">
                {beach.name}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted text-xs sm:text-sm font-medium flex-wrap">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cyan opacity-80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{beach.city}, {beach.state}</span>
                <span className="hidden sm:inline text-surface-border mx-1">•</span>
                <span className="hidden sm:inline truncate">{beach.region}</span>
              </div>
            </div>
            
            <div className="bg-brand-blue/20 border border-brand-blue/30 text-brand-cyan px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider shrink-0">
              {beach.state}
            </div>
          </div>

          {/* Body/Description */}
          <p className="text-muted text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed grow">
            {beach.description}
          </p>

          {/* Wrap-up Tech/Features */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
              {beach.surf_quality && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-surface border border-surface-border text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-medium">
                  <span className="text-brand-cyan">🏄</span> {beach.surf_quality}
                </span>
              )}
              {beach.has_infrastructure && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-surface border border-surface-border text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-medium">
                  <span className="text-muted">🏗️</span> Infra
                </span>
              )}
              {beach.has_surf_schools && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-surface border border-surface-border text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-medium">
                  <span className="text-brand-blue">🏄‍♂️</span> Escola
                </span>
              )}
            </div>

            {/* Footer Action */}
            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-surface-border/50 gap-2">
              <span className="text-[10px] sm:text-xs font-medium text-muted truncate">
                Destaque: <span className="text-white">{beach.best_season}</span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-brand-cyan flex items-center gap-0.5 sm:gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
                Ver Análise <span className="text-base sm:text-lg leading-none">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
