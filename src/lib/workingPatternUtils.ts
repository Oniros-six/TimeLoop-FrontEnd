import { WeekDays, AvailabilityType, type IWorkingPattern } from "@/interfaces/WorkingPattern";

/**
 * Convierte schedules normalizados a un array de IWorkingPattern
 * Preserva los IDs de los patrones existentes
 */
export function convertSchedulesToWorkingPatternArray(
    normalizedSchedules: Record<string, Record<string, string | null>>,
    existingPatterns?: IWorkingPattern | IWorkingPattern[] | null
): IWorkingPattern[] {
    // Crear un mapa de los patrones existentes por weekday para preservar los IDs
    const existingMap = new Map<string, IWorkingPattern>();
    if (existingPatterns) {
        const patternsArray = Array.isArray(existingPatterns) ? existingPatterns : [existingPatterns];
        patternsArray.forEach(pattern => {
            existingMap.set(pattern.weekday, pattern);
        });
    }

    // Procesar todos los días de la semana
    return Object.values(WeekDays).map(weekday => {
        const schedule = normalizedSchedules[weekday];
        const existing = existingMap.get(weekday);

        let availabilityType: AvailabilityType;
        
        // Determinar el tipo de disponibilidad basado en los horarios
        if (!schedule) {
            // Si no hay schedule, es día libre (off)
            availabilityType = AvailabilityType.off;
        } else {
            const hasMorning = schedule.morningOpen && schedule.morningClose;
            const hasAfternoon = schedule.afternoonOpen && schedule.afternoonClose;
            
            if (hasMorning && hasAfternoon) {
                // Tiene ambos turnos = full
                availabilityType = AvailabilityType.full;
            } else if (hasMorning || hasAfternoon) {
                // Tiene solo uno = half
                availabilityType = AvailabilityType.half;
            } else {
                // No tiene ninguno = off
                availabilityType = AvailabilityType.off;
            }
        }

        // Preparar los valores, usando null para campos sin horario
        const morningStart = schedule?.morningOpen || null;
        const morningEnd = schedule?.morningClose || null;
        const afternoonStart = schedule?.afternoonOpen || null;
        const afternoonEnd = schedule?.afternoonClose || null;

        // Crear el objeto con todos los campos siempre presentes (incluyendo null)
        const pattern: any = {
            // weekday,
            availabilityType,
            morningStart: morningStart === null ? null : morningStart,
            morningEnd: morningEnd === null ? null : morningEnd,
            afternoonStart: afternoonStart === null ? null : afternoonStart,
            afternoonEnd: afternoonEnd === null ? null : afternoonEnd,
        };
        
        // Si hay un patrón existente, agregar el id (si existe)
        if (existing && (existing as any).id) {
            pattern.id = (existing as any).id;
        }
        
        return pattern;
    });
}

/**
 * Normaliza schedules agregando null a los campos faltantes
 */
export function normalizeSchedules(schedules: Record<string, any>): Record<string, Record<string, string | null>> {
    return Object.entries(schedules).map(([weekday, schedule]) => {
        return {
            [weekday]: {
                morningOpen: schedule.morningOpen ?? null,
                morningClose: schedule.morningClose ?? null,
                afternoonOpen: schedule.afternoonOpen ?? null,
                afternoonClose: schedule.afternoonClose ?? null
            }
        };
    }).reduce((acc, item) => ({ ...acc, ...item }), {});
}

