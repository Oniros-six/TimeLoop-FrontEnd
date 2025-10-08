import { useState } from "react";
import type { IService } from "@/interfaces/Service";

export function useServiceDialogs() {
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const openDetailsDialog = (service: IService) => {
    setSelectedService(service);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedService(null);
  };

  const openDeleteDialog = (service: IService) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
  };

  const openUpdateDialog = (service: IService) => {
    setSelectedService(service);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedService(null);
  };

  return {
    selectedService,
    isDetailsDialogOpen,
    isDeleteDialogOpen,
    isUpdateDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    openDeleteDialog,
    closeDeleteDialog,
    openUpdateDialog,
    closeUpdateDialog,
    setIsDetailsDialogOpen,
    setIsDeleteDialogOpen,
    setIsUpdateDialogOpen,
  };
}
