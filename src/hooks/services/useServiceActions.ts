import { useState } from "react";
import { useDeleteService } from "./useDeleteService";
import { useUpdateService } from "./useUpdateService";
import type { IService } from "@/interfaces/Service";

export function useServiceActions(refetchServices: () => void, onSuccess?: () => void) {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState<IService | null>(null);

  const deleteService = useDeleteService();
  const updateService = useUpdateService();

  // Función para inicializar el formulario de edición
  const initializeUpdateForm = (service: IService) => {
    setUpdateForm({ ...service });
  };

  const handleDelete = (serviceId: number) => {
    deleteService.mutate(
      { serviceId },
      {
        onSuccess: () => {
          setDeleteErrorMessage(null);
          refetchServices();
          onSuccess?.(); // Cerrar el diálogo cuando la operación sea exitosa
        },
        onError: (error) => {
          console.error("Error al eliminar el servicio:", error);
          setDeleteErrorMessage(
            error instanceof Error ? error.message : "Error al eliminar el servicio"
          );
        },
      }
    );
  };

  const handleUpdate = (serviceId: number, data: IService | null) => {
    if (!data) {
      setUpdateErrorMessage("No hay datos para actualizar");
      return;
    }

    updateService.mutate(
      { serviceId, data },
      {
        onSuccess: () => {
          setUpdateErrorMessage(null);
          setUpdateForm(null); // Limpiar el formulario después de éxito
          refetchServices();
          onSuccess?.(); // Cerrar el diálogo cuando la operación sea exitosa
        },
        onError: (error) => {
          console.error("Error al actualizar información del servicio:", error);
          setUpdateErrorMessage(
            error instanceof Error ? error.message : "Error al actualizar información del servicio"
          );
        },
      }
    );
  };

  const clearDeleteError = () => setDeleteErrorMessage(null);
  const clearUpdateError = () => setUpdateErrorMessage(null);

  return {
    deleteErrorMessage,
    updateErrorMessage,
    updateForm,
    setUpdateForm,
    initializeUpdateForm,
    handleDelete,
    handleUpdate,
    clearDeleteError,
    clearUpdateError,
    isDeletePending: deleteService.isPending,
    isUpdatePending: updateService.isPending,
  };
}
