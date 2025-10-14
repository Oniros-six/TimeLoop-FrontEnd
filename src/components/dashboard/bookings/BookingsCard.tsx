import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingStatus, type IBooking } from "@/interfaces/Booking";
import { statusConfig } from "@/interfaces/Booking";

interface PropsInterface {
    booking: IBooking,
    handleBookingClick: (booking: IBooking) => void;
}

export default function BookingCard({
    booking,
    handleBookingClick,
}: PropsInterface) {

    return (
        <Card
            className="relative cursor-pointer transition-all hover:shadow-md hover:border-primary/50 py-2"
            onClick={() => handleBookingClick(booking)}
        >
            <CardContent className="px-3">
                <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-6 gap-3">

                    {/*//* Cliente*/}
                    <p className="font-medium truncate place-self-center md:justify-self-center
                    col-span-2
                    md:col-span-6
                    ">{booking.customer.name}</p>

                    {/*//* Hora y duración */}
                    <div className="flex flex-col items-center 
                    col-start-1 row-start-2 
                    md:col-end-4
                    ">
                        <span className="text-lg font-semibold">
                            {new Date(booking.timeStart).toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">{booking.duration} min</span>
                    </div>

                    {/*//* Precio*/}
                    <span className="place-self-center font-semibold text-lg text-green-500
                    col-start-2 row-start-2 
                    md:col-start-4 md:col-end-7
                    ">${booking.totalPrice.toFixed(2)}</span>

                    {/*//* estado*/}
                    <Badge variant="secondary" className={`absolute top-2 right-2 ${statusConfig[booking.status].color} text-white`}>
                        {statusConfig[booking.status].label}
                    </Badge>
                </div>

                <Separator className="my-2" />
                {!booking.notes &&
                    <div className="px-2
                    col-start-2 col-end-7 row-start-2 row-end-5
                    lg:row-end-6 lg:col-end-6">
                        <p className="text-sm text-muted-foreground line-clamp-2">El cliente no ha dejado una nota.</p>
                    </div>}

                {/* //* Nota */}
                <div className="px-2
                    col-start-2 col-end-7 row-start-2 row-end-5
                    lg:row-end-6 lg:col-end-6">
                    <p className="text-sm text-muted-foreground line-clamp-2">{booking.notes}</p>
                </div>

            </CardContent>
        </Card>
    )
}