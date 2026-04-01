'use client';

import { use } from 'react';
import { ArrowLeft, MapPin, Loader } from 'lucide-react';
import Link from 'next/link';
import { useBeach } from '@/hooks/useBeaches';

export default function BeachDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { beach, isLoading, error } = useBeach(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-3xl text-center p-12 max-w-lg animate-fade-in">
          <Loader className="h-12 w-12 text-primary mx-auto mb-6 animate-spin" />
          <p className="text-foreground text-xl font-medium">Carregando detalhes da praia...</p>
        </div>
      </div>
    );
  }

  if (error || !beach) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass rounded-3xl text-center p-12 max-w-lg animate-fade-in">
          <div className="text-5xl mb-6">⚠️</div>
          <p className="text-foreground text-xl font-medium mb-2">Praia não encontrada</p>
          <p className="text-muted-foreground text-sm mb-8">{error?.message || 'Tente novamente mais tarde'}</p>
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

  const colors = [
    'from-blue-600 to-cyan-500',
    'from-emerald-600 to-teal-500',
    'from-purple-600 to-pink-500',
    'from-orange-600 to-amber-500',
    'from-rose-600 to-pink-500',
    'from-indigo-600 to-blue-500',
  ];
  const colorStyle = colors[Math.abs(parseInt(beach.id)) % colors.length];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Explorar
        </Link>

        {/* Hero Section */}
        <section className="animate-fade-in flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Image */}
            <div className={`relative h-80 rounded-3xl bg-gradient-to-br ${colorStyle} overflow-hidden`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-80">🌊</div>
                  <p className="text-white/60 text-lg font-medium">{beach.state}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  {beach.state}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                {beach.name}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {beach.description}
              </p>

              {/* Location */}
              <div className="flex items-start gap-3 pt-4 border-t border-border/30">
                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{beach.city}</p>
                  <p className="text-sm text-muted-foreground">
                    📍 {beach.latitude.toFixed(4)}° N / {beach.longitude.toFixed(4)}° W
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="w-full lg:w-80 space-y-4">
            {/* Location Card */}
            <div className="glass rounded-2xl p-6">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-3">
                Informações Gerais
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Cidade</p>
                  <p className="text-foreground font-semibold">{beach.city}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className="text-foreground font-semibold">{beach.state}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coordenadas</p>
                  <p className="text-foreground font-mono text-sm">
                    {beach.latitude.toFixed(4)}, {beach.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">💡 Dica</p>
              <p className="text-sm text-muted-foreground">
                Para ver as condições em tempo real desta praia, volte e clique novamente ou aguarde mais dados.
              </p>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Sobre esta praia</h3>
            <p className="text-muted-foreground leading-relaxed">{beach.description}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">🌍 Localização</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Localizada em <strong>{beach.city}</strong>, no estado de <strong>{beach.state}</strong>.
            </p>
            <p className="text-xs text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg">
              Latitude: {beach.latitude}
              <br />
              Longitude: {beach.longitude}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
