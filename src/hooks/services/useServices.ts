import { useQuery } from "@tanstack/react-query";
import type { IService } from "@/interfaces/Service";

export function useServices(userId: number | undefined) {

    const query = useQuery({
        queryKey: ["services", userId], // clave única para el caché
        queryFn: async (): Promise<IService[]> => {
            const response = await fetch(`/api/services/${userId}`, {
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
        enabled: !!userId, // no se ejecuta si no hay userId
    });

    return {
        services: query.data ?? [],
        loading: query.isLoading,
        error: query.error ? "Error al cargar los servicios" : null,
        refetch: query.refetch, // opcional: para volver a cargar
    };
}
