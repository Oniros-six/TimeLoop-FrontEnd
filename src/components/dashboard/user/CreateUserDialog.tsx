import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserRole } from "@/interfaces/User";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ErrorDisplay from "../ErrorDisplay";

interface PropsInterface {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (userData: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }) => void;
    isPending?: boolean;
    errorMessage?: string | null | undefined;
    onClearError?: () => void;
}

export default function CreateUserDialog({ open, onOpenChange, onConfirm, isPending = false, errorMessage, onClearError }: PropsInterface) {
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: UserRole.EMPLOYEE,
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password: string) => {
        return {
            length: password.length >= 10,
            hasNumber: /\d/.test(password),
            hasLetter: /[a-zA-Z]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        }
    }

    const passwordValidation = validatePassword(newUser.password);
    const allPasswordRequirementsMet = Object.values(passwordValidation).every(Boolean);
    const passwordsMatch = newUser.password === confirmPassword && confirmPassword.length > 0;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Nombre
        const trimmedName = (newUser.name || "").trim();
        if (!trimmedName) {
            newErrors.name = "El nombre es obligatorio";
        } else if (trimmedName.length < 3) {
            newErrors.name = "El nombre debe tener al menos 3 caracteres";
        } else if (trimmedName.length > 50) {
            newErrors.name = "El nombre no puede superar 50 caracteres";
        }

        // Email
        if (!newUser.email) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
            newErrors.email = "Por favor ingresa un email válido";
        } else if ((newUser.email || "").length > 100) {
            newErrors.email = "El email no puede superar 100 caracteres";
        }

        // Password fuerte (≥10, letras, números y símbolo)
        const hasMinLen = newUser.password && newUser.password.length >= 10;
        const hasNumber = /\d/.test(newUser.password || "");
        const hasLetter = /[a-zA-Z]/.test(newUser.password || "");
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newUser.password || "");
        if (!newUser.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (!(hasMinLen && hasNumber && hasLetter && hasSymbol)) {
            newErrors.password = "La contraseña debe tener al menos 10 caracteres, números, letras y símbolos";
        }

        // Confirmación contraseña
        if (!confirmPassword) {
            newErrors.confirmPassword = "La confirmación de contraseña es obligatoria";
        } else if (newUser.password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = () => {
        if (validate()) {
            onConfirm(newUser);
            // Reset form
            setNewUser({
                name: "",
                email: "",
                password: "",
                role: UserRole.EMPLOYEE,
            });
            setConfirmPassword("");
            setErrors({});
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar nuevo usuario</DialogTitle>
                    <DialogDescription>
                        Completa los datos del nuevo usuario. Haz clic en guardar cuando termines.
                    </DialogDescription>
                </DialogHeader>

                <ErrorDisplay
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                            id="name"
                            placeholder="Ej: Juan Pérez"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            maxLength={50}
                            aria-invalid={!!errors.name}
                            aria-describedby="name-error"
                        />
                        {errors.name && (
                            <p id="name-error" className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="juan.perez@email.com"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            maxLength={100}
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                        {errors.email && (
                            <p id="email-error" className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 10 caracteres"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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

                        {newUser.password && (
                            <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
                                <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? "bg-green-500" : "bg-gray-300"}`} />
                                        <span className={`text-sm ${passwordValidation.length ? "text-green-700" : "text-gray-500"}`}>
                                            Mínimo 10 caracteres
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? "bg-green-500" : "bg-gray-300"}`} />
                                        <span className={`text-sm ${passwordValidation.hasNumber ? "text-green-700" : "text-gray-500"}`}>
                                            Al menos un número
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLetter ? "bg-green-500" : "bg-gray-300"}`} />
                                        <span className={`text-sm ${passwordValidation.hasLetter ? "text-green-700" : "text-gray-500"}`}>
                                            Al menos una letra
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${passwordValidation.hasSymbol ? "bg-green-500" : "bg-gray-300"}`} />
                                        <span className={`text-sm ${passwordValidation.hasSymbol ? "text-green-700" : "text-gray-500"}`}>
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

                        {errors.password && (
                            <p id="password-error" className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Repetir contraseña</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Vuelve a escribir la contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby="confirmPassword-error"
                                className={`pr-10 ${errors.confirmPassword ? "border-red-500" : passwordsMatch ? "border-green-500" : ""}`}
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

                        {/* Indicador de coincidencia de contraseñas */}
                        {confirmPassword.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${passwordsMatch ? "bg-green-500" : "bg-red-500"}`} />
                                <span className={`text-sm ${passwordsMatch ? "text-green-700" : "text-red-500"}`}>
                                    {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                                </span>
                            </div>
                        )}

                        {errors.confirmPassword && (
                            <p id="confirmPassword-error" className="text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                            value={newUser.role}
                            onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={UserRole.EMPLOYEE}>Colaborador</SelectItem>
                                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        {isPending ? "Creando..." : "Guardar usuario"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}