export enum WeekDays {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export enum AvailabilityType {
    full = "full",
    half = "half",
    off = "off"
}

export interface IWorkingPattern {
    id?: number,
    weekday: WeekDays,
    availabilityType: AvailabilityType,
    morningStart?: string | null,
    morningEnd?: string | null,
    afternoonStart?: string | null,
    afternoonEnd?: string | null,
}