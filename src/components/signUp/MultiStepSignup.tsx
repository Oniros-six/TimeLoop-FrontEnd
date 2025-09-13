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
    schedules: Record<string, Array<{ open: string; close: string }>>
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
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [signupData, setSignupData] = useState<SignupData>({
    account: {
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

  // Función de validación para cada paso
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Account step
        const { email, password, confirmPassword } = signupData.account
        if (!email || !password || !confirmPassword) {
          return false
        }
        if (password !== confirmPassword) {
          return false
        }
        if (password.length < 6) {
          return false
        }
        return true

      case 1: // Business data step
        const { businessName, businessType, address, phone } = signupData.businessData
        // Validar que el teléfono tenga exactamente 9 dígitos
        const phoneDigits = phone.replace(/\D/g, '') // Remover caracteres no numéricos
        return !!(businessName && businessType && address && phone && phoneDigits.length === 9)

      case 2: // Initial config step
        const { workingDays, schedules } = signupData.initialConfig
        if (workingDays.length === 0) {
          return false
        }
        for (const day of workingDays) {
          if (!schedules[day] || schedules[day].length === 0) {
            return false
          }
          // Verificar que todos los turnos tengan horarios válidos
          for (const shift of schedules[day]) {
            if (!shift.open || !shift.close) {
              return false
            }
          }
        }
        return true

      case 3: // Welcome step
        return true

      default:
        return false
    }
  }

  // Navegación entre pasos
  const goToNextStep = () => {
    if (validateCurrentStep() && currentStep < STEPS.length - 1) {
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
    
    // Procesar los horarios para enviar al backend
    const processedSchedules = signupData.initialConfig.workingDays.map(day => ({
      weekday: day.toUpperCase(),
      shifts: signupData.initialConfig.schedules[day] || []
    }))

    const payload = {
      email: signupData.account.email,
      password: signupData.account.password,
      name: signupData.businessData.businessName,
      phone: signupData.businessData.phone,
      address: signupData.businessData.address,
      businessCategory: signupData.businessData.businessType,
      schedules: processedSchedules
    };

    try {
      // Aquí enviarías los datos al backend
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Manejar éxito
        console.log("Registro exitoso:", result.message)
        alert(`¡Registro exitoso! Bienvenido ${result.data.businessName}`)
        // Aquí puedes redirigir al panel de administración
        // window.location.href = '/dashboard'
      } else {
        // Manejar error
        console.error("Error en el registro:", result.error)
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    const stepProps = {
      data: signupData,
      updateData: updateStepData,
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

      <CardContent className="space-y-6">
        {/* Contenido del paso actual */}
        <div className="min-h-[400px]">{renderCurrentStep()}</div>

        {/* Navegación */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={goToNextStep} className="flex items-center gap-2">
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? "Registrando..." : "Ir al panel"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
