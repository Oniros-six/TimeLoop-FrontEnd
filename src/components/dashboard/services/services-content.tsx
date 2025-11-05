import { userAtom } from "@/atoms/auth"
import { viewAtom } from "@/atoms/view"
import { useServices } from "@/hooks/services/useServices"
import { useUsers } from "@/hooks/users/useUsers"
import { useServiceDialogs } from "@/hooks/services/useServiceDialogs"
import { useServiceActions } from "@/hooks/services/useServiceActions"
import type { IService } from "@/interfaces/Service"
import { UserRole, type IUser } from "@/interfaces/User"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import ServiceDetailsDialog from "./ServiceDetailsDialog"
import DeleteServiceDialog from "./DeleteServiceDialog"
import UpdateServiceDialog from "./UpdateServiceDialog"
import CreateServiceDialog from "./CreateServiceDialog"
import { ServicesHeader } from "./ServicesHeader"
import { ServicesLoading } from "./ServicesLoading"
import { ServicesError } from "./ServicesError"
import { ServicesEmpty } from "./ServicesEmpty"
import { ServicesGrid } from "./ServicesGrid"

export function ServicesContent() {
  //* Seteamos el nombre de la vista
  const [, setView] = useAtom(viewAtom);
  const [currentUser] = useAtom(userAtom);

  useEffect(() => {
    setView("Servicios");
  }, [setView]);

  //* Estado relacionado al listado de servicios
  const [selectedUser, setSelectedUser] = useState<IUser | null>(currentUser || null);

  //* Verificamos si el usuario actual es administrador
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  //* Hooks para obtener datos
  const usersHook = useUsers();
  const { services, loading: loadingServices, error: errorServices, refetch: refetchServices } = useServices(selectedUser?.id);

  //* Hooks personalizados para manejar lógica
  const dialogs = useServiceDialogs();
  const actions = useServiceActions(refetchServices, dialogs.closeDeleteDialog);
  const updateActions = useServiceActions(refetchServices, dialogs.closeUpdateDialog);
  const createActions = useServiceActions(refetchServices, dialogs.closeCreateDialog);

  //* Handlers para acciones
  const handleCreateService = () => {
    dialogs.openCreateDialog();
  };

  const handleServiceDetailsClick = (service: IService) => {
    dialogs.openDetailsDialog(service);
  };

  const handleDelete = (service: IService) => {
    dialogs.openDeleteDialog(service);
  };

  const handleUpdate = (service: IService) => {
    updateActions.initializeUpdateForm(service);
    dialogs.openUpdateDialog(service);
  };

  const confirmDeletion = () => {
    if (!dialogs.selectedService) return;
    actions.handleDelete(dialogs.selectedService.id);
  };

  const confirmUpdate = () => {
    if (!dialogs.selectedService) return;
    updateActions.handleUpdate(dialogs.selectedService.id, updateActions.updateForm);
  };

  const confirmCreate = (formData: any) => {
    if (!selectedUser || !currentUser) return;
    createActions.handleCreate(formData, currentUser.commerceId, selectedUser.id);
  };

  //* Renderizado condicional basado en el estado
  if (loadingServices) {
    return (
      <>
        <ServicesHeader
          isAdmin={isAdmin}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          currentUser={currentUser}
          users={usersHook.users}
          onCreateService={handleCreateService}
        />
        <ServicesLoading />

        {/* Modales */}
        <CreateServiceDialog
          open={dialogs.isCreateDialogOpen}
          onOpenChange={dialogs.setIsCreateDialogOpen}
          onConfirm={confirmCreate}
          isPending={createActions.isCreatePending}
          errorMessage={createActions.createErrorMessage}
          onClearError={createActions.clearCreateError}
          createForm={createActions.createForm}
          setCreateForm={createActions.setCreateForm}
        />
      </>
    );
  }

  if (errorServices) {
    return (
      <>
        <ServicesHeader
          isAdmin={isAdmin}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          currentUser={currentUser}
          users={usersHook.users}
          onCreateService={handleCreateService}
        />
        <ServicesError error={errorServices} onRetry={refetchServices} />

        {/* Modales */}
        <CreateServiceDialog
          open={dialogs.isCreateDialogOpen}
          onOpenChange={dialogs.setIsCreateDialogOpen}
          onConfirm={confirmCreate}
          isPending={createActions.isCreatePending}
          errorMessage={createActions.createErrorMessage}
          onClearError={createActions.clearCreateError}
          createForm={createActions.createForm}
          setCreateForm={createActions.setCreateForm}
        />
      </>
    );
  }

  if (services.length === 0) {
    return (
      <>
        <ServicesHeader
          isAdmin={isAdmin}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          currentUser={currentUser}
          users={usersHook.users}
          onCreateService={handleCreateService}
        />
        <ServicesEmpty
          selectedUser={selectedUser}
          currentUser={currentUser}
          onCreateService={handleCreateService}
        />

        {/* Modales */}
        <CreateServiceDialog
          open={dialogs.isCreateDialogOpen}
          onOpenChange={dialogs.setIsCreateDialogOpen}
          onConfirm={confirmCreate}
          isPending={createActions.isCreatePending}
          errorMessage={createActions.createErrorMessage}
          onClearError={createActions.clearCreateError}
          createForm={createActions.createForm}
          setCreateForm={createActions.setCreateForm}
        />
      </>
    );
  }

  return (
    <>
      <ServicesHeader
        isAdmin={isAdmin}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        currentUser={currentUser}
        users={usersHook.users}
        onCreateService={handleCreateService}
      />

      {usersHook.loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      ) : (
        <ServicesGrid
          services={services}
          currentUser={currentUser}
          onServiceClick={handleServiceDetailsClick}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      {/* Modales */}
      <ServiceDetailsDialog
        isDialogOpen={dialogs.isDetailsDialogOpen}
        setIsDialogOpen={dialogs.setIsDetailsDialogOpen}
        selectedService={dialogs.selectedService}
        handleCloseDialog={dialogs.closeDetailsDialog}
      />

      <DeleteServiceDialog
        open={dialogs.isDeleteDialogOpen}
        onOpenChange={dialogs.setIsDeleteDialogOpen}
        onConfirm={confirmDeletion}
        isPending={actions.isDeletePending}
        errorMessage={actions.deleteErrorMessage}
        onClearError={actions.clearDeleteError}
        service={dialogs.selectedService}
      />

      <UpdateServiceDialog
        open={dialogs.isUpdateDialogOpen}
        onOpenChange={dialogs.setIsUpdateDialogOpen}
        onConfirm={confirmUpdate}
        isPending={updateActions.isUpdatePending}
        errorMessage={updateActions.updateErrorMessage}
        onClearError={updateActions.clearUpdateError}
        service={dialogs.selectedService}
        updateForm={updateActions.updateForm}
        setUpdateForm={updateActions.setUpdateForm}
      />

      <CreateServiceDialog
        open={dialogs.isCreateDialogOpen}
        onOpenChange={dialogs.setIsCreateDialogOpen}
        onConfirm={confirmCreate}
        isPending={createActions.isCreatePending}
        errorMessage={createActions.createErrorMessage}
        onClearError={createActions.clearCreateError}
        createForm={createActions.createForm}
        setCreateForm={createActions.setCreateForm}
      />
    </>
  );
}