import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import ErrorDisplay from "../ErrorDisplay"
import type { IService } from "@/interfaces/Service"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"

interface ConfirmUpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isPending: boolean
    errorMessage?: string | null | undefined
    onClearError?: () => void
    service: IService | null
    updateForm: IService | null
    setUpdateForm: (service: IService | null) => void
}

export default function UpdateServiceDialog({
    open,
    onOpenChange,
    onConfirm,
    isPending,
    errorMessage,
    onClearError,
    service,
    updateForm,
    setUpdateForm
}: ConfirmUpdateDialogProps) {
    if (!service) return null

    useEffect(() => {
        setUpdateForm({ ...service})
    }, [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full 'bg-yellow-100 text-yellow-600`}>
                            <Pencil className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            Editar servicio
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ErrorDisplay
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nombre del Servicio</Label>
                        <Input
                            id="edit-name"
                            value={updateForm?.name}
                            onChange={(e) => setUpdateForm({ ...service, name: e.target.value })}
                            placeholder={service.name}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-full-description">Descripción Completa</Label>
                        <Textarea
                            id="edit-full-description"
                            value={updateForm?.description}
                            onChange={(e) => setUpdateForm({ ...service, description: e.target.value })}
                            placeholder={service.description}
                            rows={4}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Precio ($)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                onChange={(e) => setUpdateForm({ ...service, price: Number(e.target.value) })}
                                placeholder={service.price.toString()}
                                min={100}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-duration">Duración (minutos)</Label>
                            <Input
                                id="edit-duration"
                                type="number"
                                onChange={(e) => setUpdateForm({ ...service, durationMinutes: Number(e.target.value) })}
                                placeholder={service.durationMinutes.toString()}
                                min={10}
                            />
                        </div>
                    </div>
                </div>


                <Separator />

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
                        variant={"default"}
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
                            "Editar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
