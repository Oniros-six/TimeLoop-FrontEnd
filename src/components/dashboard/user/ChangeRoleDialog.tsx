import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserCog } from "lucide-react";
import { UserRole } from "@/interfaces/User";
import ErrorDisplay from "./ErrorDisplay";

interface PropsInterface {
    openRolDialog: boolean;
    setOpenRolDialog: (open: boolean) => void;
    selectedUser: {
        id: number;
        name: string;
        currentRole: UserRole;
    } | null;
    newRole: UserRole;
    setNewRole: (role: UserRole) => void;
    handleChangeRole: () => void;
    isPending: boolean;
    errorMessage?: string | null | undefined;
    onClearError?: () => void;
}

export default function ChangeRoleDialog({
    openRolDialog,
    setOpenRolDialog,
    selectedUser,
    newRole,
    setNewRole,
    handleChangeRole,
    isPending,
    errorMessage,
    onClearError
}: PropsInterface) {
    return (
        <Dialog open={openRolDialog} onOpenChange={setOpenRolDialog}>
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
                                Rol actual: {selectedUser?.currentRole === UserRole.ADMIN ? "Administrador" : "Colaborador"}
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
                        onClick={() => setOpenRolDialog(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleChangeRole}
                        disabled={isPending || !newRole || newRole === selectedUser?.currentRole}
                    >
                        {isPending ? "Actualizando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
