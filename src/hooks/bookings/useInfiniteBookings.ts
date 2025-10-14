import { useInfiniteQuery } from "@tanstack/react-query";
import type { IBooking, BookingsPage } from "@/interfaces/Booking";

interface UseInfiniteBookingsProps {
    userId: number | undefined;
    limit?: number;
}

export function useInfiniteBookings({ userId, limit = 10 }: UseInfiniteBookingsProps) {
    const query = useInfiniteQuery({
        queryKey: ["bookings", "infinite", userId, limit],
        queryFn: async ({ pageParam }): Promise<BookingsPage> => {
            const params = new URLSearchParams({
                limit: limit.toString(),
            });

            if (pageParam) {
                params.set('cursor', pageParam);
            }

            const response = await fetch(`/api/bookings/${userId}?${params.toString()}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || `Error ${response.status}: ${response.statusText}`
                );
            }

            const responseData = await response.json();
            
            const bookingsData = responseData.data;
            
            return {
                data: bookingsData.items ?? [],
                hasNextPage: bookingsData.hasNextPage ?? false,
                nextCursor: bookingsData.nextCursor
            };
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasNextPage ? lastPage.nextCursor?.toString() : undefined;
        },
        initialPageParam: undefined as string | undefined,
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
    
    // Aplanar todas las páginas en una sola lista
    const allBookings: IBooking[] = query.data?.pages.flatMap(page => page.data) ?? [];
    return {
        bookings: allBookings,
        loading: query.isLoading,
        error: query.error ? "Error al cargar las reservas" : null,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
        refetch: query.refetch,
    };
}
