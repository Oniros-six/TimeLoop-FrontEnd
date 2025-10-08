interface ServicesErrorProps {
  error: string;
  onRetry: () => void;
}

export function ServicesError({ error, onRetry }: ServicesErrorProps) {
  return (
    <div className="flex h-[98vh] w-full self-center items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
