import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AccountStep } from "./signup-steps/AccountStep"
import { BusinessDataStep } from "./signup-steps/BusinessDataStep"
import { InitialConfigStep } from "./signup-steps/InitialConfigStep"
import { WelcomeStep } from "./signup-steps/WelcomeStep"

export interface SignupData {
  account: {
    ownerName: string
    email: string
    password: string
    confirmPassword: string
  }
  businessData: {
    businessName: string
    businessType: string
    address: string
    phone: string
  }
  initialConfig: {
    workingDays: string[]
    schedules: Record<
      string,
      {
        morningOpen?: string
        morningClose?: string
        afternoonOpen?: string
        afternoonClose?: string
      }
    >
  }
}

const STEPS = [
  {
    id: "account",
    title: "Cuenta",
    description: "Email y contraseña",
  },
  {
    id: "business-data",
    title: "Datos del comercio",
    description: "Información de tu negocio",
  },
  {
    id: "initial-config",
    title: "Configuración inicial",
    description: "Días y horarios de atención",
  },
  {
    id: "welcome",
    title: "Confirmación",
    description: "Bienvenida y resumen",
  },
]

export function MultiStepSignup() {
  const backendURL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000'
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [stepErrors, setStepErrors] = useState<Record<string, Record<string, string>>>({})
  const [signupData, setSignupData] = useState<SignupData>({
    account: {
      ownerName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    businessData: {
      businessName: "",
      businessType: "",
      address: "",
      phone: "",
    },
    initialConfig: {
      workingDays: [],
      schedules: {},
    },
  })

  // Función para actualizar datos de un paso específico
  const updateStepData = (stepKey: keyof SignupData, data: any) => {
    setSignupData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }))
  }


  // Función para validar y mostrar errores del paso actual
  const validateAndShowErrors = (): boolean => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case 0: // Account step
        const { ownerName, email, password, confirmPassword } = signupData.account

        if (!ownerName.trim()) {
          errors.ownerName = 'El nombre es obligatorio'
        }

        if (!email) {
          errors.email = 'El email es obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.email = 'Por favor ingresa un email válido'
        }

        if (!password) {
          errors.password = 'La contraseña es obligatoria'
        } else if (password.length < 10 || !/\d/.test(password) || !/[a-zA-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          errors.password = 'La contraseña debe tener al menos 10 caracteres, números, letras y símbolos'
        }

        if (!confirmPassword) {
          errors.confirmPassword = 'La confirmación de contraseña es obligatoria'
        } else if (password !== confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden'
        }
        break

      case 1: // Business data step
        const { businessName, businessType, address, phone } = signupData.businessData

        if (!businessName.trim()) {
          errors.businessName = 'El nombre del comercio es obligatorio'
        }

        if (!businessType) {
          errors.businessType = 'Debes seleccionar un rubro'
        }

        if (!address.trim()) {
          errors.address = 'La dirección es obligatoria'
        }

        const phoneDigits = phone.replace(/\D/g, '')
        if (!phone) {
          errors.phone = 'El teléfono es obligatorio'
        } else if (phoneDigits.length !== 9) {
          errors.phone = 'El número de teléfono debe tener exactamente 9 dígitos'
        }
        break

      case 2: // Initial config step
        const { workingDays } = signupData.initialConfig

        if (workingDays.length === 0) {
          errors.workingDays = 'Selecciona al menos un día de trabajo'
        }
        break
    }

    // Guardar errores del paso actual
    setStepErrors(prev => ({
      ...prev,
      [currentStep]: errors
    }))

    return Object.keys(errors).length === 0
  }

  // Navegación entre pasos
  const goToNextStep = () => {
    if (validateAndShowErrors() && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex)
    }
  }

  // Función para enviar datos al backend
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    // Procesar los horarios para enviar al backend
    const processedSchedules = signupData.initialConfig.workingDays.map(day => {
      const daySchedule = signupData.initialConfig.schedules[day] || {}

      // Crear el objeto de turnos con null para los que no existen
      const shifts = {
        morningOpen: daySchedule.morningOpen || null,
        morningClose: daySchedule.morningClose || null,
        afternoonOpen: daySchedule.afternoonOpen || null,
        afternoonClose: daySchedule.afternoonClose || null
      }

      return {
        weekday: day.toUpperCase(),
        shifts
      }
    })

    const payload = {
      ownerName: signupData.account.ownerName,
      email: signupData.account.email,
      password: signupData.account.password,
      name: signupData.businessData.businessName,
      phone: signupData.businessData.phone,
      address: signupData.businessData.address,
      businessCategory: signupData.businessData.businessType,
      schedules: processedSchedules
    };

    try {
      const response = await fetch(backendURL + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.statusCode == 201) {
        window.location.replace('https://www.timeloop.com.uy/bienvenido')
      } else {
        // Mostrar el mensaje específico del backend
        let errorMessage = "Error desconocido"

        if (result.message) {
          errorMessage = result.message
        } else if (result.error) {
          errorMessage = result.error
        } else if (result.details) {
          errorMessage = result.details
        } else if (result.errors && Array.isArray(result.errors)) {
          errorMessage = result.errors.join(", ")
        }

        setSubmitError(errorMessage)
        console.error("Error en el registro:", result)
      }
    } catch (error) {
      console.error("Error de conexión:", error)
      setSubmitError("Error de conexión. Por favor verifica tu internet e intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    const stepProps = {
      data: signupData,
      updateData: updateStepData,
      errors: stepErrors[currentStep] || {},
      clearErrors: () => setStepErrors(prev => ({ ...prev, [currentStep]: {} }))
    }

    switch (currentStep) {
      case 0:
        return <AccountStep {...stepProps} />
      case 1:
        return <BusinessDataStep {...stepProps} />
      case 2:
        return <InitialConfigStep {...stepProps} />
      case 3:
        return <WelcomeStep {...stepProps} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100


  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader className="space-y-4 px-2">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">Registro de Comercio</CardTitle>
          <p className="text-muted-foreground mt-2">
            Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].title}
          </p>
        </div>

        {/* Indicador de progreso */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`text-xs transition-colors hover:text-foreground ${index <= currentStep ? "text-primary font-medium" : ""
                  }`}
                disabled={index > currentStep}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-2">
        {/* Contenido del paso actual */}
        <div className="min-h-[400px]">{renderCurrentStep()}</div>

        {/* Mostrar error de envío si existe */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al registrar</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>• {submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 bg-transparent hover:cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={goToNextStep} className="flex items-center gap-2 hover:cursor-pointer">
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 hover:cursor-pointer">
              {isSubmitting ? "Registrando..." : "Ir al panel"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
