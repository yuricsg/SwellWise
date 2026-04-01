'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass rounded-3xl text-center p-12 max-w-lg animate-fade-in">
        <div className="text-6xl mb-6 font-bold text-primary">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">A página que você procura não existe. Que tal explorar outras praias?</p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
