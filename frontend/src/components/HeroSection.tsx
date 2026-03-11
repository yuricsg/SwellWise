export default function HeroSection() {
  return (
    <section 
      className="pb-12 sm:pb-16 md:pb-20 px-4 relative overflow-hidden"
      style={{ paddingTop: 'clamp(140px, 15vh + 80px, 240px)' }}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 sm:w-175 md:w-200 h-75 sm:h-100 md:h-125 bg-brand-blue/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: "0ms" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
          </span>
          Condições em Tempo Real
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-tight animate-fade-in px-4" style={{ animationDelay: "100ms" }}>
          A previsão <span className="text-gradient-glow font-black">perfeita</span><br className="hidden sm:block" /> <span className="sm:hidden"> </span>para o seu oceano.
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-muted mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in px-4 leading-relaxed" style={{ animationDelay: "200ms" }}>
          Inteligência Artificial avançada analisando dados meteorológicos e oceânicos para você encontrar as melhores ondas e praias do Brasil.
        </p>
      </div>
    </section>
  );
}
