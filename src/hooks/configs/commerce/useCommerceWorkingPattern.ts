import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { commerceAtom } from "@/atoms/commerce";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";

export function useCommerceWorkingPattern(commerceId?: string | number) {
    const [commerce] = useAtom(commerceAtom);
    
    // Usar el commerceId proporcionado o el del atom
    const finalCommerceId = commerceId ?? commerce?.id;
  
  const query = useQuery({
    queryKey: ["commerceWP", finalCommerceId],
    queryFn: async (): Promise<IWorkingPattern[]> => {
      if (!finalCommerceId) {
        throw new Error("Commerce ID no disponible");
      }

      const response = await fetch(`/api/config/commerce/WP/${finalCommerceId}`, {
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
    enabled: !!finalCommerceId, // Solo fetch si hay commerce ID
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2,
  });

  const commerceWorkingPattern = query.data;
  const loading = query.isLoading;
  const error = query.error ? "Error al cargar los datos de horarios del comercio" : null;

  return {
    commerceWorkingPattern,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!commerceWorkingPattern,
  };
}
