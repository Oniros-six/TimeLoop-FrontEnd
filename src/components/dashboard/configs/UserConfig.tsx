import { UserRole, type IUser } from "@/interfaces/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IConfigProps {
    userInfo: IUser | null
    setUserInfo: (user: IUser | null) => void
    handleSaveUser: () => void;
    saveErrorMessage?: string | null
    saveSuccessMessage?: string | null
    isLoading?: boolean
    newPassword: string
    setNewPassword: (password: string) => void
    confirmPassword: string
    setConfirmPassword: (password: string) => void
}

export default function UserConfig({ userInfo, setUserInfo, handleSaveUser, saveErrorMessage, saveSuccessMessage, isLoading, newPassword, setNewPassword, confirmPassword, setConfirmPassword }: IConfigProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validación de contraseña
    const validatePassword = (password: string) => {
        return {
            length: password.length >= 10,
            hasNumber: /\d/.test(password),
            hasLetter: /[a-zA-Z]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        }
    }

    const passwordValidation = newPassword ? validatePassword(newPassword) : null
    const allPasswordRequirementsMet = passwordValidation ? Object.values(passwordValidation).every(Boolean) : false
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0

    const validateField = (field: string, value: any): string => {
        switch (field) {
            case 'name':
                const trimmedName = (value || "").trim();
                if (!trimmedName) {
                    return "El nombre es obligatorio";
                } else if (trimmedName.length < 3) {
                    return "El nombre debe tener al menos 3 caracteres";
                } else if (trimmedName.length > 50) {
                    return "El nombre no puede superar 50 caracteres";
                }
                return "";

            case 'email':
                if (!value) {
                    return "El email es obligatorio";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Por favor ingresa un email válido";
                } else if ((value || "").length > 100) {
                    return "El email no puede superar 100 caracteres";
                }
                return "";

            case 'phone':
                if (value && value.toString().length > 0) {
                    const phoneStr = value.toString();
                    if (!/^\d+$/.test(phoneStr)) {
                        return "El teléfono solo puede contener números";
                    } else if (!phoneStr.startsWith('09')) {
                        return "El teléfono debe empezar por 09";
                    } else if (phoneStr.length !== 9) {
                        return "El teléfono debe tener exactamente 9 dígitos";
                    }
                }
                return "";

            default:
                return "";
        }
    };

    const validate = (): boolean => {
        if (!userInfo) return false;

        const newErrors: Record<string, string> = {};

        // Validar cada campo
        const nameError = validateField('name', userInfo.name);
        const emailError = validateField('email', userInfo.email);
        const phoneError = validateField('phone', userInfo.phone);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (phoneError) newErrors.phone = phoneError;

        // Validar password si se proporcionó
        if (newPassword) {
            if (!allPasswordRequirementsMet) {
                return false;
            }
            
            if (newPassword !== confirmPassword) {
                return false;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (field: string, value: any) => {
        if (!userInfo) return;

        // Actualizar el valor del campo
        setUserInfo({ ...userInfo, [field]: value });

        // Validar el campo en tiempo real
        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const handleSave = () => {
        if (validate()) {
            handleSaveUser();
            setErrors({});
        }
    };
    return (
        <Card>
            <CardHeader className="px-3 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Información del Usuario</CardTitle>
                        <CardDescription>Actualiza tus datos personales</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-3 sm:px-6">
                <div className="space-y-2">
                    <Label htmlFor="user-name">Nombre completo</Label>
                    <Input
                        id="user-name"
                        value={userInfo?.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        maxLength={50}
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p id="name-error" className="text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                        id="user-email"
                        type="email"
                        value={userInfo?.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        maxLength={100}
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                        <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-phone">Teléfono</Label>
                    <Input
                        id="user-phone"
                        type="tel"
                        value={userInfo?.phone?.toString() || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        maxLength={9}
                        aria-invalid={!!errors.phone}
                        aria-describedby="phone-error"
                        className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                        <p id="phone-error" className="text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-role">Rol</Label>
                    <Input id="user-role" value={userInfo?.role === UserRole.ADMIN ? "Administrador" : "Colaborador"} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-password">Contraseña</Label>
                    <div className="relative">
                        <Input
                            id="user-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Completar para cambiar la contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>

                    {newPassword && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
                            <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${passwordValidation?.length ? "bg-green-500" : "bg-gray-300"}`}
                                    />
                                    <span className={`text-sm ${passwordValidation?.length ? "text-green-700" : "text-gray-500"}`}>
                                        Mínimo 10 caracteres
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${passwordValidation?.hasNumber ? "bg-green-500" : "bg-gray-300"}`}
                                    />
                                    <span className={`text-sm ${passwordValidation?.hasNumber ? "text-green-700" : "text-gray-500"}`}>
                                        Al menos un número
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${passwordValidation?.hasLetter ? "bg-green-500" : "bg-gray-300"}`}
                                    />
                                    <span className={`text-sm ${passwordValidation?.hasLetter ? "text-green-700" : "text-gray-500"}`}>
                                        Al menos una letra
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${passwordValidation?.hasSymbol ? "bg-green-500" : "bg-gray-300"}`}
                                    />
                                    <span className={`text-sm ${passwordValidation?.hasSymbol ? "text-green-700" : "text-gray-500"}`}>
                                        Al menos un símbolo (!@#$%^&*)
                                    </span>
                                </div>
                            </div>
                            {allPasswordRequirementsMet && (
                                <div className="flex items-center gap-2 pt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium text-green-700">¡Contraseña segura!</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {newPassword && (
                    <div className="space-y-2">
                        <Label htmlFor="user-confirm-password">Confirmar Nueva Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="user-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={passwordsMatch ? "border-green-500" : ""}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        
                        {confirmPassword.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${passwordsMatch ? "bg-green-500" : "bg-red-500"}`}
                                />
                                <span className={`text-sm ${passwordsMatch ? "text-green-700" : "text-red-500"}`}>
                                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {saveErrorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-800">{saveErrorMessage}</p>
                    </div>
                )}

                {saveSuccessMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-sm text-green-800">{saveSuccessMessage}</p>
                    </div>
                )}

                <Button onClick={handleSave} className="w-full" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
            </CardContent>
        </Card>
    )
}