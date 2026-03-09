// Loading Spinner Component
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[var(--ocean-blue)] border-t-[var(--ocean-light)] rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-[var(--ocean-mist)]">
          Carregando...
        </div>
      </div>
    </div>
  );
}
