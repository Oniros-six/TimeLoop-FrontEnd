import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import type { ICommerceConfig } from "@/interfaces/Config";
import { commerceAtom } from "@/atoms/commerce";

export function useCommerceConfigs() {
  const [commerce] = useAtom(commerceAtom);
  
  const query = useQuery({
    queryKey: ["commerce", commerce?.id],
    queryFn: async (): Promise<ICommerceConfig> => {
      if (!commerce?.id) {
        throw new Error("Commerce ID no disponible");
      }

      const response = await fetch(`/api/config/commerce/${commerce.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data;
    },
    enabled: !!commerce?.id, // Solo fetch si hay commerce ID
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2,
  });

  const commerceConfig = query.data;
  const loading = query.isLoading;
  const error = query.error ? "Error al cargar los datos de configuracion del comercio" : null;

  return {
    commerceConfig,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!commerceConfig,
  };
}
