import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserCog, X } from "lucide-react";
import { UserRole } from "@/interfaces/User";

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
    errorMessage?: string | null;
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
                
                {/* Mostrar error si existe */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <div className="flex items-start">
                            <div className="flex-1">
                                <p className="text-sm text-red-800">{errorMessage}</p>
                            </div>
                            {onClearError && (
                                <button
                                    onClick={onClearError}
                                    className="ml-2 text-red-400 hover:text-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
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
