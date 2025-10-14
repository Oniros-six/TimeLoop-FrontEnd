import { useQuery } from "@tanstack/react-query";
import type { IBooking } from "@/interfaces/Booking";

export function useBookings(userId: number | undefined) {

    const query = useQuery({
        queryKey: ["bookings", userId], // clave única para el caché
        queryFn: async (): Promise<IBooking[]> => {
            const response = await fetch(`/api/bookings/${userId}`, {
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
        bookings: query.data ?? [],
        loading: query.isLoading,
        error: query.error ? "Error al cargar las reservas" : null,
        refetch: query.refetch, // opcional: para volver a cargar
    };
}
