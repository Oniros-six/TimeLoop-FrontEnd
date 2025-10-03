import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { useQuery } from "@tanstack/react-query";
import type { IUser } from "@/interfaces/User";

export function useUsers() {
  const [user] = useAtom(userAtom);

  const query = useQuery({
    queryKey: ["users", user?.commerceId], // clave única para el caché
    queryFn: async (): Promise<IUser[]> => {
      if (!user?.commerceId) {
        return [];
      }

      const response = await fetch(`/api/users/${user.commerceId}`, {
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
    enabled: !!user?.commerceId, // no se ejecuta si no hay commerceId
  });

  return {
    users: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Error al cargar los usuarios" : null,
    refetch: query.refetch, // opcional: para volver a cargar
  };
}
