import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { useQuery } from "@tanstack/react-query";
import type { IUser } from "@/interfaces/User";

export function useUsers(commerceId?: number | null) {
  const [user] = useAtom(userAtom);
  const targetCommerceId = commerceId ?? user?.commerceId;

  const query = useQuery({
    queryKey: ["users", targetCommerceId], // clave única para el caché
    queryFn: async (): Promise<IUser[]> => {
      if (!targetCommerceId) {
        return [];
      }

      const response = await fetch(`/api/users/byCommerce/${targetCommerceId}`, {
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
    enabled: !!targetCommerceId, // no se ejecuta si no hay commerceId
  });

  return {
    users: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Error al cargar los usuarios" : null,
    refetch: query.refetch, // opcional: para volver a cargar
  };
}
