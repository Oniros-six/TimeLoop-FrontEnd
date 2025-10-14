import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { IBooking } from "@/interfaces/Booking";

interface PropsInterface {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    selectedBooking: IBooking | null;
    handleCloseDialog: () => void;
    handleCancelBooking: (bookingId: number, customerId: number, commerceId: number) => void;
}

export default function ConfirmationDialog({
    isDialogOpen,
    setIsDialogOpen,
    selectedBooking,
    handleCancelBooking,
    handleCloseDialog
}: PropsInterface) {
    if (selectedBooking != undefined)
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cancelar reserva #{selectedBooking.id}</DialogTitle>
                    </DialogHeader>

                    <DialogDescription>
                        ¿Estás seguro que desea cancelar esta reserva?
                    </DialogDescription>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={() => handleCloseDialog()}>
                            Cerrar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleCancelBooking(selectedBooking.id, selectedBooking.customerId, selectedBooking.commerceId)}
                            className="opacity-80 hover:opacity-100 hover:scale-105 hover:ring-2 ring-red-800 transition-all duration-300">
                            Confirmar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog >
        )
}