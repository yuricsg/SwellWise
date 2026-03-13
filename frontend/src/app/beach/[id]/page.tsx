"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/services/api";
import type { Beach, BeachCondition } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConditionBadge from "@/components/ConditionBadge";
import RatingStars from "@/components/RatingStars";

export default function BeachDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Safe param extraction for Next.js 15+
  const beachId = params?.id as string;

  const [beach, setBeach] = useState<Beach | null>(null);
  const [conditions, setConditions] = useState<BeachCondition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!beachId) return;
    loadBeachData();
  }, [beachId]);

  const loadBeachData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [beachData, conditionsData] = await Promise.all([
        apiService.getBeachById(beachId),
        apiService.getBeachConditions(beachId),
      ]);

      setBeach(beachData);
      setConditions(conditionsData);
    } catch (err) {
      setError("Não foi possível carregar os detalhes desta praia. O servidor pode estar indisponível.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-color flex flex-col">
        <header className="h-20 glass-panel border-b-0 border-surface-border flex items-center px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <Link href="/" className="text-muted hover:text-white transition-colors flex items-center gap-2 font-medium">
            ← Voltar para Praias
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !beach || !conditions) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-panel text-center p-10 rounded-3xl max-w-lg border-red-500/20">
          <div className="text-red-400 text-5xl mb-6">⚠️</div>
          <p className="text-white text-xl font-medium mb-8 leading-relaxed">
            {error || "Dados não encontrados"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-white text-black font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Explorar outras praias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Sleek Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-surface-border/50 supports-[backdrop-filter]:bg-surface/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-muted hover:text-white transition-colors flex items-center gap-2 font-medium text-sm border border-surface-border hover:border-muted px-4 py-2 rounded-lg bg-surface/50"
          >
            ← Voltar
          </button>
          
          <div className="font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-brand-cyan">🌊</span> SwellWise
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Beach Hero Section */}
        <div className="mb-12 animate-fade-in relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 rounded-full text-xs font-bold uppercase tracking-wider">
                  {beach.state}
                </span>
                <span className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {beach.city} • {beach.region}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                {beach.name}
              </h1>
            </div>
            
            <div className="text-right shrink-0">
               <div className="text-xs text-muted font-medium mb-1 uppercase tracking-wider">Melhor Época</div>
               <div className="text-xl font-semibold text-white">{beach.best_season}</div>
            </div>
          </div>

          <p className="text-lg text-muted max-w-3xl leading-relaxed">
            {beach.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {beach.surf_quality && (
              <div className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-sm font-medium text-white flex items-center gap-2 shadow-sm">
                <span className="text-brand-cyan text-lg">🏄</span> {beach.surf_quality}
              </div>
            )}
            {beach.has_infrastructure && (
              <div className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-sm font-medium text-muted flex items-center gap-2 shadow-sm">
                🏗️ Infra Completa
              </div>
            )}
            {beach.has_surf_schools && (
              <div className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-sm font-medium text-muted flex items-center gap-2 shadow-sm">
                🏄‍♂️ Escola de Surf
              </div>
            )}
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Condições Agora</h2>
            <span className="ml-auto text-xs font-medium text-muted">
              Atualizado: {new Date(conditions.timestamp).toLocaleTimeString("pt-BR", {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ConditionBadge
              label="Ondas"
              value={conditions.wave.height_m}
              unit="m"
              icon="🌊"
              highlight={true}
            />
            <ConditionBadge
              label="Temperatura"
              value={conditions.weather.temperature_c}
              unit="°C"
              icon="🌡️"
            />
            <ConditionBadge
              label="Vento"
              value={conditions.wind.speed_kmh}
              unit="km/h"
              icon="💨"
            />
            <ConditionBadge
              label="Clima"
              value={conditions.weather.weather_description}
              icon="☁️"
            />
          </div>
        </section>

        {/* AI Analysis - The Core Feature */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {/* Beautiful glowing border wrapper */}
          <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-brand-cyan/40 via-brand-blue/10 to-transparent">
            <div className="absolute inset-0 bg-brand-cyan/5 blur-xl -z-10 rounded-[2rem] opacity-50"></div>
            
            <div className="bg-surface/90 backdrop-blur-xl rounded-[calc(2rem-1px)] p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Decorative AI background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 border-none"></div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center shadow-lg shadow-brand-cyan/20">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
                    SwellWise AI Analysis
                  </h2>
                  <p className="text-brand-cyan text-sm font-medium">Análise preditiva gerada em tempo real</p>
                </div>
              </div>

              {conditions.ai_review ? (
                <div className="relative z-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
                  
                  {/* Left Column: Review & Recommendations */}
                  <div className="space-y-8">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white text-lg leading-relaxed font-medium">
                        {conditions.ai_review.review_pt}
                      </p>
                    </div>

                    {/* Best Time Tag */}
                    {conditions.ai_review.best_time && (
                      <div className="inline-flex items-center gap-3 bg-brand-blue/10 border border-brand-blue/20 px-5 py-3 rounded-xl">
                        <span className="text-xl">⏱️</span>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-brand-cyan tracking-wider">Janela Ideal</p>
                          <p className="text-white font-semibold">{conditions.ai_review.best_time}</p>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Lists */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {conditions.ai_review.recommendations?.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="text-green-400">✓</span> A Favor
                          </h3>
                          <ul className="space-y-3">
                            {conditions.ai_review.recommendations.map((rec, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5 opacity-70">✦</span> 
                                <span className="leading-snug">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {conditions.ai_review.warnings?.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="text-yellow-500">⚠</span> Atenção
                          </h3>
                          <ul className="space-y-3">
                            {conditions.ai_review.warnings.map((warn, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-yellow-500 mt-0.5 opacity-70">✦</span> 
                                <span className="leading-snug">{warn}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Activity Score Widget */}
                  <div className="bg-[#040B16] rounded-2xl p-6 border border-surface-border/50 shadow-inner flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest text-center mb-6">
                      Activity Suitability Score
                    </h3>
                    
                    {conditions.ai_review.rating && (
                      <div className="space-y-6">
                        <RatingStars label="Surfar" rating={conditions.ai_review.rating.surf} icon="🏄" />
                        <div className="h-px bg-surface-border/30 w-full" />
                        <RatingStars label="Nadar" rating={conditions.ai_review.rating.swim} icon="🏊" />
                        <div className="h-px bg-surface-border/30 w-full" />
                        <RatingStars label="Pesca" rating={conditions.ai_review.rating.fishing} icon="🎣" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty/Error state for AI */
                <div className="relative z-10 glass-panel border-dashed border-2 border-surface-border rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-3 opacity-50">🤖💤</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Análise Offline</h3>
                  <p className="text-sm text-muted max-w-md mx-auto">
                    Nossa IA está descansando no momento. Enquanto isso, consulte as métricas exatas abaixo para planejar sua ida à praia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Deep Dive Metrics */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-4xl opacity-5">🌊</div>
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Oceano & Swell</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-surface-border/50">
                <span className="text-muted font-medium">Altura do Swell</span>
                <span className="text-white font-bold text-lg">{conditions.wave.swell_height_m} m</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-border/50">
                <span className="text-muted font-medium">Direção da Onda</span>
                <span className="text-white font-bold text-lg">{conditions.wave.direction_deg}°</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted font-medium">Período</span>
                <span className="bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 px-3 py-1 rounded-lg font-bold">
                  {conditions.wave.period_s} s
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-4xl opacity-5">📍</div>
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Status do Pico</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-surface-border/50">
                <span className="text-muted font-medium">Coordenadas</span>
                <span className="text-white font-mono text-sm">{beach.latitude.toFixed(3)}, {beach.longitude.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-border/50">
                <span className="text-muted font-medium">Visualizações</span>
                <span className="text-white font-bold">{beach.view_count.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted font-medium">Estacionamento</span>
                <span className={beach.has_parking ? "text-green-400 font-bold" : "text-slate-500 font-bold"}>
                  {beach.has_parking ? "✓ Disponível" : "✕ Indisponível"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
