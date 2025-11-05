import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Clock, User, DollarSign } from "lucide-react"

import type { HistoryItem } from "@/interfaces/DashboardData"

interface props {
  history: HistoryItem[]
}

export function HistoryCard({ history }: props) {
  function formatDate(date: Date | string): string {
    // Asegurar que tenemos un objeto Date válido
    const activityDate = date instanceof Date ? date : new Date(date)

    // Verificar que la fecha es válida
    if (isNaN(activityDate.getTime())) {
      return "Fecha inválida"
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    // Resetear las horas para comparar solo las fechas
    const activityDateOnly = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

    if (activityDateOnly.getTime() === todayOnly.getTime()) {
      return "Hoy"
    } else if (activityDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Ayer"
    } else {
      return activityDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          Historial
        </CardTitle>
      </CardHeader>

      {/* //* Diferenciamos el caso vacio */}
      {history.length === 0 ?

        <CardContent className="px-2 self-center">
          No hay historial para mostrar.
        </CardContent> :

        <CardContent className="px-2">
          <div className="space-y-4">
            {history.map((item: HistoryItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.customer.name}</p>
                    <p className="text-sm truncate">{item.user.name}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(item.timeStart).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })} -
                    </span>
                    <span className="inline">
                      {formatDate(item.timeStart)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-green-600 text-white flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {item.priceAtBooking}
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
