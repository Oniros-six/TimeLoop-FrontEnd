import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useUploadLogo } from "@/hooks/commerce/useUploadLogo";
import { useAtom } from "jotai";
import { dashboardAtom } from "@/atoms/dashboard";

interface ICommerceConfigLogoProps {
    commerceName?: string;
}

export default function CommerceConfigLogo({ commerceName }: ICommerceConfigLogoProps) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoError, setLogoError] = useState<string>("");
    const [logoSuccessMessage, setLogoSuccessMessage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const uploadLogoMutation = useUploadLogo();
    const [dashboardData, setDashboardData] = useAtom(dashboardAtom);

    // Función para validar el archivo del logo
    const validateLogoFile = (file: File): string => {
        const maxSize = 1024 * 1024; // 1MB en bytes
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            return "Solo se permiten imágenes JPG, PNG o WEBP";
        }

        if (file.size > maxSize) {
            return "La imagen no puede pesar más de 1MB";
        }

        return "";
    };

    // Manejar selección de archivo
    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const error = validateLogoFile(file);
        if (error) {
            setLogoError(error);
            setLogoFile(null);
            setLogoPreview(null);
            return;
        }

        setLogoError("");
        setLogoFile(file);
        setLogoSuccessMessage("");

        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Limpiar logo seleccionado
    const handleClearLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        setLogoError("");
        setLogoSuccessMessage("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Guardar logo
    const handleSaveLogo = async () => {
        if (!logoFile) {
            setLogoError("Por favor selecciona una imagen primero");
            return;
        }

        setLogoError("");
        setLogoSuccessMessage("");

        try {
            const response = await uploadLogoMutation.mutateAsync(logoFile);
            
            // Actualizar localStorage con la nueva URL del logo
            if (response.logoUrl) {
                localStorage.setItem('logoURL', response.logoUrl);
                
                // Actualizar el átomo dashboardData con la nueva URL
                if (dashboardData) {
                    setDashboardData({
                        ...dashboardData,
                        logoURL: response.logoUrl
                    });
                }
            }
            
            setLogoSuccessMessage("Logo guardado exitosamente");
            setLogoFile(null);
            setLogoPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error al guardar el logo. Inténtalo de nuevo.";
            setLogoError(errorMessage);
        }
    };

    return (
        <div className="space-y-3 border-b pb-4">
            <Label>Logo del comercio</Label>
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleLogoFileChange}
                                className={logoError ? "border-red-500" : ""}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Tamaño máximo: 1MB • Formatos: JPG, PNG, WEBP
                        </p>
                    </div>

                    {logoPreview && (
                        <div className="relative">
                            <div className="w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center bg-muted">
                                <img
                                    src={logoPreview}
                                    alt="Preview del logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={handleClearLogo}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    {!logoPreview && commerceName && (
                        <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {logoError && (
                    <p className="text-sm text-red-600">{logoError}</p>
                )}

                {logoSuccessMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-sm text-green-800">{logoSuccessMessage}</p>
                    </div>
                )}

                <Button
                    type="button"
                    onClick={handleSaveLogo}
                    disabled={!logoFile || uploadLogoMutation.isPending}
                    className="w-full sm:w-auto"
                    variant="secondary"
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadLogoMutation.isPending ? "Guardando logo..." : "Guardar logo"}
                </Button>
            </div>
        </div>
    );
}

