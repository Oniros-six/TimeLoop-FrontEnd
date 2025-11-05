export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  NO_SHOW = "NO_SHOW",
  COMPLETED = "COMPLETED",
  RESCHEDULED = "RESCHEDULED"
}

export const getStatusText = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.PENDING:
      return "Pendiente";
    case BookingStatus.CONFIRMED:
      return "Confirmado";
    case BookingStatus.CANCELED:
      return "Cancelado";
    case BookingStatus.NO_SHOW:
      return "No se presentó";
    case BookingStatus.COMPLETED:
      return "Completado";
    case BookingStatus.RESCHEDULED:
      return "Reprogramado";
    default:
      return status; // Fallback al valor original
  }
}

export interface DashboardData {
  commerceId: number;
  commerceName: string;
  logoUrl: string;
  history: HistoryItem[];
  recentActivity: RecentItem[];
}
export interface HistoryItem {
  id: number;
  user: { name: string };
  bookingId: number;
  customerId: number;
  priceAtBooking: number;
  timeStart: Date;
  booking: {
    bookingServices: BookingService[];
  };
  customer: Customer;
}

export interface RecentItem {
  id: number;
  user: { name: string }
  customerId: number;
  timeStart: Date;
  status: BookingStatus;
  bookingServices: BookingService[];
  customer: Customer;
}


export interface BookingService {
  service: Service;
}

export interface Service {
  name: string;
}

export interface Customer {
  name: string;
}
