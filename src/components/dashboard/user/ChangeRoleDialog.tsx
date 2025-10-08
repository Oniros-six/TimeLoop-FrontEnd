import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserCog } from "lucide-react";
import { UserRole } from "@/interfaces/User";
import ErrorDisplay from "../ErrorDisplay";

interface PropsInterface {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUser: {
        id: number;
        name: string;
        role: UserRole;
    } | null;
    onConfirm: (user: any) => void;
    isPending: boolean;
    errorMessage?: string | null | undefined;
    onClearError?: () => void;
}

export default function ChangeRoleDialog({
    open,
    onOpenChange,
    selectedUser,
    onConfirm,
    isPending,
    errorMessage,
    onClearError
}: PropsInterface) {
    const [newRole, setNewRole] = useState<UserRole>(UserRole.EMPLOYEE);

    // Actualizar el rol cuando cambie el usuario seleccionado
    useEffect(() => {
        if (selectedUser) {
            setNewRole(selectedUser.role === UserRole.ADMIN ? UserRole.EMPLOYEE : UserRole.ADMIN);
        }
    }, [selectedUser]);

    const handleConfirm = () => {
        if (selectedUser) {
            onConfirm(selectedUser);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Cambiar rol de usuario
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona el nuevo rol para {selectedUser?.name}.<br />
                        Los cambios se aplicarán inmediatamente.
                    </DialogDescription>
                </DialogHeader>

                <ErrorDisplay
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="usuario">Usuario</Label>
                        <div className="p-3 bg-muted rounded-md">
                            <p className="font-medium">{selectedUser?.name}</p>
                            <p className="text-sm text-muted-foreground">
                                Rol actual: {selectedUser?.role === UserRole.ADMIN ? "Administrador" : "Colaborador"}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nuevo-rol">Nuevo rol</Label>
                        <Select
                            value={newRole}
                            onValueChange={(value) => setNewRole(value as UserRole)}
                        >
                            <SelectTrigger id="nuevo-rol">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                                <SelectItem value={UserRole.EMPLOYEE}>Colaborador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending || !newRole || newRole === selectedUser?.role}
                    >
                        {isPending ? "Actualizando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
