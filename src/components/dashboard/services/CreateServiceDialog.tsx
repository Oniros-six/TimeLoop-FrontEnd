import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ErrorDisplay from "../ErrorDisplay"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface CreateServiceForm {
    id:number;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
}

interface CreateServiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (formData: CreateServiceForm) => void
    isPending: boolean
    errorMessage?: string | null | undefined
    onClearError?: () => void
    createForm: CreateServiceForm
    setCreateForm: (form: CreateServiceForm) => void
}

export default function CreateServiceDialog({
    open,
    onOpenChange,
    onConfirm,
    isPending,
    errorMessage,
    onClearError,
    createForm,
    setCreateForm
}: CreateServiceDialogProps) {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(createForm);
    };

    const minPrice = 99
    const minDuration = 9

    const isFormValid = createForm.name.trim() &&
        createForm.description.trim() &&
        createForm.price > minPrice &&
        createForm.durationMinutes > minDuration;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <Plus className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-lg font-semibold">
                            Crear nuevo servicio
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <ErrorDisplay
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="create-name">Nombre del Servicio</Label>
                        <Input
                            id="create-name"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            placeholder="Ej: Corte de pelo"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="create-description">Descripción</Label>
                        <Textarea
                            id="create-description"
                            value={createForm.description}
                            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                            placeholder="Describe el servicio que ofreces..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="create-price">Precio ($)</Label>
                            <Input
                                id="create-price"
                                type="number"
                                value={createForm.price || ''}
                                onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                                placeholder="100"
                                min="100"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="create-duration">Duración (minutos)</Label>
                            <Input
                                id="create-duration"
                                type="number"
                                value={createForm.durationMinutes || ''}
                                onChange={(e) => setCreateForm({ ...createForm, durationMinutes: Number(e.target.value) })}
                                placeholder="15"
                                min="15"
                                required
                            />
                        </div>
                    </div>

                    <Separator />

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="hover:scale-105 transition-all duration-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={isPending || !isFormValid}
                            className="min-w-[100px] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                    Creando...
                                </div>
                            ) : (
                                "Crear Servicio"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
