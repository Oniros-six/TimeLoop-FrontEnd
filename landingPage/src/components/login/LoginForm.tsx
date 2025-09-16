import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
  errors?: Record<string, string>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, errors = {}, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido"
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    }

    // Establecer los errores de validación
    setValidationErrors(newErrors)
    
    // Retornar true si no hay errores
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario
    const isValid = validateForm()
    
    if (isValid) {
      // Si es válido, enviar los datos
      onSubmit?.(formData)
    }
    // Si no es válido, los errores ya se establecieron en validateForm()
  }

  const displayErrors = { ...validationErrors, ...errors }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Iniciar Sesión</h3>
        <p className="text-muted-foreground">Ingresa a tu cuenta para acceder al panel de administración</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={displayErrors.email ? "border-red-500" : ""}
          />
          {displayErrors.email && <p className="text-sm text-red-500">{displayErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={displayErrors.password ? "border-red-500 pr-10" : "pr-10"}
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
          {displayErrors.password && <p className="text-sm text-red-500">{displayErrors.password}</p>}
        </div>

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>

      </form>
    </div>
  )
}
