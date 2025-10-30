import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { userAtom } from "@/atoms/auth";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";

export function useUserWorkingPattern() {
    const [user] = useAtom(userAtom);
  
  const query = useQuery({
    queryKey: ["userWP", user?.id],
    queryFn: async (): Promise<IWorkingPattern> => {
      if (!user?.id) {
        throw new Error("User ID no disponible");
      }

      const response = await fetch(`/api/config/user/WP/${user.id}`, {
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

  const userWorkingPattern = query.data;
  const loading = query.isLoading;
  const error = query.error ? "Error al cargar los datos de horarios del usuario" : null;

  return {
    userWorkingPattern,
    loading,
    error,
    refetch: query.refetch,
    isCached: !!userWorkingPattern,
  };
}
