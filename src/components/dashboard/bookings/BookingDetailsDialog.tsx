import { Button } from "@/components/ui/button";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, DollarSign, FileText, User, Users, X } from "lucide-react";
import { BookingStatus, type IBooking } from "@/interfaces/Booking";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/interfaces/Booking";
import type { IUser } from "@/interfaces/User";

interface PropsInterface {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    selectedBooking: IBooking | null;
    handleCloseDialog: () => void;
    setCancelDialogOpen: (openConfirmation: boolean) => void;
    cancelDialogOpen: boolean;
    currentUser: IUser | null
}

export default function ServiceDetailsDialog({
    isDialogOpen,
    setIsDialogOpen,
    selectedBooking,
    handleCloseDialog,
    setCancelDialogOpen,
    cancelDialogOpen,
    currentUser
}: PropsInterface) {

    let timeStartDate;
    let timeEndDate
    if (selectedBooking != undefined) {
        timeStartDate = new Date(selectedBooking.timeStart)
        timeEndDate = new Date(selectedBooking.timeEnd)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de Reserva #{selectedBooking?.id}</DialogTitle>
                </DialogHeader>
                {selectedBooking && (
                    <div className="space-y-6">
                        {/* Estado */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Estado:</span>
                            <Badge variant="secondary" className={`${statusConfig[selectedBooking.status].color} text-white`}>
                                {statusConfig[selectedBooking.status].label}
                            </Badge>
                        </div>

                        {/* Grid de información */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Cliente</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedBooking.customer.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Profesional</p>
                                    <p className="text-sm text-muted-foreground">{selectedBooking.user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Horario</p>
                                    <p className="text-sm text-muted-foreground">
                                        {timeStartDate?.toLocaleString("es-ES", {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}{" "}
                                        -{" "}
                                        {timeEndDate?.toLocaleTimeString("es-ES", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Duración</p>
                                    <p className="text-sm text-muted-foreground">{selectedBooking.duration} minutos</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Precio Total</p>
                                    <p className="text-sm text-muted-foreground">${selectedBooking.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>


                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Servicios</p>
                                    {selectedBooking.services.map((service) => (
                                        <p key={service.id} className="text-sm text-muted-foreground truncate">{service.name}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Notas */}
                        {selectedBooking.notes && (
                            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">Notas</p>
                                    <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <Button variant="outline" onClick={() => handleCloseDialog()}>
                                Cerrar
                            </Button>
                            {!([BookingStatus.CANCELED, BookingStatus.CONFIRMED].includes(selectedBooking.status)) && (currentUser?.id === selectedBooking.userId) && (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setCancelDialogOpen(true)}
                                        disabled={cancelDialogOpen}
                                        className="opacity-80 hover:opacity-100 hover:scale-105 hover:ring-2 ring-red-800 transition-all duration-300">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar Reserva
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
