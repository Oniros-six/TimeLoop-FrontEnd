import { useState } from "react";
import { useDeleteService } from "./useDeleteService";
import { useUpdateService } from "./useUpdateService";
import { useCreateService } from "./useCreateService";
import type { IService } from "@/interfaces/Service";

interface CreateServiceForm {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export function useServiceActions(refetchServices: () => void, onSuccess?: () => void) {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState<IService | null>(null);
  const [createForm, setCreateForm] = useState<CreateServiceForm>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    durationMinutes: 0
  });

  const deleteService = useDeleteService();
  const updateService = useUpdateService();
  const createService = useCreateService();

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

  const handleCreate = (formData: CreateServiceForm, commerceId: number, userId: number) => {
    createService.mutate(
      {
        commerceId,
        userId,
        ...formData
      },
      {
        onSuccess: () => {
          setCreateErrorMessage(null);
          setCreateForm({
            id: 0,
            name: '',
            description: '',
            price: 0,
            durationMinutes: 0
          });
          refetchServices();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error al crear el servicio:", error);
          setCreateErrorMessage(
            error instanceof Error ? error.message : "Error al crear el servicio"
          );
        },
      }
    );
  };

  const clearDeleteError = () => setDeleteErrorMessage(null);
  const clearUpdateError = () => setUpdateErrorMessage(null);
  const clearCreateError = () => setCreateErrorMessage(null);

  return {
    deleteErrorMessage,
    updateErrorMessage,
    createErrorMessage,
    updateForm,
    createForm,
    setUpdateForm,
    setCreateForm,
    initializeUpdateForm,
    handleDelete,
    handleUpdate,
    handleCreate,
    clearDeleteError,
    clearUpdateError,
    clearCreateError,
    isDeletePending: deleteService.isPending,
    isUpdatePending: updateService.isPending,
    isCreatePending: createService.isPending,
  };
}
