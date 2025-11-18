import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ServiceSelector } from "./serviceSelector"
import { StaffSelector } from "./staffSelector"
import { DatetimeSelector } from "./datetimeSelector"
import { CustomerInfoForm } from "./customerInfoForm"
import { Check, ChevronLeft, CheckCircle, DollarSign } from "lucide-react"
import type { IService } from "@/interfaces/Service"
import type { IUser } from "@/interfaces/User";
import type { ICustomer } from "@/interfaces/Customer";
import { Skeleton } from "../ui/skeleton"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCommerceName } from "@/hooks/commerce/useCommerceName"

type Step = "staff" | "services" | "datetime" | "customer" | "confirmation"

//TODO Crear una interfaz para los datos de la reserva
export interface BookingData {
  services: IService[]
  staff: IUser | null
  customer: ICustomer | null
  date: Date | null
  time: string
}

const steps: { id: Step; label: string; description: string }[] = [
  { id: "staff", label: "Profesional", description: "Elige quién te atenderá" },
  { id: "services", label: "Servicios", description: "Selecciona los servicios" },
  { id: "datetime", label: "Fecha y Hora", description: "Selecciona disponibilidad" },
  { id: "customer", label: "Tus Datos", description: "Información personal" },
  { id: "confirmation", label: "Confirmación", description: "Resumen" },
]

function formatDuration(minutes: number): string {
  if (minutes === 0) return "0 minutos"
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes} minutos`
  }
  
  if (remainingMinutes === 0) {
    return `${hours} hs`
  }
  
  return `${hours} hs y ${remainingMinutes} minutos`
}

function BookingFlowContent({ commerceName }: { commerceName: string }) {
  const { commerce, loading, error } = useCommerceName(commerceName)

  const [currentStep, setCurrentStep] = useState<Step>("staff")
  //TODO Estos datos son suficientes para empezar pero puede que se le agreguen mas
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
    staff: null,
    date: null,
    time: "",
    customer: null,
  })

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
      // Hacer scroll hacia arriba después de que React actualice el DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
      })
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      // Resetear el contenido del paso actual y los pasos siguientes
      const currentStepId = currentStep
      
      if (currentStepId === "customer") {
        setBookingData(prev => ({ ...prev, customer: null }))
      } else if (currentStepId === "datetime") {
        setBookingData(prev => ({ ...prev, date: null, time: "", customer: null }))
      } else if (currentStepId === "services") {
        setBookingData(prev => ({ ...prev, services: [], date: null, time: "", customer: null }))
      }
      
      setCurrentStep(steps[prevIndex].id)
      // Hacer scroll hacia arriba después de que React actualice el DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        })
      })
    }
  }

  const totalPrice = bookingData.services.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = bookingData.services.reduce((sum, service) => sum + service.durationMinutes, 0)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <Skeleton className="w-32 h-32 rounded-lg" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>
    )
  }

  if (error || !commerce) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error || "No se pudo cargar la información del comercio"}
        </div>
      </div>
    )
  }

  return (
      <div className="mx-auto max-w-4xl xl:max-w-6xl mt-20 md:mt-30">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Reserva tu Servicio</h1>
          <p className="text-muted-foreground">Sigue estos pasos para completar tu reserva</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-2 ${index <= currentStepIndex ? "opacity-100" : "opacity-50"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : index === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Content */}
          <Card className="mb-8 md:col-span-2">
            <CardHeader className="px-1 text-center">
              <CardTitle>
                {steps[currentStepIndex].label} - {steps[currentStepIndex].description}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 lg:px-6">
              {currentStep === "staff" && <StaffSelector commerceId={commerce.id} bookingData={bookingData} setBookingData={setBookingData} />}
              {currentStep === "services" && <ServiceSelector bookingData={bookingData} setBookingData={setBookingData} />}
              {currentStep === "datetime" && <DatetimeSelector bookingData={bookingData} setBookingData={setBookingData} />}
              {currentStep === "customer" && <CustomerInfoForm bookingData={bookingData} setBookingData={setBookingData} />}
              {currentStep === "confirmation" && (
                <ConfirmationStep bookingData={bookingData} totalPrice={totalPrice} totalDuration={totalDuration} />
              )}
            </CardContent>
          </Card>

          {/* Resumen lateral */}
          <Card className="mb-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de tu Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/*//* Profesional */}
              {bookingData.staff?.name && (
                <div>
                  <span className="font-medium">Profesional</span>
                  <ul className="text-sm">
                    <li>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                        {bookingData.staff?.name}
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {/*//* Servicios */}
              {bookingData.services.length > 0 && (
                <div>
                  <span className="font-medium">Servicios</span>
                  <div className="space-y-1">
                    {bookingData.services.map((service) => (
                      <ul key={service.id} className="text-sm">
                        <li className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                            <span>{service.name}</span>
                          </div>
                          <span>$ {service.price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </li>
                      </ul>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <p className="text-lg text-primary flex items-center gap-0">
                        <DollarSign className="h-4 w-4 text-primary" />{" "}
                        {totalPrice.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Duración total:</span>
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/*//* Fecha y Hora */}
              {bookingData.date && (
                <div className="flex justify-between text-sm">
                  <span>Fecha y Hora:</span>
                  <span className="font-medium">
                    {bookingData.date.toLocaleDateString("es-ES")} - {bookingData.time}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>


        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === "staff"}
            className={`gap-2 bg-transparent ${currentStep === "staff" ? "invisible" : ""}`}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep !== "confirmation" ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === "services" && bookingData.services.length === 0) ||
                (currentStep === "staff" && !bookingData.staff?.id) ||
                (currentStep === "datetime" && (!bookingData.date || !bookingData.time)) ||
                (currentStep === "customer" && (!bookingData.customer?.name || !bookingData.customer?.email || !bookingData.customer?.phone))
              }
            >
              Siguiente
            </Button>
          ) : (
            <a href={`/${commerce.uniqueName}`}>
              <Button className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </a>
          )}
        </div>
      </div>
  )
}

function ConfirmationStep({
  bookingData,
  totalPrice,
  totalDuration,
}: {
  bookingData: BookingData
  totalPrice: number
  totalDuration: number
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4 border border-green-200 dark:border-green-800">
        <div className="flex gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">¡Reserva Confirmada!</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Se ha enviado un email a <strong>{bookingData.customer?.email}</strong> con los detalles de tu reserva.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Servicios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bookingData.services.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span>{service.name}</span>
                <span className="font-medium">${service.price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Servicios:</span>
              <span>${totalPrice.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalles de la Cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Profesional</p>
              <p className="font-medium">{bookingData.staff?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha</p>
              <p className="font-medium">{bookingData.date?.toLocaleDateString("es-ES")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hora</p>
              <p className="font-medium">{bookingData.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duración</p>
              <p className="font-medium">{formatDuration(totalDuration)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Nombre</p>
            <p className="font-medium">{bookingData.customer?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{bookingData.customer?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Teléfono</p>
            <p className="font-medium">{bookingData.customer?.phone}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BookingFlow({ commerceName }: { commerceName: string }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BookingFlowContent commerceName={commerceName} />
    </QueryClientProvider>
  )
}
