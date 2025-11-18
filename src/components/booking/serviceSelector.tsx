import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
      Puedes seleccionar más de un servicio.
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

      <div className="grid p-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const isSelected = bookingData.services.some((s: any) => s.id === service.id)
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all gap-1 py-3 ${isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
              onClick={() => handleSelectService(service)}
            >
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription className="line-clamp-2 my-2 min-h-10">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{
                    service.price.toLocaleString("es-UY", {
                      style: "currency",
                      currency: "UYU",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })
                  }</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.durationMinutes} minutos</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button
                  size="sm"
                  className="w-full h-8 text-xs"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectService(service)
                  }}
                >
                  {isSelected ? (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Deseleccionar
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Seleccionar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div >
  )
}
