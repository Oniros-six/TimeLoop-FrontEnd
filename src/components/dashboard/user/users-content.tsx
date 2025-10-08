import { useState, useEffect, useMemo } from "react"
import { useAtom } from "jotai"
import { viewAtom } from "@/atoms/view"
import { userAtom } from "@/atoms/auth"
import { useUsers } from "@/hooks/users/useUsers"
import { useUserDialogs } from "@/hooks/users/useUserDialogs"
import { useUserActions } from "@/hooks/users/useUserActions"
import CreateUserDialog from "./CreateUserDialog"
import ChangeRoleDialog from "./ChangeRoleDialog"
import ConfirmStatusDialog from "./ConfirmStatusDialog"
import { UsersHeader } from "./UsersHeader"
import { UsersLoading } from "./UsersLoading"
import { UsersError } from "./UsersError"
import { UsersEmpty } from "./UsersEmpty"
import { UsersGrid } from "./UsersGrid"
import { UserRole } from "@/interfaces/User"

export function UsersContent() {
  //* Seteamos el nombre de la vista
  const [, setView] = useAtom(viewAtom);
  const [currentUser] = useAtom(userAtom);

  useEffect(() => {
    setView("Usuarios");
  }, [setView]);

  //* Estado relacionado al listado de usuarios
  const [showInactive, setShowInactive] = useState(false);

  //* Verificamos si el usuario actual es administrador
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  //* Hooks para obtener datos
  const { users, loading, error, refetch } = useUsers();

  //* Hooks personalizados para manejar lógica
  const dialogs = useUserDialogs();
  const actions = useUserActions(refetch, dialogs.closeCreateDialog);

  //* Filtrado de usuarios con useMemo para optimización
  const filteredUsers = useMemo(() => 
    users.filter((u) => (showInactive ? !u.active : u.active)),
    [users, showInactive]
  );

  //* Handlers para acciones
  const handleCreateUser = (userData: any) => {
    if (!currentUser?.commerceId) {
      console.error("No se pudo obtener el commerceId del usuario actual");
      return;
    }

    actions.handleCreate({
      commerceId: currentUser.commerceId,
      ...userData
    });
  };

  const handleRoleChange = (user: any) => {
    // Validación: No permitir que un usuario cambie su propio rol
    if (currentUser && currentUser.id === user.id) {
      return;
    }

    const newRole = user.role === UserRole.ADMIN ? UserRole.EMPLOYEE : UserRole.ADMIN;
    actions.handleChangeRole(user.id, newRole);
    dialogs.closeChangeRoleDialog();
  };

  const handleStatusToggle = (user: any) => {
    // Validación: No permitir que un usuario se suspenda a sí mismo
    if (currentUser && currentUser.id === user.id && user.active) {
      return;
    }

    actions.handleChangeStatus(user.id, !user.active);
    dialogs.closeConfirmStatusDialog();
  };

  //* Renderizado condicional basado en el estado
  if (loading) {
    return (
      <>
        <UsersHeader
          isAdmin={isAdmin}
          showInactive={showInactive}
          onToggleInactive={() => setShowInactive(!showInactive)}
          onCreateUser={dialogs.openCreateDialog}
          usersCount={0}
        />
        <UsersLoading />
      </>
    );
  }

  if (error) {
    return (
      <>
        <UsersHeader
          isAdmin={isAdmin}
          showInactive={showInactive}
          onToggleInactive={() => setShowInactive(!showInactive)}
          onCreateUser={dialogs.openCreateDialog}
          usersCount={0}
        />
        <UsersError error={error} onRetry={refetch} />
      </>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <>
        <UsersHeader
          isAdmin={isAdmin}
          showInactive={showInactive}
          onToggleInactive={() => setShowInactive(!showInactive)}
          onCreateUser={dialogs.openCreateDialog}
          usersCount={0}
        />
        <UsersEmpty 
          showInactive={showInactive} 
          onCreateUser={dialogs.openCreateDialog} 
        />
      </>
    );
  }

  return (
    <>
      <UsersHeader
        isAdmin={isAdmin}
        showInactive={showInactive}
        onToggleInactive={() => setShowInactive(!showInactive)}
        onCreateUser={dialogs.openCreateDialog}
        usersCount={filteredUsers.length}
      />

      <UsersGrid
        users={filteredUsers}
        currentUser={currentUser}
        onRoleChange={dialogs.openChangeRoleDialog}
        onStatusToggle={dialogs.openConfirmStatusDialog}
        isStatusPending={actions.isStatusPending}
      />

      {/* Diálogos */}
      <CreateUserDialog
        open={dialogs.isCreateDialogOpen}
        onOpenChange={dialogs.setIsCreateDialogOpen}
        onConfirm={handleCreateUser}
        isPending={actions.isCreatePending}
        errorMessage={actions.createErrorMessage}
        onClearError={actions.clearCreateError}
      />

      <ChangeRoleDialog
        open={dialogs.isChangeRoleDialogOpen}
        onOpenChange={dialogs.setIsChangeRoleDialogOpen}
        selectedUser={dialogs.selectedUser}
        onConfirm={handleRoleChange}
        isPending={actions.isRolePending}
        errorMessage={actions.roleErrorMessage}
        onClearError={actions.clearRoleError}
      />

      <ConfirmStatusDialog
        open={dialogs.isConfirmStatusDialogOpen}
        onOpenChange={dialogs.setIsConfirmStatusDialogOpen}
        user={dialogs.selectedUser}
        onConfirm={handleStatusToggle}
        isPending={actions.isStatusPending}
        errorMessage={actions.statusErrorMessage}
        onClearError={actions.clearStatusError}
      />
    </>
  );
}
