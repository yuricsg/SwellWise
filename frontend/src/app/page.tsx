"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import type { Beach } from "@/types";
import BeachCard from "@/components/BeachCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

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

  useEffect(() => {
    loadBeaches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedRegion]);

  const states = [...new Set(beaches.map((b) => b.state))].filter(Boolean).sort();
  const regions = [...new Set(beaches.map((b) => b.region))].filter(Boolean).sort();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        {/* Responsive Filters */}
        <div className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 md:mb-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center animate-fade-in shadow-2xl shadow-black/50" style={{ animationDelay: "300ms" }}>
          <div className="text-sm font-semibold text-muted sm:ml-2 sm:mr-2 hidden sm:block">Filtrar por:</div>
          
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex-1 sm:flex-initial bg-surface border border-surface-border text-white rounded-xl px-4 py-2.5 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all cursor-pointer hover:border-surface-border/80 text-sm"
          >
            <option value="">Brasil (Todos)</option>
            {states.map((state) => (
              <option key={`state-${state}`} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="flex-1 sm:flex-initial bg-surface border border-surface-border text-white rounded-xl px-4 py-2.5 outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all cursor-pointer hover:border-surface-border/80 text-sm"
          >
            <option value="">Todas as Regiões</option>
            {regions.map((region) => (
              <option key={`region-${region}`} value={region}>{region}</option>
            ))}
          </select>

          {(selectedState || selectedRegion) && (
            <button
              onClick={() => { setSelectedState(""); setSelectedRegion(""); }}
              className="text-xs sm:text-sm text-brand-cyan hover:text-white px-4 py-2 transition-colors font-medium sm:ml-auto"
            >
              ✕ Limpar filtros
            </button>
          )}
        </div>

        {/* Results Metadata */}
        {!loading && (
          <div className="mb-4 sm:mb-6 flex items-center gap-2 text-muted text-xs sm:text-sm px-2">
            <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
            Encontramos <span className="text-white font-semibold">{beaches.length}</span> {beaches.length === 1 ? "praia" : "praias"}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="glass-panel border-red-500/30 bg-red-500/5 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="text-red-400 text-xl sm:text-2xl mt-0 sm:mt-1 shrink-0">⚠️</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-red-400 font-semibold mb-1 text-sm sm:text-base">{error}</h3>
              <p className="text-muted text-xs sm:text-sm">Certifique-se de que a API está rodando em http://localhost:8000</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && !error && beaches.length === 0 && (
          <div className="glass-panel text-center py-16 sm:py-20 md:py-24 rounded-2xl sm:rounded-3xl border-dashed border-2 flex flex-col items-center justify-center px-4">
            <span className="text-3xl sm:text-4xl md:text-5xl mb-4 opacity-50">🏝️</span>
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Nenhuma praia encontrada</h3>
            <p className="text-sm sm:text-base text-muted max-w-md">Tente ajustar seus filtros para ver mais resultados.</p>
          </div>
        )}

        {/* Responsive Beaches Grid */}
        {!loading && !error && beaches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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

      {/* Responsive Footer */}
      <footer className="border-t border-surface-border bg-surface/30 backdrop-blur-md py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 order-1 md:order-1">
              <span className="text-xl">🌊</span>
              <span className="text-white font-bold tracking-tight">SwellWise</span>
            </div>
            <div className="text-xs sm:text-sm text-muted order-3 md:order-2">
              © 2026 SwellWise Labs. All rights reserved.
            </div>
            <div className="text-xs text-muted flex flex-wrap gap-3 sm:gap-4 justify-center order-2 md:order-3">
              <span className="whitespace-nowrap">Powered by Open-Meteo</span>
              <span className="whitespace-nowrap">AI by Groq</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
