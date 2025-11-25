import { Button } from "../ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCommerceName } from "@/hooks/commerce/useCommerceName";
import { Skeleton } from "../ui/skeleton";
import { useCommerceConfigs } from "@/hooks/configs/commerce/useCommerceConfig";
import { useCommerceWorkingPattern } from "@/hooks/configs/commerce/useCommerceWorkingPattern";
import { DAY_NAMES_SPANISH } from "@/components/dashboard/configs/working-pattern/constants";
import { AvailabilityType, WeekDays } from "@/interfaces/WorkingPattern";
import { Clock } from "lucide-react";

function WelcomeContent({ commerceName }: { commerceName: string }) {
  const { commerce, loading, error } = useCommerceName(commerceName);
  const {commerceConfig} = useCommerceConfigs(commerce?.id);
  const { commerceWorkingPattern, loading: loadingHours } = useCommerceWorkingPattern(commerce?.id);
  const commerceLogo = commerce?.logo === "" ? "https://res.cloudinary.com/dsnt2xrb9/image/upload/v1759200427/timeloop/Timeloop_logo.png" : commerce?.logo;

  const formatSchedule = (pattern: { availabilityType: AvailabilityType; morningStart?: string | null; morningEnd?: string | null; afternoonStart?: string | null; afternoonEnd?: string | null }) => {
    if (!pattern || pattern.availabilityType === AvailabilityType.off) {
      return "Cerrado";
    }

    const parts: string[] = [];
    
    if (pattern.morningStart && pattern.morningEnd) {
      parts.push(`${pattern.morningStart} - ${pattern.morningEnd}`);
    }
    
    if (pattern.afternoonStart && pattern.afternoonEnd) {
      parts.push(`${pattern.afternoonStart} - ${pattern.afternoonEnd}`);
    }
    
    return parts.join(" y ") || "Cerrado";
  };
  
  return (
    <>
      {/*//* === Estado de carga === */}
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
          {/*//* === Logo y nombre del comercio === */}
          <div className="w-30 md:w-35 lg:w-40 h-30 md:h-35 lg:h-40 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white">
            <img src={commerceLogo} alt={commerce.name} className="rounded-lg" />
          </div>

          <h1 className="text-4xl font-bold text-center">{commerce.name}</h1>

          {/*//* === Mensaje de bienvenida === */}
          <p className="text-lg text-muted-foreground text-center max-w-md">
            {commerceConfig?.welcomeMessage ?? "Bienvenido a nuestro salón. Reserva tu cita de forma fácil y rápida en solo unos pasos."}
          </p>

          {/*//* === Horarios de apertura === */}
          {commerceWorkingPattern && commerceWorkingPattern.length > 0 && (
            <div className="w-full max-w-md space-y-4 mt-6">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Horarios de trabajo</h2>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                {(() => {
                  const weekOrder: WeekDays[] = [WeekDays.MONDAY, WeekDays.TUESDAY, WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY, WeekDays.SATURDAY, WeekDays.SUNDAY];
                  
                  // Crear un mapa de patrones por día para búsqueda rápida
                  const patternsMap = new Map(
                    commerceWorkingPattern.map(pattern => [pattern.weekday, pattern])
                  );
                  
                  // Crear un array con todos los días de la semana, usando los patrones existentes o creando uno "cerrado"
                  const allDays = weekOrder.map(weekday => {
                    const pattern = patternsMap.get(weekday);
                    if (pattern) {
                      return pattern;
                    }
                    // Si no existe patrón para este día, crear uno "cerrado"
                    return {
                      weekday: weekday,
                      availabilityType: AvailabilityType.off,
                      morningStart: null,
                      morningEnd: null,
                      afternoonStart: null,
                      afternoonEnd: null
                    };
                  });
                  
                  return allDays.map((pattern) => (
                    <div key={pattern.weekday} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{DAY_NAMES_SPANISH[pattern.weekday]}:</span>
                      <span className="text-muted-foreground">{formatSchedule(pattern)}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/*//* === Botón de acción === */}
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

//* Componente principal exportado
export default function WelcomeSection({ commerceName }: { commerceName: string }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeContent commerceName={commerceName} />
    </QueryClientProvider>
  );
}