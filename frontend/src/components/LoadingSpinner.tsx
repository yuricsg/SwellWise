// Modern Loading Spinner Component
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-100 py-12">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-surface-border border-t-brand-cyan rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-brand-cyan rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-muted">Carregando praias...</p>
          <div className="flex gap-1 justify-center mt-2">
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
