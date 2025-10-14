import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { type RecentItem, BookingStatus, getStatusText } from "@/interfaces/DashboardData"
import { statusConfig } from "@/interfaces/Booking"


function formatActivityDate(date: Date | string): string {
  // Asegurar que tenemos un objeto Date válido
  const activityDate = date instanceof Date ? date : new Date(date)

  // Verificar que la fecha es válida
  if (isNaN(activityDate.getTime())) {
    return "Fecha inválida"
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  // Resetear las horas para comparar solo las fechas
  const activityDateOnly = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

  if (activityDateOnly.getTime() === todayOnly.getTime()) {
    return "Hoy"
  } else if (activityDateOnly.getTime() === tomorrowOnly.getTime()) {
    return "Mañana"
  } else {
    return activityDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
}

interface props {
  recent: RecentItem[]
}

export function RecentActivityCard({ recent }: props) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Actividad reciente
        </CardTitle>
      </CardHeader>
      {/* //* Diferenciamos el caso vacio */}
      {recent.length === 0 ?

        <CardContent className="px-2 self-center">
          No hay actividad reciente para mostrar.
        </CardContent> :

        <CardContent className="px-2">
          <div className="space-y-4">
            {recent.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.customer.name}</p>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {
                      activity.bookingServices.map((b, index) => (
                        <p key={index}>{b.service.name}</p>
                      ))
                    }
                  </div>
                </div>

                <div className="flex justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(activity.timeStart).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })} -
                    </span>
                    <span className="inline">
                      {formatActivityDate(activity.timeStart)}
                    </span>
                  </div>
                  <Badge variant="secondary" className={` ${statusConfig[activity.status].color} text-white`}>
                    {getStatusText(activity.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      }

    </Card>
  )
}
