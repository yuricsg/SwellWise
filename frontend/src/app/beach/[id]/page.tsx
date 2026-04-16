'use client';

import { use } from 'react';
import { ArrowLeft, MapPin, Loader, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useBeach, useBeachConditions } from '@/hooks/useBeaches';
import BeachConditionsCard from '@/components/BeachConditionsCard';
import OceanSwellCard from '@/components/OceanSwellCard';
import AIAnalysisCard from '@/components/AIAnalysisCard';

export default function BeachDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { beach, isLoading: beachLoading, error: beachError } = useBeach(id);
  const {
    conditions,
    isLoading: conditionsLoading,
    error: conditionsError,
    mutate: refreshConditions,
  } = useBeachConditions(id);

  // --- Loading ---
  if (beachLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-3xl text-center p-12 max-w-lg animate-fade-in">
          <Loader className="h-12 w-12 text-primary mx-auto mb-6 animate-spin" />
          <p className="text-foreground text-xl font-medium">Carregando detalhes da praia...</p>
        </div>
      </div>
    );
  }

  // --- Não encontrada ---
  if (beachError || !beach) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-3xl text-center p-12 max-w-lg animate-fade-in">
          <div className="text-5xl mb-6">⚠️</div>
          <p className="text-foreground text-xl font-medium mb-2">Praia não encontrada</p>
          <p className="text-muted-foreground text-sm mb-8">
            {beachError?.message || 'Tente novamente mais tarde'}
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Explorar outras praias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-4">

        {/* Voltar */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Explorar
        </Link>

        {/* Alerta de segurança — largura total */}
        {beach.warning && (
          <div className="relative rounded-2xl overflow-hidden border border-red-500/50 bg-red-950/40 backdrop-blur-xl shadow-xl shadow-red-950/30 animate-fade-in">
            <div className="absolute inset-0 rounded-2xl ring-1 ring-red-500/30 animate-pulse pointer-events-none" />
            <div className="flex items-center gap-5 p-5">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-red-100 text-sm leading-relaxed font-medium">{beach.warning}</p>
            </div>
          </div>
        )}

        {/* ── Grid principal: 3 colunas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">

          {/* Coluna esquerda — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Hero */}
            <div className="rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-xl">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-cyan-400" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {beach.state}
                  </span>
                  {beach.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-secondary/60 text-muted-foreground border border-border/40 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                  {beach.name}
                </h1>
                {beach.description && (
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-5">
                    {beach.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">{beach.city}</span>
                  <span>·</span>
                  <span>{beach.state}</span>
                  {beach.region && (
                    <>
                      <span>·</span>
                      <span>{beach.region}</span>
                    </>
                  )}
                  <span className="ml-auto font-mono text-xs text-muted-foreground/50">
                    {beach.latitude.toFixed(4)}° / {beach.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>

            {/* Condições Agora */}
            <BeachConditionsCard
              conditions={conditions}
              isLoading={conditionsLoading}
              error={conditionsError}
              onRefresh={() => refreshConditions()}
            />

            {/* Análise IA */}
            <AIAnalysisCard
              ratings={conditions?.ratings}
              aiReview={conditions?.ai_review}
              isLoading={conditionsLoading}
              error={conditionsError}
            />
          </div>

          {/* Coluna direita — 1/3 */}
          <div className="flex flex-col gap-4">

            {/* Info do local */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Cidade</p>
                  <p className="text-foreground font-semibold text-sm">{beach.city}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Estado</p>
                  <p className="text-foreground font-semibold text-sm">{beach.state}</p>
                </div>
                {beach.region && (
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Região</p>
                    <p className="text-foreground font-semibold text-sm">{beach.region}</p>
                  </div>
                )}
                {beach.best_season && (
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-0.5">Melhor época</p>
                    <p className="text-primary font-bold text-sm">{beach.best_season}</p>
                  </div>
                )}
              </div>
              {beach.tags && beach.tags.length > 0 && (
                <div className="border-t border-border/30 pt-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">
                    Características
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {beach.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Oceano & Swell */}
            <OceanSwellCard
              wave={conditions?.wave}
              isLoading={conditionsLoading}
              error={conditionsError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
