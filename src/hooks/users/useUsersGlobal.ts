import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { usersAtom } from "@/atoms/users";
import { useQuery } from "@tanstack/react-query";
import type { IUser } from "@/interfaces/User";
import { useEffect } from "react";

export function useUsersGlobal() {
  const [currentUser] = useAtom(userAtom);
  const [cachedUsers, setCachedUsers] = useAtom(usersAtom);

  const query = useQuery({
    queryKey: ["users", currentUser?.commerceId],
    queryFn: async (): Promise<IUser[]> => {
      if (!currentUser?.commerceId) {
        throw new Error("Commerce ID no disponible");
      }

      const response = await fetch(`/api/users/byCommerce/${currentUser.commerceId}`, {
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
      return data.data ?? [];
    },
    enabled: !!currentUser?.commerceId && cachedUsers.length === 0, // Solo fetch si no están cacheados
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2,
  });

  // Actualizar el atom cuando se obtengan nuevos datos
  useEffect(() => {
    if (query.data && cachedUsers.length === 0) {
      setCachedUsers(query.data);
    }
  }, [query.data, cachedUsers.length, setCachedUsers]);

  // Retornar datos del cache si están disponibles, sino de la query
  const users = cachedUsers.length > 0 ? cachedUsers : (query.data ?? []);
  const loading = cachedUsers.length === 0 && query.isLoading;
  const error = query.error ? "Error al cargar los usuarios" : null;

  return {
    users,
    loading,
    error,
    refetch: query.refetch,
    isCached: cachedUsers.length > 0,
  };
}
