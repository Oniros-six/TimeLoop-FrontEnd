import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Clock, DollarSign } from "lucide-react";
import ErrorDisplay from "@/components/dashboard/ErrorDisplay";
import { type IService } from "@/interfaces/Service"
import { Separator } from "@/components/ui/separator";

interface PropsInterface {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    selectedService: IService | null;
    handleCloseDialog: () => void;
}

export default function ServiceDetailsDialog({
    isDialogOpen,
    setIsDialogOpen,
    selectedService,
    handleCloseDialog
}: PropsInterface) {

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                {selectedService && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedService.name}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Descripción</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {selectedService.description}
                                </p>
                            </div>

                            <Separator />

                            <div className="grid gap-4 grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="h-5 w-5" />
                                        <span className="text-sm font-medium">Precio</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {
                                            selectedService.price.toLocaleString("es-UY", {
                                                style: "currency",
                                                currency: "UYU",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })
                                        }
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-sm font-medium">Duración</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {selectedService.durationMinutes} min
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={handleCloseDialog}>
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
