import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { commerceAtom } from "@/atoms/commerce";
import { useQuery } from "@tanstack/react-query";
import type { ICommerce } from "@/interfaces/Commerce";
import { useEffect } from "react";

export function useCommerce() {
  const [user] = useAtom(userAtom);
  const [cachedCommerce, setCachedCommerce] = useAtom(commerceAtom);

  const query = useQuery({
    queryKey: ["commerce", user?.commerceId],
    queryFn: async (): Promise<ICommerce> => {
      if (!user?.commerceId) {
        throw new Error("Commerce ID no disponible");
      }

      const response = await fetch(`/api/commerce/${user.commerceId}`, {
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
    enabled: !!user?.commerceId && !cachedCommerce, // Solo fetch si no está cacheado
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2,
  });

  // Actualizar el atom cuando se obtengan nuevos datos
  useEffect(() => {
    if (query.data && !cachedCommerce) {
      setCachedCommerce(query.data);
    }
  }, [query.data, cachedCommerce, setCachedCommerce]);

  // Retornar datos del cache si están disponibles, sino de la query
  const commerce = cachedCommerce || query.data;
  const loading = !cachedCommerce && query.isLoading;
  const error = query.error ? "Error al cargar los datos del comercio" : null;

  return {
    commerce,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!cachedCommerce,
  };
}
