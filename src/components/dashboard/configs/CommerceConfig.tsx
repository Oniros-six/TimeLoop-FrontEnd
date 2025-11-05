import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { ICommerce } from "@/interfaces/Commerce";
import { BusinessCategory } from "@/interfaces/Commerce";
import { BillingTypes, PaymentMethod, type ICommerceConfig } from "@/interfaces/Config";
import { useCommerceConfigs } from "@/hooks/configs/commerce/useCommerceConfig";
import { Badge } from "@/components/ui/badge";
import CommerceConfigLogo from "./CommerceConfigLogo";

interface IConfigProps {
    commerceInfo: ICommerce | null
    setCommerceInfo: (commerce: ICommerce | null) => void
    handleSaveCommerce: () => void;
    commerceConfig: ICommerceConfig | null
    setCommerceConfig: (config: ICommerceConfig | null) => void
    saveErrorMessage?: string | null
    saveSuccessMessage?: string | null
    isLoading?: boolean
}

export default function CommerceConfig({ commerceConfig, setCommerceConfig, commerceInfo, setCommerceInfo, handleSaveCommerce, saveErrorMessage, saveSuccessMessage, isLoading }: IConfigProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const res = useCommerceConfigs()
    
    useEffect(() => {
        if (res.commerceConfig && !commerceConfig) {
            setCommerceConfig(res.commerceConfig)
        }
    }, [res.commerceConfig, commerceConfig, setCommerceConfig])

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

            case 'address':
                const trimmedAddress = (value || "").trim();
                if (!trimmedAddress) {
                    return "La dirección es obligatoria";
                } else if (trimmedAddress.length < 5) {
                    return "La dirección debe tener al menos 5 caracteres";
                } else if (trimmedAddress.length > 200) {
                    return "La dirección no puede superar 200 caracteres";
                }
                return "";

            case 'cancellationDeadlineMinutes':
                if (!value || value < 15 || value > 240) {
                    return "El plazo de cancelación debe estar entre 15 y 240 minutos";
                } else if (value % 15 !== 0) {
                    return "El plazo debe ser múltiplo de 15 minutos";
                }
                return "";

            case 'billingType':
                if (!value) {
                    return "El tipo de facturación es obligatorio";
                }
                return "";

            case 'welcomeMessage':
                const trimmedMessage = (value || "").trim();
                if (!trimmedMessage) {
                    return "El mensaje de bienvenida es obligatorio";
                } else if (trimmedMessage.length > 250) {
                    return "El mensaje no puede superar 250 caracteres";
                }
                return "";

            case 'acceptedPaymentMethods':
                if (!value || !Array.isArray(value) || value.length === 0) {
                    return "Debe seleccionar al menos un método de pago";
                }
                return "";

            default:
                return "";
        }
    };

    const validate = (): boolean => {
        if (!commerceInfo || !commerceConfig) return false;

        const newErrors: Record<string, string> = {};

        // Validar cada campo
        const nameError = validateField('name', commerceInfo.name);
        const emailError = validateField('email', commerceInfo.email);
        const phoneError = validateField('phone', commerceInfo.phone);
        const addressError = validateField('address', commerceInfo.address);
        const cancellationError = validateField('cancellationDeadlineMinutes', commerceConfig.cancellationDeadlineMinutes);
        const billingError = validateField('billingType', commerceConfig.billingType);
        const welcomeError = validateField('welcomeMessage', commerceConfig.welcomeMessage);
        const paymentError = validateField('acceptedPaymentMethods', commerceConfig.acceptedPaymentMethods);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (phoneError) newErrors.phone = phoneError;
        if (addressError) newErrors.address = addressError;
        if (cancellationError) newErrors.cancellationDeadlineMinutes = cancellationError;
        if (billingError) newErrors.billingType = billingError;
        if (welcomeError) newErrors.welcomeMessage = welcomeError;
        if (paymentError) newErrors.acceptedPaymentMethods = paymentError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (field: string, value: any) => {
        // Campos que pertenecen a commerceInfo
        const commerceInfoFields = ['name', 'email', 'phone', 'address', 'businessCategory'];

        if (commerceInfoFields.includes(field)) {
            if (!commerceInfo) return;
            setCommerceInfo({ ...commerceInfo, [field]: value });
        } else {
            // Campos que pertenecen a commerceConfig
            if (!commerceConfig) return;
            setCommerceConfig({ ...commerceConfig, [field]: value });
        }

        // Validar el campo en tiempo real
        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const handlePaymentMethodChange = (paymentMethod: PaymentMethod, checked: boolean) => {
        if (!commerceConfig) return;

        let newPaymentMethods: PaymentMethod[];
        if (checked) {
            newPaymentMethods = [...(commerceConfig.acceptedPaymentMethods || []), paymentMethod];
        } else {
            newPaymentMethods = (commerceConfig.acceptedPaymentMethods || []).filter(method => method !== paymentMethod);
        }

        setCommerceConfig({ ...commerceConfig, acceptedPaymentMethods: newPaymentMethods });

        // Validar el campo en tiempo real
        const error = validateField('acceptedPaymentMethods', newPaymentMethods);
        setErrors(prev => ({
            ...prev,
            acceptedPaymentMethods: error
        }));
    };

    const handleSave = () => {
        if (validate()) {
            handleSaveCommerce();
            setErrors({});
        }
    };

    return (
        <Card className="relative">
            <CardHeader className="px-3 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Información del Comercio</CardTitle>
                        <CardDescription>Actualiza los datos de tu negocio</CardDescription>
                    </div>

                    <Badge className="absolute right-2 top-2">{commerceInfo?.active ? "Activo" : "Inactivo"}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-3 sm:px-6">
                <CommerceConfigLogo commerceName={commerceInfo?.name} />

                <div className="space-y-2">
                    <Label htmlFor="commerce-name">Nombre del comercio</Label>
                    <Input
                        id="commerce-name"
                        value={commerceInfo?.name || ''}
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
                    <Label htmlFor="commerce-email">Email</Label>
                    <Input
                        id="commerce-email"
                        type="email"
                        value={commerceInfo?.email || ''}
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
                    <Label htmlFor="commerce-phone">Teléfono</Label>
                    <Input
                        id="commerce-phone"
                        type="tel"
                        value={commerceInfo?.phone || ''}
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
                    <Label htmlFor="commerce-address">Dirección</Label>
                    <Input
                        id="commerce-address"
                        value={commerceInfo?.address || ''}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        maxLength={200}
                        aria-invalid={!!errors.address}
                        aria-describedby="address-error"
                        className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                        <p id="address-error" className="text-sm text-red-600">{errors.address}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="commerce-category">Categoría del negocio</Label>
                    <Select
                        value={commerceInfo?.businessCategory || ''}
                        onValueChange={(value) => handleFieldChange('businessCategory', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(BusinessCategory).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cancellation-deadline">Plazo de cancelación</Label>
                    <Select
                        value={commerceConfig?.cancellationDeadlineMinutes?.toString() || ''}
                        onValueChange={(value) => handleFieldChange('cancellationDeadlineMinutes', parseInt(value))}
                    >
                        <SelectTrigger className={errors.cancellationDeadlineMinutes ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecciona el plazo de cancelación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="120">2 horas</SelectItem>
                            <SelectItem value="240">4 horas</SelectItem>
                            <SelectItem value="1440">24 horas</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.cancellationDeadlineMinutes && (
                        <p className="text-sm text-red-600">{errors.cancellationDeadlineMinutes}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="billing-type">Tipo de facturación</Label>
                    <Select
                        value={commerceConfig?.billingType || ''}
                        onValueChange={(value) => handleFieldChange('billingType', value)}
                    >
                        <SelectTrigger className={errors.billingType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecciona el tipo de facturación" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(BillingTypes).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type === BillingTypes.FLEXIBLE ? "Flexible" : "Tarifa fija"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.billingType && (
                        <p className="text-sm text-red-600">{errors.billingType}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="welcome-message">Mensaje de bienvenida</Label>
                    <Textarea
                        id="welcome-message"
                        value={commerceConfig?.welcomeMessage || ''}
                        onChange={(e) => handleFieldChange('welcomeMessage', e.target.value)}
                        maxLength={250}
                        rows={3}
                        className={errors.welcomeMessage ? "border-red-500" : ""}
                        placeholder="Escribe tu mensaje de bienvenida..."
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{errors.welcomeMessage && <span className="text-red-600">{errors.welcomeMessage}</span>}</span>
                        <span>{(commerceConfig?.welcomeMessage || '').length}/250</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Métodos de pago aceptados</Label>
                    <div className="space-y-2">
                        {Object.values(PaymentMethod).map((method) => (
                            <div key={method} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`payment-${method}`}
                                    checked={(commerceConfig?.acceptedPaymentMethods || []).includes(method)}
                                    onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)}
                                />
                                <Label htmlFor={`payment-${method}`} className="text-sm font-normal">
                                    {method === PaymentMethod.MERCADO_PAGO ? 'Mercado Pago' : 'Efectivo'}
                                </Label>
                            </div>
                        ))}
                    </div>
                    {errors.acceptedPaymentMethods && (
                        <p className="text-sm text-red-600">{errors.acceptedPaymentMethods}</p>
                    )}
                </div>

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