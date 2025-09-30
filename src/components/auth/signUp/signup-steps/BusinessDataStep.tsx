import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SignupData } from "../MultiStepSignup"

interface BusinessDataStepProps {
  data: SignupData
  updateData: (stepKey: keyof SignupData, data: any) => void
  errors: Record<string, string>
  clearErrors: () => void
}

const BUSINESS_TYPES = [
  "Peluqueria",
  "Barberia",
  "Estetica",
  "Spa",
  "Salon",
  "Masajes",
  "Otro"
]

export function BusinessDataStep({ data, updateData, errors, clearErrors }: BusinessDataStepProps) {
  const handleInputChange = (field: string, value: string) => {
    updateData("businessData", { [field]: value })
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      clearErrors()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Datos del comercio</h3>
        <p className="text-muted-foreground">Cuéntanos sobre tu negocio</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Nombre del comercio</Label>
          <Input
            id="businessName"
            placeholder="Ej: Salón María Elena"
            value={data.businessData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Rubro</Label>
          <Select
            value={data.businessData.businessType}
            onValueChange={(value) => handleInputChange("businessType", value)}
          >
            <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecciona el rubro" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-sm text-red-500">{errors.businessType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Calle, número, ciudad"
            value={data.businessData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono / WhatsApp</Label>
          <Input
            id="phone"
            placeholder="Ej: 098123456 (9 dígitos)"
            value={data.businessData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>
    </div>
  )
}
