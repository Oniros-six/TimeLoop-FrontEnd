import { Button } from "@/components/ui/button";

interface UsersErrorProps {
  error: string;
  onRetry: () => void;
}

export function UsersError({ error, onRetry }: UsersErrorProps) {
  return (
    <div className="flex h-[98vh] w-full items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
