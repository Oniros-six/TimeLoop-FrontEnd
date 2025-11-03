import { useState, useEffect, useCallback } from "react";
import type { WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";
import convertToWorkingPattern from "@/components/dashboard/configs/WorkingPatternTransformer";

export interface WorkingPatternSyncResult {
    patternData: WorkingPattern | null;
    patternErrors: Record<string, string>;
    handlePatternChange: (newPattern: WorkingPattern) => void;
    handleErrorChange: (newErrors: Record<string, string>) => void;
}

/**
 * Hook para sincronizar y gestionar el estado de working patterns
 * Convierte IWorkingPattern[] a WorkingPattern y gestiona errores
 */
export function useWorkingPatternSync(
    sourcePattern: IWorkingPattern | IWorkingPattern[] | null | undefined
): WorkingPatternSyncResult {
    const [patternData, setPatternData] = useState<WorkingPattern | null>(null);
    const [patternErrors, setPatternErrors] = useState<Record<string, string>>({});

    // Sincronizar con los datos iniciales cuando cambien
    useEffect(() => {
        const converted = convertToWorkingPattern(sourcePattern);
        setPatternData(converted);
    }, [sourcePattern]);

    // Manejar cambios en el patrón de trabajo
    const handlePatternChange = useCallback((newPattern: WorkingPattern) => {
        setPatternData(newPattern);
    }, []);

    // Manejar cambios en errores del patrón de trabajo
    const handleErrorChange = useCallback((newErrors: Record<string, string>) => {
        setPatternErrors(newErrors);
    }, []);

    return {
        patternData,
        patternErrors,
        handlePatternChange,
        handleErrorChange
    };
}

