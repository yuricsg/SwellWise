"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header 
      className="fixed w-full top-0 z-50 border-b border-surface-border/50 backdrop-blur-xl shadow-lg shadow-black/20" 
      style={{ backgroundColor: 'rgba(6, 17, 33, 0.85)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-blue/10 border border-brand-cyan/20 group-hover:border-brand-cyan/50 transition-colors">
              <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform">🌊</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-brand-cyan transition-colors">
              SwellWise
            </h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-brand-cyan transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border/50 animate-fade-in" style={{ backgroundColor: 'rgba(6, 17, 33, 0.95)' }}>
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link
              href="/"
              className="text-white hover:text-brand-cyan transition-colors py-2 px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explorar Praias
            </Link>
            <Link
              href="/about"
              className="text-muted hover:text-white transition-colors py-2 px-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
