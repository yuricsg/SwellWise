'use client';

import Link from 'next/link';
import { Waves, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground tracking-tight">SwellWise</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Explorar', 'Previsões', 'API', 'Sobre'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
              Entrar
            </button>
            <button className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Começar Grátis
            </button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-card/60 backdrop-blur-xl border-t border-border/50 px-4 pb-4 pt-2 space-y-2">
          {['Explorar', 'Previsões', 'API', 'Sobre'].map((item) => (
            <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground py-2">
              {item}
            </a>
          ))}
          <button className="w-full text-sm font-medium bg-primary text-primary-foreground px-4 py-2.5 rounded-lg mt-2">
            Começar Grátis
          </button>
        </div>
      )}
    </nav>
  );
}
