export interface MetricsData {
    earnsMetrics: {
        earnsPastMonth: number;
        earnsThisMonth: number;
        earnsDiff: number;
    };
    bookingsMetrics: {
        bookingsThisMonth: number;
        bookingsPastMonth: number;
        bookingsDiff: number;
    };
    rushHoursMetrics: {
        peakRange: {
            start: string; // formato "HH:MM" o "H:MM"
            end: string;
        };
        maxBookings: number;
    };
    newClientsMetrics: {
        newClientsThisMonth: number;
        newClientsLastMonth: number;
        newClientsDiff: number; // porcentaje
    };
}
