import { useState } from "react";
import type { IUser } from "@/interfaces/User";

export function useUserDialogs() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [isConfirmStatusDialogOpen, setIsConfirmStatusDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const openChangeRoleDialog = (user: IUser) => {
    setSelectedUser(user);
    setIsChangeRoleDialogOpen(true);
  };

  const closeChangeRoleDialog = () => {
    setIsChangeRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const openConfirmStatusDialog = (user: IUser) => {
    setSelectedUser(user);
    setIsConfirmStatusDialogOpen(true);
  };

  const closeConfirmStatusDialog = () => {
    setIsConfirmStatusDialogOpen(false);
    setSelectedUser(null);
  };

  return {
    selectedUser,
    isCreateDialogOpen,
    isChangeRoleDialogOpen,
    isConfirmStatusDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    openChangeRoleDialog,
    closeChangeRoleDialog,
    openConfirmStatusDialog,
    closeConfirmStatusDialog,
    setIsCreateDialogOpen,
    setIsChangeRoleDialogOpen,
    setIsConfirmStatusDialogOpen,
  };
}
