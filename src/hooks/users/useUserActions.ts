import { useState } from "react";
import { useCreateUser } from "./useCreateUser";
import { useChangeRol } from "./useChangeRol";
import { useChangeStatus } from "./useChangeStatus";
import { UserRole } from "@/interfaces/User";

interface CreateUserData {
  commerceId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export function useUserActions(refetchUsers: () => void, onSuccess?: () => void) {
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [roleErrorMessage, setRoleErrorMessage] = useState<string | null>(null);
  const [statusErrorMessage, setStatusErrorMessage] = useState<string | null>(null);

  const createUser = useCreateUser();
  const changeRole = useChangeRol();
  const changeStatus = useChangeStatus();

  const handleCreate = (userData: CreateUserData) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        setCreateErrorMessage(null);
        refetchUsers();
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Error al crear el usuario:", error);
        setCreateErrorMessage(
          error instanceof Error ? error.message : "Error al crear el usuario"
        );
      },
    });
  };

  const handleChangeRole = (userId: number, newRole: UserRole) => {
    changeRole.mutate(
      { userId, newRole },
      {
        onSuccess: () => {
          setRoleErrorMessage(null);
          refetchUsers();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error al cambiar el rol:", error);
          setRoleErrorMessage(
            error instanceof Error ? error.message : "Error al cambiar el rol del usuario"
          );
        },
      }
    );
  };

  const handleChangeStatus = (userId: number, active: boolean) => {
    changeStatus.mutate(
      { userId, active },
      {
        onSuccess: () => {
          setStatusErrorMessage(null);
          refetchUsers();
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error al cambiar el estado del usuario:", error);
          setStatusErrorMessage(
            error instanceof Error ? error.message : "Error al cambiar el estado del usuario"
          );
        },
      }
    );
  };

  const clearCreateError = () => setCreateErrorMessage(null);
  const clearRoleError = () => setRoleErrorMessage(null);
  const clearStatusError = () => setStatusErrorMessage(null);

  return {
    handleCreate,
    handleChangeRole,
    handleChangeStatus,
    createErrorMessage,
    roleErrorMessage,
    statusErrorMessage,
    clearCreateError,
    clearRoleError,
    clearStatusError,
    isCreatePending: createUser.isPending,
    isRolePending: changeRole.isPending,
    isStatusPending: changeStatus.isPending,
  };
}
