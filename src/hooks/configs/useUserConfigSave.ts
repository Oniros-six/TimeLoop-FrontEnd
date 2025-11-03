import { useQueryClient } from "@tanstack/react-query";
import type { IUser } from "@/interfaces/User";
import type { WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";
import { useUpdateUserInfo } from "./user/useUpdateUserInfo";
import { useUpdateUserConfig } from "./user/useUpdateUserConfig";
import { useUserUpdateWP } from "./user/useUserUpdateWP";
import { convertSchedulesToWorkingPatternArray, normalizeSchedules } from "@/lib/workingPatternUtils";

export interface UserConfigSaveOptions {
    userInfo: IUser | null;
    currentUser: IUser | null;
    newPassword?: string;
    userPatternData?: WorkingPattern | null;
    userWorkingPattern?: IWorkingPattern | IWorkingPattern[] | null;
}

export interface UserConfigSaveResult {
    saveUserInfo: (
        options: UserConfigSaveOptions,
        onSuccess: (updatedUser: IUser) => void,
        onError: (error: string) => void
    ) => Promise<void>;
    saveUserPattern: (
        options: UserConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => Promise<void>;
    isLoading: boolean;
}

export function useUserConfigSave(): UserConfigSaveResult {
    const queryClient = useQueryClient();
    const updateUserInfo = useUpdateUserInfo();
    const updateUserConfig = useUpdateUserConfig();
    const updateUserWP = useUserUpdateWP();

    const saveUserInfo = async (
        options: UserConfigSaveOptions,
        onSuccess: (updatedUser: IUser) => void,
        onError: (error: string) => void
    ) => {
        const { userInfo, currentUser, newPassword } = options;

        if (!userInfo || !userInfo.id) {
            onError("No hay datos de usuario para guardar");
            return;
        }

        try {
            // Preparar datos a enviar
            const userDataToSend: Record<string, any> = {
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                // Por seguridad no se puede cambiar el role desde el navegador
                role: currentUser?.role
            };

            // Agregar password solo si se proporcionó una nueva
            if (newPassword) {
                userDataToSend.password = newPassword;
            }

            // Actualizar información del usuario
            await updateUserInfo.mutateAsync({
                userId: userInfo.id,
                data: userDataToSend
            });

            // Invalidar caché para refrescar datos
            await queryClient.invalidateQueries({ queryKey: ["user", userInfo.id] });
            await queryClient.invalidateQueries({ queryKey: ["userConfig", userInfo.id] });

            // Crear usuario actualizado (sin incluir el password por seguridad)
            const updatedUser = {
                ...userInfo,
                name: userDataToSend.name,
                email: userDataToSend.email,
                phone: userDataToSend.phone,
            };

            onSuccess(updatedUser as IUser);
        } catch (error) {
            onError(error instanceof Error ? error.message : "Error al actualizar el usuario");
            console.error("Error al guardar usuario:", error);
        }
    };

    const saveUserPattern = async (
        options: UserConfigSaveOptions,
        onSuccess: () => void,
        onError: (error: string) => void
    ) => {
        const { userInfo, userPatternData, userWorkingPattern } = options;

        if (!userInfo || !userInfo.id || !userPatternData) {
            onError("No hay datos de usuario para guardar");
            return;
        }

        try {
            // Normalizar schedules agregando null a los campos faltantes
            const normalizedSchedules = normalizeSchedules(userPatternData.schedules);

            // Convertir a IWorkingPattern[]
            const patternsToSend = convertSchedulesToWorkingPatternArray(
                normalizedSchedules,
                userWorkingPattern
            );

            // Actualizar horarios del usuario
            await updateUserWP.mutateAsync({
                userId: userInfo.id,
                data: patternsToSend
            });

            // Invalidar caché para refrescar datos
            await queryClient.invalidateQueries({ queryKey: ["userWP", userInfo.id] });

            onSuccess();
        } catch (error) {
            onError(error instanceof Error ? error.message : "Error al actualizar horarios");
            console.error("Error al guardar horarios de usuario:", error);
        }
    };

    return {
        saveUserInfo,
        saveUserPattern,
        isLoading: updateUserInfo.isPending || updateUserConfig.isPending || updateUserWP.isPending
    };
}

