"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import type { Beach } from "@/types";
import BeachCard from "@/components/BeachCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    loadBeaches();
  }, [selectedState, selectedRegion]);

  const loadBeaches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBeaches({
        state: selectedState || undefined,
        region: selectedRegion || undefined,
      });
      setBeaches(response.beaches);
    } catch (err) {
      setError("Erro ao carregar praias. Verifique se a API está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const states = [...new Set(beaches.map((b) => b.state))].filter(Boolean).sort();
  const regions = [...new Set(beaches.map((b) => b.region))].filter(Boolean).sort();

  return (
    <div className="min-h-screen">
      {/* Sleek Glass Header */}
      <header className="fixed w-full top-0 z-50 glass-panel border-b-0 border-surface-border/50 supports-[backdrop-filter]:bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-cyan/20 group-hover:border-brand-cyan/50 transition-colors">
                <span className="text-2xl transform group-hover:scale-110 transition-transform">🌊</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-brand-cyan transition-colors">
                SwellWise
              </h1>
            </div>
          </Link>
          <nav className="flex gap-8 text-sm font-medium">
            <Link
              href="/"
              className="text-white hover:text-brand-cyan transition-colors"
            >
              Explorar Praias
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-white transition-colors"
            >
              Sobre
            </Link>
          </nav>
        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in" style={{ animationDelay: "0ms" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            Condições em Tempo Real
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: "100ms" }}>
            A previsão <span className="text-gradient-glow font-black">perfeita</span><br /> para o seu oceano.
          </h2>
          
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            Inteligência Artificial avançada analisando dados meteorológicos e oceânicos para você encontrar as melhores ondas e praias do Brasil.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Sleek Filters */}
        <div className="glass-panel rounded-2xl p-4 mb-10 flex flex-wrap gap-4 items-center animate-fade-in shadow-2xl shadow-black/50" style={{ animationDelay: "300ms" }}>
          <div className="text-sm font-semibold text-muted ml-2 mr-2">Filtrar por:</div>
          
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-surface border border-surface-border text-white rounded-xl px-4 py-2.5 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all cursor-pointer hover:border-surface-border/80"
          >
            <option value="">Brasil (Todos)</option>
            {states.map((state) => (
              <option key={`state-${state}`} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-surface border border-surface-border text-white rounded-xl px-4 py-2.5 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all cursor-pointer hover:border-surface-border/80"
          >
            <option value="">Todas as Regiões</option>
            {regions.map((region) => (
              <option key={`region-${region}`} value={region}>{region}</option>
            ))}
          </select>

          {(selectedState || selectedRegion) && (
            <button
              onClick={() => { setSelectedState(""); setSelectedRegion(""); }}
              className="text-xs text-brand-cyan hover:text-white px-4 py-2 transition-colors font-medium ml-auto"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Results Metadata */}
        {!loading && (
          <div className="mb-6 flex items-center gap-2 text-muted text-sm px-2">
            <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
            Encontramos <span className="text-white font-semibold">{beaches.length}</span> {beaches.length === 1 ? "praia" : "praias"}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="glass-panel border-red-500/30 bg-red-500/5 p-6 rounded-2xl mb-8 flex items-start gap-4">
            <div className="text-red-400 text-2xl mt-1">⚠️</div>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">{error}</h3>
              <p className="text-muted text-sm">Certifique-se de que a API está rodando em http://localhost:8000</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && !error && beaches.length === 0 && (
          <div className="glass-panel text-center py-20 rounded-3xl border-dashed border-2 flex flex-col items-center justify-center">
            <span className="text-4xl mb-4 opacity-50">🏝️</span>
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma praia encontrada</h3>
            <p className="text-muted">Tente ajustar seus filtros para ver mais resultados.</p>
          </div>
        )}

        {/* Beaches Grid */}
        {!loading && !error && beaches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {beaches.map((beach, index) => (
              <div 
                key={beach.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${(index % 10) * 50}ms` }}
              >
                <BeachCard beach={beach} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-surface-border bg-surface/30 backdrop-blur-md pb-8 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <span className="text-white font-bold tracking-tight">SwellWise</span>
          </div>
          <div className="text-sm text-muted">
            © 2026 SwellWise Labs. All rights reserved.
          </div>
          <div className="text-xs text-muted flex gap-4">
            <span>Powered by Open-Meteo</span>
            <span>AI by Groq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
