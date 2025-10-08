import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash, AlertTriangle } from "lucide-react"
import ErrorDisplay from "../ErrorDisplay"
import type { IService } from "@/interfaces/Service"

interface ConfirmDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isPending: boolean
    errorMessage?: string | null | undefined
    onClearError?: () => void
    service: IService | null
}

export default function DeleteServiceDialog({
    open,
    onOpenChange,
    onConfirm,
    isPending,
    errorMessage,
    onClearError,
    service
}: ConfirmDeleteDialogProps) {
    if (!service) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full 'bg-red-100 text-red-600`}>
                            <Trash className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            Eliminar servicio
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ErrorDisplay
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                        <p>
                            ¿Estás seguro de que deseas eliminar el servicio {" "}
                            <span className="font-medium text-foreground">{service.name}</span>? <br />
                            <span className="font-bold tracking-wide">El proceso es irreversible</span>
                        </p>
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
                        variant={"destructive"}
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
                            "Eliminar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
