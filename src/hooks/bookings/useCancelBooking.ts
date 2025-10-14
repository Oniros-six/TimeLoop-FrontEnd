import { useMutation } from "@tanstack/react-query";

interface CancelResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useCancelBooking() {

    return useMutation({
        mutationFn: async ({ bookingId, customerId, commerceId }: { bookingId: number, customerId: number, commerceId: number }) => {

            const response = await fetch(`/api/bookings/delete/${bookingId}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({customerId, commerceId}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as CancelResponse;
        },
    });
}
