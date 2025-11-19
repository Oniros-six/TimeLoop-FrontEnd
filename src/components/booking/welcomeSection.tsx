import { Button } from "../ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCommerceName } from "@/hooks/commerce/useCommerceName";
import { Skeleton } from "../ui/skeleton";
import { useCommerceConfigs } from "@/hooks/configs/commerce/useCommerceConfig";

function WelcomeContent({ commerceName }: { commerceName: string }) {
  const { commerce, loading, error } = useCommerceName(commerceName);
  const {commerceConfig} = useCommerceConfigs(commerce?.id);
  const commerceLogo = commerce?.logo === "" ? "https://res.cloudinary.com/dsnt2xrb9/image/upload/v1759200427/timeloop/Timeloop_logo.png" : commerce?.logo;
  
  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-10 w-40" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        </div>
      ) : commerce ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 mt-20">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white">
            <img src={commerceLogo} alt={commerce.name} width={80} height={80} />
          </div>

          <h1 className="text-4xl font-bold text-center">{commerce.name}</h1>

          <p className="text-lg text-muted-foreground text-center max-w-md">
            {commerceConfig?.welcomeMessage ?? "Bienvenido a nuestro salón. Reserva tu cita de forma fácil y rápida en solo unos pasos."}
          </p>

          <a href={`/${commerce.uniqueName}/reserva`}>
            <Button size="lg" className="mt-4">
              Comenzar Reserva
            </Button>
          </a>
        </div>
      ) : null}
    </>
  );
}

export default function WelcomeSection({ commerceName }: { commerceName: string }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeContent commerceName={commerceName} />
    </QueryClientProvider>
  );
}