import { useState } from "react";
import { useCancelBooking } from "./useCancelBooking";

export function useBookingActions(refetchBookings: () => void, onSuccess?: () => void) {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const cancelBooking = useCancelBooking();

  const clearDeleteError = () => setDeleteErrorMessage(null);

  const handleCancel = (bookingId: number, customerId: number, commerceId: number) => {
    cancelBooking.mutate(
      { bookingId, commerceId, customerId },
      {
        onSuccess: () => {
          setDeleteErrorMessage(null);
          refetchBookings();
          onSuccess?.(); // Cerrar el diálogo cuando la operación sea exitosa
        },
        onError: (error) => {
          console.error("Error al cancelar la reserva:", error);
          setDeleteErrorMessage(
            error instanceof Error ? error.message : "Error al cancelar la reserva"
          );
        },
      }
    );
  };
  return {
    deleteErrorMessage,
    clearDeleteError,
    isDeletePending: cancelBooking.isPending,
    handleCancel
  };
}
