'use client';

import { Compass, MapPin, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-slide-up">
          Descubra o melhor do{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">litoral brasileiro</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '150ms' }}>
          Inteligência artificial que analisa condições do mar, clima e ondas para encontrar a praia perfeita para você.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-glow">
            <Compass className="h-4 w-4" />
            Explorar Praias
          </button>
          <button className="flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 text-foreground font-medium px-6 py-3 rounded-xl hover:border-primary/30 transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            Ver no Mapa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '450ms' }}>
          {[
            { value: '100+', label: 'Praias' },
            { value: '26', label: 'Estados' },
            { value: '98%', label: 'Precisão' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
