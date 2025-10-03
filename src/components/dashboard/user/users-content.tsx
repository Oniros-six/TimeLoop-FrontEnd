import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { viewAtom } from "@/atoms/view"
import { userAtom } from "@/atoms/auth"
import { useUsers } from "@/hooks/users/useUsers"
import { useChangeStatus } from "@/hooks/users/useChangeStatus"
import { useChangeRol } from "@/hooks/users/useChangeRol"
import { useCreateUser } from "@/hooks/users/useCreateUser"
import CreateUserDialog from "./CreateUserDialog"
import ChangeRoleDialog from "./ChangeRoleDialog"
import ConfirmStatusDialog from "./ConfirmStatusDialog"
import UserFilters from "./UserFilters"
import UserTable from "./UserTable"
import { UserRole } from "@/interfaces/User"


export function UsersContent() {
    //* Seteamos el nombre de la vista
    const [, setView] = useAtom(viewAtom);

    //* Obtenemos el usuario logueado para verificar permisos
    const [currentUser] = useAtom(userAtom);

    useEffect(() => {
        setView("Usuarios");
    }, [setView]);

    //* Estados relacionados al listado de usuarios
    const [showInactive, setShowInactive] = useState(false)

    //* Estados relacionados al dialog de creación de usuario
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

    //* Estados relacionados al dialog de cambio de rol de usuario
    const [openRolDialog, setOpenRolDialog] = useState(false)
    const [newRole, setNewRole] = useState<UserRole>(UserRole.EMPLOYEE)
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; currentRole: UserRole; } | null>(null)

    //* Estados relacionados al dialog de confirmación de cambio de estado
    const [openStatusDialog, setOpenStatusDialog] = useState(false)
    const [userToChangeStatus, setUserToChangeStatus] = useState<{ id: number; name: string; active: boolean; } | null>(null)

    //* Estados relacionados al nuevo usuario
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: UserRole.EMPLOYEE,
    })

    //* Estados para manejar errores
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [roleErrorMessage, setRoleErrorMessage] = useState<string | null>(null)
    const [statusErrorMessage, setStatusErrorMessage] = useState<string | null>(null)

    //* Logica para cambiar el estado de un usuario, suspenderlo o reactivarlo
    const status = useChangeStatus();

    //* Logica para crear un nuevo usuario
    const createUser = useCreateUser();

    //* Función para abrir el diálogo de confirmación
    const handleToggleUserStatus = (usuario: any) => {
        setStatusErrorMessage(null); // Limpiar errores previos
        setUserToChangeStatus({
            id: usuario.id,
            name: usuario.name,
            active: usuario.active
        });
        setOpenStatusDialog(true);
    };

    //* Función para confirmar el cambio de estado
    const confirmToggleUserStatus = () => {
        if (!userToChangeStatus) return;

        const newActiveStatus = !userToChangeStatus.active;
        status.mutate(
            { userId: userToChangeStatus.id, active: newActiveStatus },
            {
                onSuccess: () => {
                    console.log("Estado del usuario actualizado con exito");
                    setStatusErrorMessage(null); // Limpiar cualquier error previo
                    setOpenStatusDialog(false);
                    setUserToChangeStatus(null);
                    refetch();
                },
                onError: (error) => {
                    console.error("Error al cambiar el estado del usuario:", error);
                    setStatusErrorMessage(error instanceof Error ? error.message : "Error al cambiar el estado del usuario");
                }
            }
        );
    };

    //* Logica para cambiar el rol de un usuario
    const changeRole = useChangeRol();
    const handleChangeRole = () => {
        if (!selectedUser) return;

        changeRole.mutate(
            { userId: selectedUser.id, newRole: newRole },
            {
                onSuccess: () => {
                    setRoleErrorMessage(null); // Limpiar cualquier error previo
                    setOpenRolDialog(false);
                    setSelectedUser(null);
                    refetch();
                },
                onError: (error) => {
                    console.error("Error al cambiar el rol:", error);
                    setRoleErrorMessage(error instanceof Error ? error.message : "Error al cambiar el rol del usuario");
                }
            }
        );
    };

    //* Llamamos al hook responsable de obtener el array de usaurios del comercio
    const { users, loading, error, refetch } = useUsers();

    //* Verificamos si el usuario actual es administrador
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    if (loading) {
        return (
            <div className="flex h-[98vh] w-full self-center items-center justify-center ">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-secondary">Cargando datos...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[98vh] w-full self-center items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-secondary hover:text-secondary-foreground transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const filteredUsers = users.filter((u) => (showInactive ? !u.active : u.active));

    //* Logica para abrir el dialog de cambio de rol
    const handleCambiarRol = (usuario: any) => {
        setRoleErrorMessage(null); // Limpiar errores previos
        setSelectedUser({
            id: usuario.id,
            name: usuario.name,
            currentRole: usuario.role
        });
        setNewRole(usuario.role === UserRole.ADMIN ? UserRole.EMPLOYEE : UserRole.ADMIN);
        setOpenRolDialog(true);
    }

    //* Funciones para limpiar errores
    const handleClearError = () => {
        setErrorMessage(null);
    };

    const handleClearRoleError = () => {
        setRoleErrorMessage(null);
    };

    const handleClearStatusError = () => {
        setStatusErrorMessage(null);
    };

    //* Logica para crear un user
    const handleAgregarUsuario = () => {
        if (!currentUser?.commerceId) {
            console.error("No se pudo obtener el commerceId del usuario actual");
            setErrorMessage("No se pudo obtener la información del comercio");
            return;
        }

        createUser.mutate(
            {
                commerceId: currentUser.commerceId,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
            },
            {
                onSuccess: () => {
                    console.log("Usuario creado exitosamente");
                    setErrorMessage(null); // Limpiar cualquier error previo
                    setOpenRegisterDialog(false);
                    setNewUser({
                        name: "",
                        email: "",
                        password: "",
                        role: UserRole.EMPLOYEE,
                    });
                    refetch();
                },
                onError: (error) => {
                    console.error("Error al crear el usuario:", error);
                    setErrorMessage(error instanceof Error ? error.message : "Error al crear el usuario");
                }
            }
        );
    }

    //* Helper para mostrar ocultar usuarios segun su estado
    function handleShowUsers(): void {
        setShowInactive((prev) => !prev)
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <UserFilters
                showInactive={showInactive}
                onToggleInactive={handleShowUsers}
            />

            {/* //* Tabla de usuarios */}
            <div className="rounded-lg border bg-card">
                <div className="p-4">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {showInactive ? "Usuarios Inactivos" : "Usuarios Activos"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {filteredUsers.length} usuario
                                {filteredUsers.length !== 1 ? "s" : ""} encontrado
                                {filteredUsers.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        {isAdmin && (
                            <CreateUserDialog
                                setNewUser={setNewUser}
                                newUser={newUser}
                                openRegisterDialog={openRegisterDialog}
                                setOpenRegisterDialog={setOpenRegisterDialog}
                                handleAgregarUsuario={handleAgregarUsuario}
                                isPending={createUser.isPending}
                                errorMessage={errorMessage}
                                onClearError={handleClearError}
                            />
                        )}

                    </div>

                    {/* Diálogos */}
                    <ChangeRoleDialog
                        openRolDialog={openRolDialog}
                        setOpenRolDialog={setOpenRolDialog}
                        selectedUser={selectedUser}
                        newRole={newRole}
                        setNewRole={setNewRole}
                        handleChangeRole={handleChangeRole}
                        isPending={changeRole.isPending}
                        errorMessage={roleErrorMessage}
                        onClearError={handleClearRoleError}
                    />

                    <ConfirmStatusDialog
                        open={openStatusDialog}
                        onOpenChange={setOpenStatusDialog}
                        onConfirm={confirmToggleUserStatus}
                        isPending={status.isPending}
                        user={userToChangeStatus}
                        errorMessage={statusErrorMessage}
                        onClearError={handleClearStatusError}
                    />

                    <UserTable
                        users={filteredUsers}
                        isAdmin={isAdmin}
                        onRoleChange={handleCambiarRol}
                        onStatusToggle={handleToggleUserStatus}
                        isStatusPending={status.isPending}
                        showInactive={showInactive}
                    />
                </div>
            </div>
        </div>
    )
}
