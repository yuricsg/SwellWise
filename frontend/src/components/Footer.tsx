'use client';

import Link from 'next/link';
import { Waves } from 'lucide-react';

export default function Footer() {
  const links = {
    Produto: ['Explorar', 'Previsões', 'API'],
    Recursos: ['Sobre', 'Blog', 'Contato'],
    Comunidade: ['Twitter', 'Instagram', 'Discord'],
  };

  return (
    <footer className="border-t border-border/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">SwellWise</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Inteligência artificial para descobrir o melhor do oceano brasileiro.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; 2024 SwellWise. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            {['Privacidade', 'Termos', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
