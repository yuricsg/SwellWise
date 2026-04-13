'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import BeachCard from '@/components/BeachCard';
import BeachCardSkeleton from '@/components/BeachCardSkeleton';
import { useBeachesPaginated } from '@/hooks/useBeaches';
import { cn } from '@/lib/utils';

const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

export default function Home() {
  const [selectedState, setSelectedState] = useState('');

  const {
    beaches,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  } = useBeachesPaginated({
    state: selectedState || undefined,
  });

  // Quando filtro muda, o hook reinicia automaticamente
  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  const hasFilters = Boolean(selectedState);

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
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Explorar praias
            </h2>
            {!isLoading && total > 0 && (
              <span className="px-3 py-0.5 bg-secondary text-muted-foreground text-sm rounded-full">
                {total} {total === 1 ? 'local' : 'locais'}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className={cn(
                'bg-secondary border border-border/60 text-foreground text-sm rounded-xl px-4 py-2.5',
                'outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer',
                'transition-colors min-w-[180px]'
              )}
            >
              <option value="">Todos os Estados</option>
              {BRAZILIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={() => handleStateChange('')}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="glass rounded-2xl p-16 text-center animate-fade-in">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              Erro ao carregar praias
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {error.message}
            </p>
          </div>
        )}

        {/* Grid de cards */}
        {!error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cards das praias */}
              {beaches.map((beach, i) => (
                <BeachCard key={beach.id} beach={beach} index={i} />
              ))}

              {/* Skeleton durante carregamento inicial */}
              {isLoading &&
                [...Array(6)].map((_, i) => (
                  <BeachCardSkeleton key={`sk-init-${i}`} />
                ))}

              {/* Skeleton durante "Mostrar mais" */}
              {isLoadingMore &&
                [...Array(3)].map((_, i) => (
                  <BeachCardSkeleton key={`sk-more-${i}`} />
                ))}
            </div>

            {/* Estado vazio */}
            {!isLoading && !isLoadingMore && beaches.length === 0 && !error && (
              <div className="glass rounded-2xl p-16 text-center animate-fade-in">
                <div className="text-4xl mb-4 opacity-70">🌊</div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Nenhuma praia encontrada
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                  {hasFilters
                    ? 'Nenhuma praia cadastrada para este estado.'
                    : 'Nenhuma praia disponível no momento.'}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => handleStateChange('')}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </button>
                )}
              </div>
            )}

            {/* Botão "Mostrar mais" */}
            {!isLoading && hasMore && !isLoadingMore && (
              <div className="mt-12 flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando <strong className="text-foreground">{beaches.length}</strong> de{' '}
                  <strong className="text-foreground">{total}</strong> praias
                  {selectedState && ` em ${selectedState}`}
                </p>
                <button
                  onClick={loadMore}
                  className={cn(
                    'mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-xl',
                    'bg-primary/10 border border-primary/20 text-primary font-semibold',
                    'hover:bg-primary/20 hover:border-primary/40 transition-all duration-200',
                    'active:scale-95'
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                  Mostrar mais praias
                </button>
              </div>
            )}

            {/* Loading spinner do "Mostrar mais" */}
            {isLoadingMore && (
              <div className="mt-8 flex justify-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            )}

            {/* Fim da lista */}
            {!isLoading && !hasMore && beaches.length > 0 && (
              <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground">
                  🌊 Todas as <strong>{total}</strong> praias carregadas
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
