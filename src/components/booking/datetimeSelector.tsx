// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { useCommerceWorkingPattern } from "@/hooks/configs/commerce/useCommerceWorkingPattern"
import { WeekDays, AvailabilityType } from "@/interfaces/WorkingPattern"

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================
interface DatetimeSelectorProps {
  bookingData: any
  setBookingData: (data: any) => void
  commerceId?: string | number
}

// ============================================================================
// FUNCIONES HELPER / UTILIDADES
// ============================================================================

// Mapear día de JavaScript (0-6, donde 0 es domingo) a WeekDays enum
const mapJsDayToWeekDay = (jsDay: number): WeekDays => {
  const mapping: Record<number, WeekDays> = {
    0: WeekDays.SUNDAY,    // Domingo
    1: WeekDays.MONDAY,    // Lunes
    2: WeekDays.TUESDAY,   // Martes
    3: WeekDays.WEDNESDAY, // Miércoles
    4: WeekDays.THURSDAY,  // Jueves
    5: WeekDays.FRIDAY,    // Viernes
    6: WeekDays.SATURDAY,  // Sábado
  }
  return mapping[jsDay]
}

// Capitalizar la primera letra de un string
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// ============================================================================
// FUNCIONES DE GENERACIÓN DE DATOS
// ============================================================================

// Generar próximos 15 días con disponibilidad basada en working pattern
const generateAvailableDates = (workingPattern?: Array<{ weekday: WeekDays; availabilityType: AvailabilityType }>) => {
  const dates: Array<{ date: Date; isAvailable: boolean }> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalizar a inicio del día

  // Crear un mapa para búsqueda rápida del working pattern por día
  const patternMap = new Map<WeekDays, AvailabilityType>()
  if (workingPattern) {
    workingPattern.forEach((pattern) => {
      patternMap.set(pattern.weekday, pattern.availabilityType)
    })
  }

  for (let i = 1; i <= 15; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    const weekDay = mapJsDayToWeekDay(date.getDay())
    const availabilityType = patternMap.get(weekDay)
    
    // El día está disponible solo si tiene pattern y availabilityType no es "off"
    // Si no hay pattern definido, se considera no disponible
    const isAvailable = availabilityType !== undefined && availabilityType !== AvailabilityType.off

    dates.push({
      date,
      isAvailable,
    })
  }

  return dates
}

// ============================================================================
// CONSTANTES
// ============================================================================

// Horarios disponibles de 9:00 a 18:00
const availableTimes = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function DatetimeSelector({ bookingData, setBookingData, commerceId }: DatetimeSelectorProps) {
  // ==========================================================================
  // HOOKS
  // ==========================================================================
  const { commerceWorkingPattern, loading: loadingWorkingPattern } = useCommerceWorkingPattern(commerceId)
  
  const availableDates = useMemo(() => {
    return generateAvailableDates(commerceWorkingPattern)
  }, [commerceWorkingPattern])

  const [selectedDate, setSelectedDate] = useState<Date | null>(bookingData.date)

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setBookingData({
      ...bookingData,
      date: date,
      time: "",
    })
  }

  const handleSelectTime = (time: string) => {
    setBookingData({
      ...bookingData,
      time: time,
    })
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="space-y-6">
      {/* ======================================================================
          SECCIÓN: SELECCIONAR FECHA
          ====================================================================== */}
      <div>
        {/* //* Título de la sección */}
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Selecciona una Fecha
        </h3>
        
        {/* //* Grid de días disponibles */}
        <div className="grid gap-2 grid-cols-4 lg:grid-cols-7">
          {loadingWorkingPattern ? (
            // Estado de carga
            <div className="col-span-full text-center text-sm text-muted-foreground py-4">
              Cargando días disponibles...
            </div>
          ) : (
            //* Mapeo de días disponibles
            availableDates.map(({ date, isAvailable }) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString()
              return (
                <Button
                  key={date.toISOString()}
                  variant={isSelected ? "default" : "outline"}
                  disabled={!isAvailable}
                  className={`h-16 flex flex-col items-center justify-center ${
                    !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => isAvailable && handleSelectDate(date)}
                >
                  {/* //* Nombre del día */}
                  <span className={`text-xs ${isSelected ? "text-black" : isAvailable ? "text-white" : "text-muted-foreground"}`}>
                    {capitalizeFirstLetter(date.toLocaleDateString("es-ES", { weekday: "long" }))}
                  </span>
                  {/* //* Número del día */}
                  <span className={`font-semibold ${!isAvailable ? "text-muted-foreground" : ""}`}>
                    {date.getDate()}
                  </span>
                </Button>
              )
            })
          )}
        </div>
      </div>

      {/* ======================================================================
          SECCIÓN: SELECCIONAR HORA
          ====================================================================== */}
      {selectedDate && (
        <div>
          {/* //* Título de la sección */}
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Selecciona una Hora
          </h3>
          
          {/* //* Grid de horarios disponibles */}
          <div className="grid gap-2 grid-cols-4 lg:grid-cols-7">
            {availableTimes.map((time) => {
              const isSelected = bookingData.time === time
              return (
                <Button key={time} variant={isSelected ? "default" : "outline"} onClick={() => handleSelectTime(time)}>
                  {time}
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
