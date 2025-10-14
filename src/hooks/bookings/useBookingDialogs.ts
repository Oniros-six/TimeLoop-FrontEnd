import { useState } from "react";
import type { IBooking } from "@/interfaces/Booking";

export function useBookingDialogs() {
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  // const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openDetailsDialog = (booking: IBooking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedBooking(null);
  };
  const closeConfirmationDialog = () => {
    setCancelDialogOpen(false);
  };


  // const closeDeleteDialog = () => {
  //   setIsDeleteDialogOpen(false);
  //   setSelectedBooking(null);
  // };

  // const openUpdateDialog = (booking: IBooking) => {
  //   setSelectedBooking(booking);
  //   setIsUpdateDialogOpen(true);
  // };

  // const closeUpdateDialog = () => {
  //   setIsUpdateDialogOpen(false);
  //   setSelectedBooking(null);
  // };

  // const openCreateDialog = () => {
  //   setIsCreateDialogOpen(true);
  // };

  // const closeCreateDialog = () => {
  //   setIsCreateDialogOpen(false);
  // };

  return {
    selectedBooking,
    isDetailsDialogOpen,
    cancelDialogOpen,
    // isUpdateDialogOpen,
    // isCreateDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    closeConfirmationDialog,
    // openUpdateDialog,
    // closeUpdateDialog,
    // openCreateDialog,
    // closeCreateDialog,
    setIsDetailsDialogOpen,
    setCancelDialogOpen,
    // setIsUpdateDialogOpen,
    // setIsCreateDialogOpen,
  };
}
