'use client';

import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import BeachCard from '@/components/BeachCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useBeaches } from '@/hooks/useBeaches';
import { cn } from '@/lib/utils';

export default function Home() {
  const [selectedState, setSelectedState] = useState('');
  const { beaches, isLoading, error } = useBeaches();

  const states = useMemo(() => [...new Set(beaches.map((b) => b.state))].sort(), [beaches]);

  const filtered = useMemo(() => {
    return beaches.filter((b) => {
      if (selectedState && b.state !== selectedState) return false;
      return true;
    });
  }, [beaches, selectedState]);

  const hasFilters = selectedState;

  return (
    <div className="bg-background">
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filters */}
        <div
          className={cn(
            'mb-10 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6',
            'border-b border-border/30 animate-fade-in'
          )}
          style={{ animationDelay: '500ms' }}
        >
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Explorar praias</h2>
            <span className="px-3 py-0.5 bg-secondary text-muted-foreground text-sm rounded-full">
              {filtered.length} locais
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className={cn(
                'bg-secondary border border-border/60 text-foreground text-sm rounded-xl px-4 py-2.5',
                'outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer',
                'transition-colors min-w-[180px]'
              )}
            >
              <option value="">Todos os Estados</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedState('');
                }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="glass rounded-2xl p-16 text-center animate-fade-in">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-foreground mb-2">Erro ao carregar praias</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">{error.message}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="glass rounded-2xl p-16 text-center animate-fade-in">
            <div className="text-4xl mb-4 opacity-70">🌊</div>
            <h3 className="text-xl font-medium text-foreground mb-2">Nenhuma praia encontrada</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Tente remover alguns filtros para ver mais locais.
            </p>
            <button
              onClick={() => {
                setSelectedState('');
              }}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((beach, i) => (
              <BeachCard key={beach.id} beach={beach} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
