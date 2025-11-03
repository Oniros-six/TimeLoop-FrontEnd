import { userAtom } from "@/atoms/auth";
import { viewAtom } from "@/atoms/view";
import { commerceAtom } from "@/atoms/commerce";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import UserConfig from "./UserConfig";
import CommerceConfig from "./CommerceConfig";
import ConfigTab from "./ConfigTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, type IUser } from "@/interfaces/User";
import type { ICommerce } from "@/interfaces/Commerce";
import type { ICommerceConfig } from "@/interfaces/Config";
import { useUserWorkingPattern } from "@/hooks/configs/user/useUserWorkingPattern";
import { useCommerceWorkingPattern } from "@/hooks/configs/commerce/useCommerceWorkingPattern";
import { useConfigMessages } from "@/hooks/configs/useConfigMessages";
import { useWorkingPatternSync } from "@/hooks/configs/useWorkingPatternSync";
import { useUserConfigSave } from "@/hooks/configs/useUserConfigSave";
import { useCommerceConfigSave } from "@/hooks/configs/useCommerceConfigSave";

export default function () {
    //* Seteamos el nombre de la vista
    const [, setView] = useAtom(viewAtom);
    const [currentUser, setCurrentUser] = useAtom(userAtom);
    const [commerceData, setCommerceData] = useAtom(commerceAtom);

    useEffect(() => {
        setView("Configuración");
    }, [setView]);

    //* Estado para información del usuario
    const [userInfo, setUserInfo] = useState<IUser | null>(currentUser || null);
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    //* Estado para información del comercio
    const [commerceInfo, setCommerceInfo] = useState<ICommerce | null>(commerceData);
    const [commerceConfig, setCommerceConfig] = useState<ICommerceConfig | null>(null);

    useEffect(() => {
        setCommerceInfo(commerceData);
    }, [commerceData]);

    //* Mensajes de estado
    const userMessages = useConfigMessages();
    const commerceMessages = useConfigMessages();

    //* Working Pattern Hooks
    const { userWorkingPattern } = useUserWorkingPattern();
    const { commerceWorkingPattern } = useCommerceWorkingPattern();

    //* Sincronización de Working Patterns
    const userPatternSync = useWorkingPatternSync(userWorkingPattern);
    const commercePatternSync = useWorkingPatternSync(commerceWorkingPattern);

    //* Hooks para guardar configuraciones
    const userConfigSave = useUserConfigSave();
    const commerceConfigSave = useCommerceConfigSave();

    //* Handlers para guardar información de usuario
    const handleSaveUser = async () => {
        userMessages.clearMessages();
        await userConfigSave.saveUserInfo(
            {
                userInfo,
                currentUser,
                newPassword
            },
            (updatedUser) => {
                setCurrentUser(updatedUser);
                setUserInfo(updatedUser);
                userMessages.setSuccessMessage("Usuario actualizado correctamente");
                setNewPassword("");
                setConfirmPassword("");
            },
            (error) => {
                userMessages.setErrorMessage(error);
            }
        );
    };

    //* Handlers para guardar horarios de usuario
    const handleSaveUserPattern = async () => {
        userMessages.clearMessages();
        await userConfigSave.saveUserPattern(
            {
                userInfo,
                currentUser,
                userPatternData: userPatternSync.patternData,
                userWorkingPattern
            },
            () => {
                userMessages.setSuccessMessage("Horarios de usuario actualizados correctamente");
            },
            (error) => {
                userMessages.setErrorMessage(error);
            }
        );
    };

    //* Handlers para guardar información de comercio
    const handleSaveCommerce = async () => {
        commerceMessages.clearMessages();
        await commerceConfigSave.saveCommerceInfo(
            {
                commerceInfo,
                commerceConfig
            },
            () => {
                if (commerceInfo) {
                    setCommerceData(commerceInfo);
                }
                commerceMessages.setSuccessMessage("Comercio actualizado correctamente");
            },
            (error) => {
                commerceMessages.setErrorMessage(error);
            }
        );
    };

    //* Handlers para guardar horarios de comercio
    const handleSaveCommercePattern = async () => {
        commerceMessages.clearMessages();
        await commerceConfigSave.saveCommercePattern(
            {
                commerceInfo,
                commerceConfig,
                commercePatternData: commercePatternSync.patternData,
                commerceWorkingPattern
            },
            () => {
                commerceMessages.setSuccessMessage("Horarios de comercio actualizados correctamente");
            },
            (error) => {
                commerceMessages.setErrorMessage(error);
            }
        );
    };

    return (
        <Tabs defaultValue="usuario" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full max-w-md grid-cols-2 self-center">
                <TabsTrigger className="cursor-pointer" value="usuario">Usuario</TabsTrigger>
                <TabsTrigger 
                    className="cursor-pointer" 
                    disabled={!(currentUser?.role === UserRole.ADMIN)} 
                    value="comercio"
                >
                    Comercio
                </TabsTrigger>
            </TabsList>

            <TabsContent value="usuario" className="mt-6">
                <ConfigTab
                    basicContent={
                        <UserConfig
                            userInfo={userInfo}
                            setUserInfo={setUserInfo}
                            handleSaveUser={handleSaveUser}
                            saveErrorMessage={userMessages.errorMessage}
                            saveSuccessMessage={userMessages.successMessage}
                            isLoading={userConfigSave.isLoading}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                        />
                    }
                    workingPatternData={userPatternSync.patternData || { workingDays: [], schedules: {} }}
                    onWorkingPatternChange={userPatternSync.handlePatternChange}
                    workingPatternErrors={userPatternSync.patternErrors}
                    onWorkingPatternErrorChange={userPatternSync.handleErrorChange}
                    workingPatternTitle="Horarios de Usuario"
                    workingPatternDescription="Define tus días y horarios de trabajo"
                    onSaveWorkingPattern={handleSaveUserPattern}
                    isLoadingWorkingPattern={userConfigSave.isLoading}
                    workingPatternErrorMessage={userMessages.errorMessage}
                    workingPatternSuccessMessage={userMessages.successMessage}
                />
            </TabsContent>

            <TabsContent value="comercio" className="mt-6">
                <ConfigTab
                    basicContent={
                        <CommerceConfig
                            commerceConfig={commerceConfig}
                            setCommerceConfig={setCommerceConfig}
                            commerceInfo={commerceInfo}
                            setCommerceInfo={setCommerceInfo}
                            handleSaveCommerce={handleSaveCommerce}
                            saveErrorMessage={commerceMessages.errorMessage}
                            saveSuccessMessage={commerceMessages.successMessage}
                            isLoading={commerceConfigSave.isLoading}
                        />
                    }
                    workingPatternData={commercePatternSync.patternData || { workingDays: [], schedules: {} }}
                    onWorkingPatternChange={commercePatternSync.handlePatternChange}
                    workingPatternErrors={commercePatternSync.patternErrors}
                    onWorkingPatternErrorChange={commercePatternSync.handleErrorChange}
                    workingPatternTitle="Horarios de Comercio"
                    workingPatternDescription="Define los días y horarios de atención del comercio"
                    onSaveWorkingPattern={handleSaveCommercePattern}
                    isLoadingWorkingPattern={commerceConfigSave.isLoading}
                    workingPatternErrorMessage={commerceMessages.errorMessage}
                    workingPatternSuccessMessage={commerceMessages.successMessage}
                />
            </TabsContent>
        </Tabs>
    );
}
