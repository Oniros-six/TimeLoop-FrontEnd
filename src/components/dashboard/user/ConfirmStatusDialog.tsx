import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserX, UserCheck, AlertTriangle, X } from "lucide-react"

interface ConfirmStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isPending: boolean
    user: {
        id: number
        name: string
        active: boolean
    } | null
    errorMessage?: string | null
    onClearError?: () => void
}

export default function ConfirmStatusDialog({
    open,
    onOpenChange,
    onConfirm,
    isPending,
    user,
    errorMessage,
    onClearError
}: ConfirmStatusDialogProps) {
    if (!user) return null

    const isActivating = !user.active
    const actionText = isActivating ? "reactivar" : "suspender"
    const actionTextCapitalized = isActivating ? "Reactivar" : "Suspender"
    const Icon = isActivating ? UserCheck : UserX
    const confirmButtonVariant = isActivating ? "default" : "destructive"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isActivating ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            {actionTextCapitalized} Usuario
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground pt-2">
                        ¿Estás seguro de que deseas {actionText} al usuario{" "}
                        <span className="font-medium text-foreground">{user.name}</span>?
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

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                        {isActivating ? (
                            <p>
                                Al reactivar este usuario, podrá acceder nuevamente a la plataforma 
                                y realizar todas las acciones según su rol asignado.
                            </p>
                        ) : (
                            <p>
                                Al suspender este usuario, perderá el acceso a la plataforma 
                                y no podrá realizar ninguna acción hasta que sea reactivado.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="hover:scale-105 transition-all duration-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant={confirmButtonVariant}
                        onClick={onConfirm}
                        disabled={isPending}
                        className="min-w-[100px] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                    >
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Procesando...
                            </div>
                        ) : (
                            actionTextCapitalized
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
