'use client';

import { use } from 'react';
import { ArrowLeft, MapPin, Loader, TriangleAlert, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useBeach, useBeachConditions } from '@/hooks/useBeaches';
import BeachConditionsCard from '@/components/BeachConditionsCard';
import OceanSwellCard from '@/components/OceanSwellCard';
import AIAnalysisCard from '@/components/AIAnalysisCard';

const ACCENT_COLORS = [
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-violet-500 to-pink-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-pink-400',
  'from-indigo-500 to-blue-400',
];

const QUALITY_LABEL: Record<string, string> = {
  excellent: '🏄 Excelente para surf',
  good: '👍 Boa para surf',
  fair: '😐 Regular',
  poor: '🌊 Mar tranquilo',
};

export default function BeachDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { beach, isLoading: beachLoading, error: beachError } = useBeach(id);
  const {
    conditions,
    isLoading: conditionsLoading,
    error: conditionsError,
    mutate: refreshConditions,
  } = useBeachConditions(id);

  // --- Loading state (banco) ---
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

  // --- Praia não encontrada ---
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

  const accent = ACCENT_COLORS[Math.abs(parseInt(beach.id)) % ACCENT_COLORS.length];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">

        {/* Voltar */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Explorar
        </Link>

        {beach.warning && (
          <section className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden border border-red-500/50 bg-red-950/40 backdrop-blur-xl shadow-xl shadow-red-950/30">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-red-500/30 animate-pulse pointer-events-none" />

              <div className="flex items-start gap-5 p-6">
                {/* Icon */}
                <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30">
                  <ShieldAlert className="h-8 w-8 text-red-400" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                  
                  <p className="text-red-100 text-sm leading-relaxed font-medium">
                    {beach.warning}
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        <section className="animate-fade-in flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Coluna esquerda */}
          <div className="flex-1 space-y-5">
            {/* Accent bar + header card */}
            <div className="rounded-2xl overflow-hidden border border-border/40 bg-card/50 backdrop-blur-xl">
              {/* Thin colored top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

              <div className="p-6 sm:p-8">
                {/* Tags + estado */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {beach.state}
                  </span>
                  {beach.surf_quality && (
                    <span className="px-3 py-1 bg-secondary/60 text-muted-foreground border border-border/40 rounded-full text-xs font-semibold">
                      {QUALITY_LABEL[beach.surf_quality] ?? beach.surf_quality}
                    </span>
                  )}
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

                {/* Localização */}
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
          </div>

          {/* Coluna direita — Status */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Informações do local */}
            <div className="glass rounded-2xl p-6">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-4">
                📍 Status do Local
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">COORDENADAS GPS</p>
                  <p className="text-foreground font-mono text-sm font-semibold">
                    {beach.latitude.toFixed(4)}, {beach.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="border-t border-border/30 pt-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Cidade</p>
                  <p className="text-foreground font-semibold">{beach.city}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Estado</p>
                  <p className="text-foreground font-semibold">{beach.state}</p>
                </div>
                {beach.region && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Região</p>
                    <p className="text-foreground font-semibold">{beach.region}</p>
                  </div>
                )}
                {beach.best_season && (
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs text-muted-foreground mb-0.5">MELHOR ÉPOCA</p>
                    <p className="text-primary font-bold">{beach.best_season}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Infraestrutura */}
            {beach.tags && beach.tags.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
                  🏖️ Características
                </p>
                <div className="flex flex-wrap gap-2">
                  {beach.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SEÇÃO 2 & 3: Condições + Oceano ── */}
        <section
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          {/* Condições Agora (2/3) */}
          <div className="lg:col-span-2">
            <BeachConditionsCard
              conditions={conditions}
              isLoading={conditionsLoading}
              error={conditionsError}
              onRefresh={() => refreshConditions()}
            />
          </div>

          {/* Oceano & Swell (1/3) */}
          <div>
            <OceanSwellCard
              wave={conditions?.wave}
              isLoading={conditionsLoading}
              error={conditionsError}
            />
          </div>
        </section>

        {/* ── SEÇÃO 4: Análise IA ── */}
        <section
          className="animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <AIAnalysisCard
            ratings={conditions?.ratings}
            aiReview={conditions?.ai_review}
            isLoading={conditionsLoading}
            error={conditionsError}
          />
        </section>

        {/* ── SEÇÃO 5: Sobre a praia ── */}
        {beach.description && (
          <section
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Sobre esta praia</h3>
              <p className="text-muted-foreground leading-relaxed">{beach.description}</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">🌍 Localização</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Localizada em <strong className="text-foreground">{beach.city}</strong>, no estado de{' '}
                <strong className="text-foreground">{beach.state}</strong>.
                {beach.region && (
                  <> Região <strong className="text-foreground">{beach.region}</strong>.</>
                )}
              </p>
              <div className="text-xs text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg space-y-1">
                <p>Latitude: {beach.latitude}</p>
                <p>Longitude: {beach.longitude}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
