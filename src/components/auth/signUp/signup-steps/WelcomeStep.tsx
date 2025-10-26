import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Store, Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react"
import { DAY_NAMES_SPANISH } from "@/components/dashboard/configs/working-pattern/constants"
import type { SignupData } from "@/components/auth/signUp/MultiStepSignup"

interface WelcomeStepProps {
  data: SignupData
  onSubmit: () => void
  isSubmitting: boolean
}

export function WelcomeStep({ data, onSubmit, isSubmitting }: WelcomeStepProps) {
  const formatWorkingDays = (days: string[]) => {
    return days.map((day) => DAY_NAMES_SPANISH[day]).join(", ")
  }

  const formatSchedules = (
    schedules: Record<
      string,
      { morningOpen?: string; morningClose?: string; afternoonOpen?: string; afternoonClose?: string }
    >,
  ) => {
    return Object.entries(schedules)
      .map(([day, schedule]) => {
        const morning = schedule.morningOpen && schedule.morningClose
          ? `${schedule.morningOpen} - ${schedule.morningClose}`
          : ""
        const afternoon =
          schedule.afternoonOpen && schedule.afternoonClose
            ? ` y ${schedule.afternoonOpen} - ${schedule.afternoonClose}`
            : ""
        return `${DAY_NAMES_SPANISH[day]}: ${morning}${afternoon}`
      })
      .join(", ")
  }

  return (
    <div className="space-y-6 px-0">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Paso 4 — Confirmación</h3>
          <p className="text-muted-foreground mt-2">¡Perfecto! Revisa tu información antes de completar el registro</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 px-2 md:p-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-self-center gap-2">
              <Store className="w-5 h-5" />
              Resumen de tu comercio
            </h4>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Propietario</p>
                  <p className="text-sm text-muted-foreground">{data.account.ownerName}</p>
                </div>
              </div>

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
