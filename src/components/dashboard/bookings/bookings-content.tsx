import { userAtom } from "@/atoms/auth"
import { viewAtom } from "@/atoms/view"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { BookingsHeader } from "./BookingsHeader";
import { UserRole, type IUser } from "@/interfaces/User";
import { useUsers } from "@/hooks/users/useUsers";
import { useInfiniteBookings } from "@/hooks/bookings/useInfiniteBookings";
import { BookingsGrid } from "./BookingsGrid";
import { BookingsLoading } from "./BookingsLoading";
import { BookingsError } from "./BookingsError";
import { BookingsEmpty } from "./BookingsEmpty";
import { useBookingDialogs } from "@/hooks/bookings/useBookingDialogs";
import type { IBooking } from "@/interfaces/Booking";
import BookingDetailsDialog from "./BookingDetailsDialog";
import { useBookingActions } from "@/hooks/bookings/useBookingActions";
import ConfirmationDialog from "./ConfirmationDialog";

export function BookingsContent() {
    //* Seteamos el nombre de la vista
    const [, setView] = useAtom(viewAtom);
    const [currentUser] = useAtom(userAtom);

    useEffect(() => {
        setView("Agenda");
    }, [setView]);

    //* Estado relacionado al listado de servicios
    const [selectedUser, setSelectedUser] = useState<IUser | null>(currentUser || null);
    const [searchingByUser, setSearchingByUser] = useState(true)
    //* Verificamos si el usuario actual es administrador
    const isAdmin = currentUser?.role === UserRole.ADMIN;

    //* Hooks para obtener datos
    const usersHook = useUsers();
    const {
        bookings,
        loading: loadingBookings,
        error: errorBookings,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch: refetchBookings
    } = useInfiniteBookings({
        searchingByUser: searchingByUser,
        id: searchingByUser ? selectedUser?.id : currentUser?.commerceId,
        limit: 10
    });

    //* Hooks personalizados para manejar lógica
    const dialogs = useBookingDialogs();
    const actions = useBookingActions(refetchBookings, dialogs.closeDetailsDialog);

    const handleBookingDetailsClick = (booking: IBooking) => {
        dialogs.openDetailsDialog(booking);
    };

    const handleCancelBooking = (bookingId: number, customerId: number, commerceId: number) => {
        actions.handleCancel(bookingId, customerId, commerceId);
    };

    //* Renderizado condicional basado en el estado
    if (loadingBookings) {
        return (
            <>
                <BookingsHeader
                    isAdmin={isAdmin}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    setSearchingByUser={setSearchingByUser}
                    currentUser={currentUser}
                    users={usersHook.users}
                />
                <BookingsLoading />
            </>
        );
    }

    if (errorBookings) {
        return (
            <>
                <BookingsHeader
                    isAdmin={isAdmin}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    setSearchingByUser={setSearchingByUser}
                    currentUser={currentUser}
                    users={usersHook.users}
                />
                <BookingsError error={errorBookings} onRetry={refetchBookings} />
            </>
        );
    }

    if (bookings.length === 0) {
        return (
            <>
                <BookingsHeader
                    isAdmin={isAdmin}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    setSearchingByUser={setSearchingByUser}
                    currentUser={currentUser}
                    users={usersHook.users}
                />
                <BookingsEmpty
                    searchingByUser={searchingByUser}
                    selectedUser={selectedUser}
                    currentUser={currentUser}
                />
            </>
        );
    }

    return (
        <>
            <BookingsHeader
                isAdmin={isAdmin}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                setSearchingByUser={setSearchingByUser}
                currentUser={currentUser}
                users={usersHook.users}
            />

            {/* Indicador de qué reservas se están mostrando */}
            <div className="flex self-center mb-4">
                <h3 className="text-lg font-semibold">
                    {searchingByUser && selectedUser
                        ? `Reservas de ${selectedUser?.name}`
                        : "Todas las reservas del comercio"
                    }
                </h3>
            </div>

            <BookingsGrid
                bookings={bookings}
                onBookingClick={handleBookingDetailsClick}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
            />
            <BookingDetailsDialog
                isDialogOpen={dialogs.isDetailsDialogOpen}
                setIsDialogOpen={dialogs.setIsDetailsDialogOpen}
                selectedBooking={dialogs.selectedBooking}
                setCancelDialogOpen={dialogs.setCancelDialogOpen}
                cancelDialogOpen={dialogs.cancelDialogOpen}
                currentUser={currentUser}
                handleCloseDialog={dialogs.closeDetailsDialog}
            />
            <ConfirmationDialog
                isDialogOpen={dialogs.cancelDialogOpen}
                setIsDialogOpen={dialogs.setCancelDialogOpen}
                handleCloseDialog={dialogs.closeConfirmationDialog}
                selectedBooking={dialogs.selectedBooking}
                handleCancelBooking={handleCancelBooking}
            />
        </>
    );
}