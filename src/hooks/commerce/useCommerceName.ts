import { useQuery } from "@tanstack/react-query";
import type { ICommerce } from "@/interfaces/Commerce";

export function useCommerceName(commerceName: string) {

  const query = useQuery({
    queryKey: ["commerceName", commerceName],
    queryFn: async (): Promise<ICommerce> => {
      const response = await fetch(`/api/commerce/byUniqueName/${commerceName}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    },
    enabled: !!commerceName,
    retry: 2,
  });

  const loading = query.isLoading;
  const error = query.error ? "Error al cargar los datos del comercio" : null;

  return {
    commerce: query.data,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!query.data,
  };
}
