import { Calendar } from "lucide-react";
import type { IBooking } from "@/interfaces/Booking";
import { Badge } from "@/components/ui/badge";
import BookingsCard from "./BookingsCard";
import { InfiniteScrollTrigger } from "@/components/ui/infinite-scroll-trigger";

interface BookingsGridProps {
    bookings: IBooking[];
    onBookingClick: (booking: IBooking) => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}

export function BookingsGrid({
    bookings,
    onBookingClick,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
}: BookingsGridProps) {

    // Ordenar las reservas por fecha y hora (más próximas primero)
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.timeStart);
        const dateB = new Date(b.timeStart);
        return dateA.getTime() - dateB.getTime();
    });

    const groupedBookings = sortedBookings.reduce(
        (groups, booking) => {
            const timeStartDate = new Date(booking.timeStart);
            const dateKey = timeStartDate.toLocaleDateString("es-ES", {
                weekday: "long",
                month: "long",
                day: "numeric",
            })
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].push(booking)
            return groups
        },
        {} as Record<string, IBooking[]>,
    )

    // Ordenar las fechas para que las más próximas aparezcan primero
    const sortedDateEntries = Object.entries(groupedBookings).sort(([dateA], [dateB]) => {
        // Extraer la fecha del string formateado para comparar
        const dateObjA = new Date(dateA);
        const dateObjB = new Date(dateB);
        return dateObjA.getTime() - dateObjB.getTime();
    });

    return (
        <>
            <div className="space-y-6">
                {sortedDateEntries.map(([date, dateBookings]) => (
                    <div key={date} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Header de fecha */}
                        <div className="flex items-center col-span-full gap-2 pb-2 border-b">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold capitalize">{date}</h3>
                            <Badge variant="secondary" className="ml-2">
                                {dateBookings.length} {dateBookings.length === 1 ? "reserva" : "reservas"}
                            </Badge>
                        </div>

                        {/* Lista de reservas del día */}
                        {dateBookings.map((booking) => (
                            <BookingsCard key={booking.id} booking={booking} handleBookingClick={onBookingClick} />
                        ))}
                    </div>
                ))}

                {/* Trigger para infinite scroll */}
                {onLoadMore && (
                    <InfiniteScrollTrigger
                        onIntersect={onLoadMore}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </div>

        </>
    );
}
