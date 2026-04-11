'use client';

import Link from 'next/link';
import { Waves, Search, MapPin, X, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { beachService } from '@/services/api';
import type { Beach } from '@/types/beach';

const QUALITY_COLOR: Record<string, string> = {
  excellent: 'text-emerald-400',
  good: 'text-blue-400',
  fair: 'text-amber-400',
  poor: 'text-muted-foreground',
};

const QUALITY_LABEL: Record<string, string> = {
  excellent: 'Excelente',
  good: 'Boa',
  fair: 'Regular',
  poor: 'Tranquila',
};

export default function Navbar() {
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Beach[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false); // true → already fetched for this query
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search logic with debounce ──────────────────────────────
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      setDropdownOpen(false);
      return;
    }
    setIsSearching(true);
    setSearched(false);
    try {
      const data = await beachService.getBeaches({ search: q.trim(), limit: 8, offset: 0 });
      setResults(data.beaches);
      setSearched(true);
      setDropdownOpen(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setDropdownOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // ── Close dropdown on outside click ────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Navigate to beach page ──────────────────────────────────
  function handleSelect(beach: Beach) {
    setQuery('');
    setResults([]);
    setDropdownOpen(false);
    router.push(`/beach/${beach.id}`);
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
    setSearched(false);
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Waves className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">SwellWise</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Search bar (right side) ──────────────────────── */}
          <div className="relative w-72 md:w-80">
            <div className="relative flex items-center">
              {isSearching ? (
                <Loader2 className="absolute left-3 h-4 w-4 text-muted-foreground animate-spin pointer-events-none" />
              ) : (
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              )}

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (searched) setDropdownOpen(true); }}
                placeholder="Buscar praia..."
                className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* ── Dropdown ──────────────────────────── */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 left-0 right-0 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50 animate-fade-in"
              >
                {results.length > 0 ? (
                  <>
                    <p className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {results.length} praia{results.length !== 1 ? 's' : ''} encontrada{results.length !== 1 ? 's' : ''}
                    </p>
                    <ul>
                      {results.map((beach) => (
                        <li key={beach.id}>
                          <button
                            onClick={() => handleSelect(beach)}
                            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-primary/8 transition-colors text-left group"
                          >
                            <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 shrink-0">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {beach.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {beach.city}, {beach.state}
                                {beach.region && <span className="text-muted-foreground/50"> · {beach.region}</span>}
                              </p>
                            </div>
                            {beach.surf_quality && (
                              <span className={`text-[10px] font-semibold shrink-0 mt-0.5 ${QUALITY_COLOR[beach.surf_quality] ?? 'text-muted-foreground'}`}>
                                {QUALITY_LABEL[beach.surf_quality] ?? beach.surf_quality}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 py-2.5 border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground/50 text-center">
                        Pressione Enter ou clique para abrir a praia
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                    <span className="text-3xl">🏖️</span>
                    <p className="text-sm font-semibold text-foreground">Praia não existe no sistema</p>
                    <p className="text-xs text-muted-foreground">
                      Nenhuma praia encontrada para <span className="text-primary font-medium">"{query}"</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>



        </div>
      </div>
    </nav>
  );
}
