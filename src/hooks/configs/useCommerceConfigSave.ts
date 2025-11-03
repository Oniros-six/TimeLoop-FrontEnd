import { useQueryClient } from "@tanstack/react-query";
import type { ICommerce } from "@/interfaces/Commerce";
import type { ICommerceConfig } from "@/interfaces/Config";
import type { WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";
import { useUpdateCommerceInfo } from "./commerce/useUpdateCommerceInfo";
import { useUpdateCommerceConfig } from "./commerce/useUpdateCommerceConfig";
import { useCommerceUpdateWP } from "./commerce/useCommerceUpdateWP";
import { convertSchedulesToWorkingPatternArray, normalizeSchedules } from "@/lib/workingPatternUtils";

export interface CommerceConfigSaveOptions {
    commerceInfo: ICommerce | null;
    commerceConfig: ICommerceConfig | null;
    commercePatternData?: WorkingPattern | null;
    commerceWorkingPattern?: IWorkingPattern | IWorkingPattern[] | null;
}

export interface CommerceConfigSaveResult {
    saveCommerceInfo: (
        options: CommerceConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => Promise<void>;
    saveCommercePattern: (
        options: CommerceConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => Promise<void>;
    isLoading: boolean;
}

export function useCommerceConfigSave(): CommerceConfigSaveResult {
    const queryClient = useQueryClient();
    const updateCommerceInfo = useUpdateCommerceInfo();
    const updateCommerceConfig = useUpdateCommerceConfig();
    const updateCommerceWP = useCommerceUpdateWP();

    const saveCommerceInfo = async (
        options: CommerceConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => {
        const { commerceInfo, commerceConfig } = options;

        if (!commerceInfo || !commerceConfig || !commerceInfo.id) {
            onError("No hay datos de comercio para guardar");
            return;
        }

        try {
            // Filtrar solo los campos permitidos para commerceInfo
            const commerceDataToSend = {
                name: commerceInfo.name,
                email: commerceInfo.email,
                phone: commerceInfo.phone,
                address: commerceInfo.address,
                businessCategory: commerceInfo.businessCategory
            };

            // Filtrar solo los campos permitidos para commerceConfig
            const configDataToSend = {
                cancellationDeadlineMinutes: commerceConfig.cancellationDeadlineMinutes,
                welcomeMessage: commerceConfig.welcomeMessage,
                acceptedPaymentMethods: commerceConfig.acceptedPaymentMethods,
                billingType: commerceConfig.billingType
            };

            // Actualizar información básica del comercio
            await updateCommerceInfo.mutateAsync({
                commerceId: commerceInfo.id,
                data: commerceDataToSend
            });

            // Actualizar configuración del comercio
            await updateCommerceConfig.mutateAsync({
                commerceId: commerceInfo.id,
                data: configDataToSend
            });

            // Invalidar caché para refrescar datos
            await queryClient.invalidateQueries({ queryKey: ["commerce", commerceInfo.id] });
            await queryClient.invalidateQueries({ queryKey: ["commerceConfig", commerceInfo.id] });

            onSuccess();
        } catch (error) {
            onError(error instanceof Error ? error.message : "Error al actualizar el comercio");
            console.error("Error al guardar comercio:", error);
        }
    };

    const saveCommercePattern = async (
        options: CommerceConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => {
        const { commerceInfo, commercePatternData, commerceWorkingPattern } = options;

        if (!commerceInfo || !commerceInfo.id || !commercePatternData) {
            onError("No hay datos de comercio para guardar");
            return;
        }

        try {
            // Normalizar schedules agregando null a los campos faltantes
            const normalizedSchedules = normalizeSchedules(commercePatternData.schedules);

            // Convertir a IWorkingPattern[]
            const patternsToSend = convertSchedulesToWorkingPatternArray(
                normalizedSchedules,
                commerceWorkingPattern
            );

            // Actualizar horarios del comercio
            await updateCommerceWP.mutateAsync({
                commerceId: commerceInfo.id,
                data: patternsToSend
            });

            // Invalidar caché para refrescar datos
            await queryClient.invalidateQueries({ queryKey: ["commerceWP", commerceInfo.id] });

            onSuccess();
        } catch (error) {
            onError(error instanceof Error ? error.message : "Error al actualizar horarios");
            console.error("Error al guardar horarios de comercio:", error);
        }
    };

    return {
        saveCommerceInfo,
        saveCommercePattern,
        isLoading: updateCommerceInfo.isPending || updateCommerceConfig.isPending || updateCommerceWP.isPending
    };
}

