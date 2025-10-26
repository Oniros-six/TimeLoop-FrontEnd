import { useState } from "react"
import { WorkingPatternSelector, type WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector"
import type { SignupData } from "@/components/auth/signUp/MultiStepSignup"

interface InitialConfigStepProps {
  data: SignupData
  updateData: (stepKey: keyof SignupData, data: any) => void
  errors: Record<string, string>
  clearErrors: () => void
}


export function InitialConfigStep({ data, updateData, errors, clearErrors }: InitialConfigStepProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  // Convertir los datos a la estructura WorkingPattern
  const workingPattern: WorkingPattern = {
    workingDays: data.initialConfig.workingDays,
    schedules: data.initialConfig.schedules
  }

  // Manejar cambios en el patrón de trabajo
  const handleWorkingPatternChange = (newPattern: WorkingPattern) => {
    updateData("initialConfig", newPattern)

    // Limpiar errores si se seleccionan días
    if (newPattern.workingDays.length > 0 && errors.workingDays) {
      clearErrors()
    }
  }

  // Manejar cambios en errores locales
  const handleErrorChange = (newErrors: Record<string, string>) => {
    setLocalErrors(newErrors)
  }

  return (
    <WorkingPatternSelector
      data={workingPattern}
      onChange={handleWorkingPatternChange}
      errors={{ ...errors, ...localErrors }}
      onErrorChange={handleErrorChange}
      title="Configuración inicial"
      description="Define los días y horarios de atención de tu comercio"
      showTitle={true}
    />
  )
}
