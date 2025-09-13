import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Store, Calendar, Clock, Mail, MapPin, Phone } from "lucide-react"
import type { SignupData } from "../MultiStepSignup"

interface WelcomeStepProps {
  data: SignupData
  onSubmit: () => void
  isSubmitting: boolean
}

export function WelcomeStep({ data }: WelcomeStepProps) {
  const formatWorkingDays = (days: string[]) => {
    const dayNames: Record<string, string> = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    }

    return days.map((day) => dayNames[day]).join(", ")
  }

  const formatSchedules = (schedules: Record<string, Array<{ open: string; close: string }>>) => {
    const dayNames: Record<string, string> = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    }

    return Object.entries(schedules)
      .map(([day, shifts]) => {
        const dayName = dayNames[day]
        const shiftTimes = shifts.map(shift => `${shift.open} - ${shift.close}`).join(", ")
        return `${dayName}: ${shiftTimes}`
      })
      .join("; ")
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Confirmación / Bienvenida</h3>
          <p className="text-muted-foreground mt-2">¡Perfecto! Revisa tu información antes de completar el registro</p>
        </div>
      </div>

      <Card className="border-0">
        <CardContent className="space-y-6 p-0 sm:px-4 md:px-6">
          <div className="space-y-4">
            <h4 className="font-bold text-center text-xl text-primary">
              Resumen de tu comercio
            </h4>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Store className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">{data.businessData.businessName}</p>
                  <p className="text-sm text-muted-foreground">{data.businessData.businessType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email de acceso</p>
                  <p className="text-sm text-muted-foreground">{data.account.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">{data.businessData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{data.businessData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Días de atención</p>
                  <p className="text-sm text-muted-foreground">{formatWorkingDays(data.initialConfig.workingDays)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Horarios</p>
                  <p className="text-sm text-muted-foreground">{formatSchedules(data.initialConfig.schedules)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>¡Ya casi terminamos!</strong> Al hacer clic en "Ir al panel" crearemos tu cuenta y podrás comenzar a
          gestionar tu comercio inmediatamente.
        </p>
      </div>
    </div>
  )
}
