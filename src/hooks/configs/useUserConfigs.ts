import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { useQuery } from "@tanstack/react-query";
import type { IUserConfig } from "@/interfaces/Config";

export function useUserConfigs() {
  const [user] = useAtom(userAtom);

  const query = useQuery({
    queryKey: ["userConfig", user?.id],
    queryFn: async (): Promise<IUserConfig> => {
      if (!user?.id) {
        throw new Error("User ID no disponible");
      }

      const response = await fetch(`/api/config/user/${user.id}`, {
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
    enabled: !!user?.id, // Solo fetch si hay user ID
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2,
  });

  const userConfig = query.data;
  const loading = query.isLoading;
  const error = query.error ? "Error al cargar los datos de configuracion de usuario" : null;

  return {
    userConfig,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!userConfig,
  };
}
