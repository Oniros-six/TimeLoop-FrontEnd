import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, DollarSign, Plus, X } from "lucide-react"
import type { IService } from "@/interfaces/Service"
import type { BookingData } from "./bookingFlow"
import { useServices } from "@/hooks/services/useServices"

interface ServiceSelectorProps {
  bookingData: BookingData
  setBookingData: (data: BookingData) => void
}

export function ServiceSelector({ bookingData, setBookingData }: ServiceSelectorProps) {
  const targetUserId = bookingData.staff?.id
  const { services, loading, error } = useServices(targetUserId)

  const handleSelectService = (service: IService) => {
    const exists = bookingData.services.find((s: IService) => s.id === service.id)
    if (exists) {
      setBookingData({
        ...bookingData,
        services: bookingData.services.filter((s: IService) => s.id !== service.id),
      })
    } else {
      setBookingData({
        ...bookingData,
        services: [
          ...bookingData.services,
          service,
        ],
      })
    }
  }

  const skeletonCards = useMemo(() => Array.from({ length: 6 }), [])

  const introText = (
    <p className="text-muted-foreground">
      Selecciona uno o más servicios.{" "}
      {bookingData.services.length > 0 && `Tienes ${bookingData.services.length} servicio(s) seleccionado(s)`}
    </p>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <Card key={`service-skeleton-${index}`}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No hay servicios disponibles para este profesional.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {introText}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const isSelected = bookingData.services.some((s) => s.id === service.id)
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                isSelected ? "border-primary bg-primary/5 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => handleSelectService(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  {isSelected && <Badge>Seleccionado</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description || "Sin descripción disponible"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectService(service)
                  }}
                >
                  {isSelected ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Deseleccionar
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Seleccionar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
