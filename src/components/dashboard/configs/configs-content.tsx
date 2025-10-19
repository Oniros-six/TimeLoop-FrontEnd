import { userAtom } from "@/atoms/auth";
import { viewAtom } from "@/atoms/view";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import UserConfig from "./UserConfig";
import CommerceConfig from "./CommerceConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole, type IUser } from "@/interfaces/User";
import type { ICommerce } from "@/interfaces/Commerce";
import { commerceAtom } from "@/atoms/commerce";
import type { ICommerceConfig } from "@/interfaces/Config";

export default function () {
    //* Seteamos el nombre de la vista
    const [, setView] = useAtom(viewAtom);
    const [currentUser] = useAtom(userAtom);
    const [commerceData] = useAtom(commerceAtom);

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

    const handleSaveUser = () => {
        console.log(userInfo)
    }
    const handleSaveCommerce = () => {
        console.log(userInfo)
    }
    return (
        <Tabs defaultValue="usuario" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full max-w-md grid-cols-2 self-center">
                <TabsTrigger value="usuario">Usuario</TabsTrigger>
                <TabsTrigger disabled={!(currentUser?.role === UserRole.ADMIN)} value="comercio">Comercio</TabsTrigger>
            </TabsList>

            <TabsContent value="usuario" className="mt-6">
                <UserConfig userInfo={userInfo} setUserInfo={setUserInfo} handleSaveUser={handleSaveUser} />
            </TabsContent>

            <TabsContent value="comercio" className="mt-6">
                <CommerceConfig commerceConfig={commerceConfig} setCommerceConfig={setCommerceConfig} commerceInfo={commerceInfo} setCommerceInfo={setCommerceInfo} handleSaveCommerce={handleSaveCommerce} />
            </TabsContent>
        </Tabs>
    )
}