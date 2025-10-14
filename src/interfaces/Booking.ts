import { type IService } from './Service'

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELED = 'CANCELED',
    NO_SHOW = 'NO_SHOW',
    COMPLETED = 'COMPLETED',
    RESCHEDULED = 'RESCHEDULED'
}


export interface Customer {
    name: string,
}

export interface User {
    name: string,
}

export interface IBooking {
    id: number,
    duration: number,
    customerId: number,
    customer: Customer,
    commerceId: number,
    userId: number,
    user: User,
    services: IService[],
    totalPrice: number,
    notes: string,
    status: BookingStatus,
    timeEnd: Date,
    timeStart: Date
}

export interface BookingsPage {
    data: IBooking[];
    nextCursor?: string | number;
    hasNextPage: boolean;
}

export const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
    [BookingStatus.PENDING]: { label: "Pendiente", color: "bg-yellow-500" },
    [BookingStatus.CONFIRMED]: { label: "Confirmado", color: "bg-green-500" },
    [BookingStatus.CANCELED]: { label: "Cancelado", color: "bg-red-500" },
    [BookingStatus.COMPLETED]: { label: "Completado", color: "bg-blue-500" },
    [BookingStatus.NO_SHOW]: { label: "Ausente", color: "bg-gray-500" },
    [BookingStatus.RESCHEDULED]: { label: "Reprogramado", color: "bg-purple-500" },
  };