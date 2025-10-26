import { userAtom } from "@/atoms/auth";
import { viewAtom } from "@/atoms/view";
import { useAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";
import UserConfig from "./UserConfig";
import CommerceConfig from "./CommerceConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, type IUser } from "@/interfaces/User";
import type { ICommerce } from "@/interfaces/Commerce";
import { commerceAtom } from "@/atoms/commerce";
import type { ICommerceConfig } from "@/interfaces/Config";
import { WorkingPatternSelector, type WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector"
import { useUserWorkingPattern } from "@/hooks/configs/user/useUserWorkingPattern";
import { useCommerceWorkingPattern } from "@/hooks/configs/commerce/useCommerceWorkingPattern";
import { useUpdateCommerceInfo } from "@/hooks/configs/commerce/useUpdateCommerceInfo";
import { useUpdateCommerceConfig } from "@/hooks/configs/commerce/useUpdateCommerceConfig";
import convertToWorkingPattern from "./WorkingPatternTransformer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

export default function () {
    //* Seteamos el nombre de la vista
    const [, setView] = useAtom(viewAtom);
    const [currentUser] = useAtom(userAtom);
    const [commerceData, setCommerceData] = useAtom(commerceAtom);

    useEffect(() => {
        setView("Configuración");
    }, [setView]);

    //* Estado para información del usuario
    const [userInfo, setUserInfo] = useState<IUser | null>(currentUser || null)

    //* Estado para información del comercio
    const [commerceInfo, setCommerceInfo] = useState<ICommerce | null>(commerceData)
    const [commerceConfig, setCommerceConfig] = useState<ICommerceConfig | null>(null)

    useEffect(() => {
        setCommerceInfo(commerceData);
    }, [commerceData]);

    //* Estados para mensajes de guardado
    const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

    //* Hooks para actualizar comercio
    const queryClient = useQueryClient();
    const updateCommerceInfo = useUpdateCommerceInfo();
    const updateCommerceConfig = useUpdateCommerceConfig();

    const handleSaveUser = () => {
        console.log(userInfo)
    }

    const handleSaveCommerce = async () => {
        if (!commerceInfo || !commerceConfig || !commerceInfo.id) {
            setSaveErrorMessage("No hay datos de comercio para guardar");
            return;
        }

        try {
            setSaveErrorMessage(null);
            setSaveSuccessMessage(null);

            //! Filtrar solo los campos permitidos para commerceInfo
            //TODO Luego tengo que agregar el logo y quizas mas datos
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

            // Actualizar átomo con la nueva información
            setCommerceData(commerceInfo);

            setSaveSuccessMessage("Comercio actualizado correctamente");
        } catch (error) {
            setSaveErrorMessage(error instanceof Error ? error.message : "Error al actualizar el comercio");
            console.error("Error al guardar comercio:", error);
        }
    }

    //* WORKING PATTERN HOOKS
    const { userWorkingPattern, loading: userLoading, error: userError } = useUserWorkingPattern()
    const { commerceWorkingPattern, loading: commerceLoading, error: commerceError } = useCommerceWorkingPattern()

    //* Estados para errores locales
    const [userPatternErrors, setUserPatternErrors] = useState<Record<string, string>>({})
    const [commercePatternErrors, setCommercePatternErrors] = useState<Record<string, string>>({})

    //* Estados locales para patrones de trabajo editables
    const [userPatternData, setUserPatternData] = useState<WorkingPattern | null>(null)
    const [commercePatternData, setCommercePatternData] = useState<WorkingPattern | null>(null)

    //* Sincronizar con los datos iniciales cuando cambien
    useEffect(() => {
        const converted = convertToWorkingPattern(userWorkingPattern)
        setUserPatternData(converted)
    }, [userWorkingPattern])

    useEffect(() => {
        const converted = convertToWorkingPattern(commerceWorkingPattern)
        setCommercePatternData(converted)
    }, [commerceWorkingPattern])

    //* Manejar cambios en el patrón de trabajo del usuario
    const handleUserWorkingPatternChange = useCallback((newPattern: WorkingPattern) => {
        setUserPatternData(newPattern)
    }, [])

    //* Manejar cambios en errores del patrón de trabajo del usuario
    const handleUserPatternErrorChange = useCallback((newErrors: Record<string, string>) => {
        setUserPatternErrors(newErrors)
    }, [])

    //* Manejar cambios en el patrón de trabajo del comercio
    const handleCommerceWorkingPatternChange = useCallback((newPattern: WorkingPattern) => {
        setCommercePatternData(newPattern)
    }, [])

    //* Manejar cambios en errores del patrón de trabajo del comercio
    const handleCommercePatternErrorChange = useCallback((newErrors: Record<string, string>) => {
        setCommercePatternErrors(newErrors)
    }, [])

    //* Guardar cambios del usuario
    const handleSaveUserPattern = () => {
        console.log('Guardando horarios de usuario:', userPatternData)
        // Aquí implementarás la llamada a la API
    }

    //* Guardar cambios del comercio
    const handleSaveCommercePattern = () => {
        console.log('Guardando horarios de comercio:', commercePatternData)
        // Aquí implementarás la llamada a la API
    }
    return (
        <Tabs defaultValue="usuario" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full max-w-md grid-cols-2 self-center">
                <TabsTrigger className="cursor-pointer" value="usuario">Usuario</TabsTrigger>
                <TabsTrigger className="cursor-pointer" disabled={!(currentUser?.role === UserRole.ADMIN)} value="comercio">Comercio</TabsTrigger>
            </TabsList>

            <TabsContent value="usuario" className="mt-6">
                <Tabs defaultValue="basico" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
                        <TabsTrigger className="cursor-pointer" value="basico">Básico</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="horarios">Horarios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basico">
                        <UserConfig userInfo={userInfo} setUserInfo={setUserInfo} handleSaveUser={handleSaveUser} />
                    </TabsContent>

                    <TabsContent value="horarios">
                        {
                            <Card>
                                <CardContent className="px-3 sm:px-6">
                                    <WorkingPatternSelector
                                        data={userPatternData || { workingDays: [], schedules: {} }}
                                        onChange={handleUserWorkingPatternChange}
                                        errors={userPatternErrors}
                                        onErrorChange={handleUserPatternErrorChange}
                                        title="Horarios de Usuario"
                                        description="Define tus días y horarios de trabajo"
                                        showTitle={true}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={handleSaveCommercePattern}>
                                        Guardar Cambios
                                    </Button>
                                </CardFooter>
                            </Card>
                        }
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="comercio" className="mt-6">
                <Tabs defaultValue="basico" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
                        <TabsTrigger className="cursor-pointer" value="basico">Básico</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="horarios">Horarios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basico">
                        <CommerceConfig
                            commerceConfig={commerceConfig}
                            setCommerceConfig={setCommerceConfig}
                            commerceInfo={commerceInfo}
                            setCommerceInfo={setCommerceInfo}
                            handleSaveCommerce={handleSaveCommerce}
                            saveErrorMessage={saveErrorMessage}
                            saveSuccessMessage={saveSuccessMessage}
                            isLoading={updateCommerceInfo.isPending || updateCommerceConfig.isPending}
                        />
                    </TabsContent>

                    <TabsContent value="horarios">
                        {
                            <Card>
                                <CardContent className="px-3 sm:px-6">
                                    <WorkingPatternSelector
                                        data={commercePatternData || { workingDays: [], schedules: {} }}
                                        onChange={handleCommerceWorkingPatternChange}
                                        errors={commercePatternErrors}
                                        onErrorChange={handleCommercePatternErrorChange}
                                        title="Horarios de Comercio"
                                        description="Define los días y horarios de atención del comercio"
                                        showTitle={true}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={handleSaveCommercePattern}>
                                        Guardar Cambios
                                    </Button>
                                </CardFooter>
                            </Card>
                        }
                    </TabsContent>
                </Tabs>
            </TabsContent >
        </Tabs >
    )
}