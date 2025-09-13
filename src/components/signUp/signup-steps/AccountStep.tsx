import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import type { SignupData } from "../MultiStepSignup"

interface AccountStepProps {
  data: SignupData
  updateData: (stepKey: keyof SignupData, data: any) => void
}

export function AccountStep({ data, updateData }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 10,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }

  const passwordValidation = validatePassword(data.account.password)
  const allPasswordRequirementsMet = Object.values(passwordValidation).every(Boolean)

  const handleInputChange = (field: string, value: string) => {
    updateData("account", { [field]: value })
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Cuenta</h3>
        <p className="text-muted-foreground">Crea tu cuenta para acceder al panel de administración</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Tu nombre</Label>
          <Input
            id="ownerName"
            type="text"
            placeholder="Juan Perez"
            value={data.account.ownerName}
            onChange={(e) => handleInputChange("ownerName", e.target.value)}
            className={errors.ownerName ? "border-red-500" : ""}
          />
          {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={data.account.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 10 caracteres"
              value={data.account.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
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

          {data.account.password && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
              <p className="text-sm font-medium text-gray-700">Requisitos de contraseña:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordValidation.length ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className={`text-sm ${passwordValidation.length ? "text-green-700" : "text-gray-500"}`}>
                    Mínimo 10 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className={`text-sm ${passwordValidation.hasNumber ? "text-green-700" : "text-gray-500"}`}>
                    Al menos un número
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordValidation.hasLetter ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className={`text-sm ${passwordValidation.hasLetter ? "text-green-700" : "text-gray-500"}`}>
                    Al menos una letra
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${passwordValidation.hasSymbol ? "bg-green-500" : "bg-gray-300"}`}
                  />
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

          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>


        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmación de contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={data.account.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
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
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  )
}
