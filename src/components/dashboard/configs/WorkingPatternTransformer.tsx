import type { IWorkingPattern } from "@/interfaces/WorkingPattern";
import { AvailabilityType } from "@/interfaces/WorkingPattern";
import type { WorkingPattern } from "./working-pattern";

// Función para convertir IWorkingPattern[] o IWorkingPattern a WorkingPattern
export default function convertToWorkingPattern (patterns: IWorkingPattern[] | IWorkingPattern | undefined): WorkingPattern {
    if (!patterns) {
        return { workingDays: [], schedules: {} };
    }

    // Si es un array, procesar cada elemento
    if (Array.isArray(patterns)) {
        const workingDays: string[] = [];
        const schedules: Record<string, any> = {};

        patterns.forEach(pattern => {
            if (pattern.availabilityType !== AvailabilityType.off) {
                workingDays.push(pattern.weekday);
                
                schedules[pattern.weekday] = {
                    morningOpen: pattern.morningStart || undefined,
                    morningClose: pattern.morningEnd || undefined,
                    afternoonOpen: pattern.afternoonStart || undefined,
                    afternoonClose: pattern.afternoonEnd || undefined,
                };
            }
        });

        return { workingDays, schedules };
    }

    // Si es un solo objeto, procesarlo
    const workingDays: string[] = [];
    const schedules: Record<string, any> = {};

    if (patterns.availabilityType !== AvailabilityType.off) {
        workingDays.push(patterns.weekday);
        
        schedules[patterns.weekday] = {
            morningOpen: patterns.morningStart || undefined,
            morningClose: patterns.morningEnd || undefined,
            afternoonOpen: patterns.afternoonStart || undefined,
            afternoonClose: patterns.afternoonEnd || undefined,
        };
    }

    return { workingDays, schedules };
};
