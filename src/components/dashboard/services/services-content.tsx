import { userAtom } from "@/atoms/auth"
import { viewAtom } from "@/atoms/view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useServices } from "@/hooks/services/useServices"
import { useUsers } from "@/hooks/users/useUsers"
import type { IService } from "@/interfaces/Service"
import { UserRole, type IUser } from "@/interfaces/User"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import ServiceCard from "./ServiceCard"
import ServiceDetailsDialog from "./ServiceDetailsDialog"
import UserSelector from "./UserSelector"
import DeleteServiceDialog from "./DeleteServiceDialog"
import UpdateServiceDialog from "./UpdateServiceDialog"
import { useDeleteService } from "@/hooks/services/useDeleteService"
import { useUpdateService } from "@/hooks/services/useUpdateService"

export function ServicesContent() {
  //* Seteamos el nombre de la vista
  const [, setView] = useAtom(viewAtom);

  //* Obtenemos el usuario logueado para verificar permisos
  const [currentUser] = useAtom(userAtom);

  useEffect(() => {
    setView("Servicios");
  }, [setView]);

  //* Estados para manejar errores
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null)

  //* Estados relacionados al dialog de detalles
  const [selectedService, setSelectedService] = useState<IService | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  //* Estados relacionados al dialog de opciones
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  //* Estado relacionado al listado de servicios
  const [selectedUser, setSelectedUser] = useState<IUser | null>(currentUser || null)

  //* Estado relacionado a la edicion del servicio
  const [updateForm, setUpdateForm] = useState<IService | null>(selectedService)

  //* Dialog relacionado a los detalles del servicio
  const handleServiceDetailsClick = (service: IService) => {
    setSelectedService(service)
    setIsDetailsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false)
    setTimeout(() => setSelectedService(null), 200)
  }
  //* =============================================

  //* Verificamos si el usuario actual es administrador
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  //* Llamamos al hook responsable de obtener el array de usaurios del comercio
  const usersHook = useUsers();

  //* Llamamos al hook responsable de obtener el array de servicios del usuario seleccionado
  const { services, loading: loadingServices, error: errorServices, refetch: refetchServices } = useServices(selectedUser?.id);

  //* Funcion para editar
  const updateService = useUpdateService();

  const handleUpdate = (service: IService) => {
    setSelectedService(service)
    setIsUpdateDialogOpen(true)
  }

  const confirmUpdate = () => {
    if (!selectedService) return;

    updateService.mutate(
      { serviceId: selectedService.id, data: updateForm },
      {
        onSuccess: () => {
          setUpdateErrorMessage(null); // Limpiar cualquier error previo
          setIsUpdateDialogOpen(false);
          setSelectedService(null);
          refetchServices();
        },
        onError: (error) => {
          console.error("Error al actualizar informacion del servicio:", error);
          setUpdateErrorMessage(error instanceof Error ? error.message : "Error al actualizar informacion del servicio");
        }
      }
    );
  }
  //* =============================================

  //* Funcion para eliminar
  const deleteService = useDeleteService();

  const handleDelete = (service: IService) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletion = () => {
    if (!selectedService) return;

    deleteService.mutate(
      { serviceId: selectedService.id },
      {
        onSuccess: () => {
          setDeleteErrorMessage(null); // Limpiar cualquier error previo
          setIsDeleteDialogOpen(false);
          setSelectedService(null);
          refetchServices();
        },
        onError: (error) => {
          console.error("Error al eliminar el servicio:", error);
          setDeleteErrorMessage(error instanceof Error ? error.message : "Error al eliminar el servicio");
        }
      }
    );
  }
  //* =============================================

  //* Funciones para limpiar errores
  const handleClearDeleteError = () => {
    setDeleteErrorMessage(null);
  };

  const handleClearUpdateError = () => {
    setUpdateErrorMessage(null);
  };
  //* Renderizar el UserSelector siempre que sea admin, independientemente del estado de carga
  const renderUserSelector = () => {
    if (isAdmin) {
      return (
        <UserSelector
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          currentUser={currentUser}
          users={usersHook.users}
        />
      );
    }
    return null;
  };

  if (loadingServices) {
    return (
      <>
        {renderUserSelector()}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 w-24 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
                <div className="h-3 w-28 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (errorServices) {
    return (
      <>
        {renderUserSelector()}
        <div className="flex h-[98vh] w-full self-center items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{errorServices}</p>
            <button onClick={() => refetchServices()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </>
    )
  }

  if (services.length === 0) {
    if (selectedUser?.id != currentUser?.id) {
      return (
        <>
          {renderUserSelector()}
          <div className="flex flex-col gap-4">
            <div className="max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded content-center self-center">
              No encontramos servicios para {selectedUser?.name}.
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          {renderUserSelector()}
          <div className="flex flex-col gap-4 max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded justify-center self-center">
            No tienes servicios asociados aún, prueba crear el primero:
            <div>
              <Button>Crear servicio</Button>
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {renderUserSelector()}

      <div className="content-center">
        <Button size="lg">Crear servicio</Button>
      </div>

      {
        usersHook.loading ?
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          :
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                currentUser={currentUser}
                handleServiceClick={handleServiceDetailsClick}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
          </div>
      }

      {/* Modal de detalles del servicio */}
      <ServiceDetailsDialog
        isDialogOpen={isDetailsDialogOpen}
        setIsDialogOpen={setIsDetailsDialogOpen}
        selectedService={selectedService}
        handleCloseDialog={handleCloseDialog}
      />

      {/* Modal de eliminacion del servicio */}
      <DeleteServiceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeletion}
        isPending={deleteService.isPending}
        errorMessage={deleteErrorMessage}
        onClearError={handleClearDeleteError}
        service={selectedService}
      />

      {/* Modal de edicion del servicio */}
      <UpdateServiceDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onConfirm={confirmUpdate}
        isPending={updateService.isPending}
        errorMessage={updateErrorMessage}
        onClearError={handleClearUpdateError}
        service={selectedService}
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
      />
    </>
  );
}
//* 1- Crear servicios