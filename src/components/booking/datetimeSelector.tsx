import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

interface DatetimeSelectorProps {
  bookingData: any
  setBookingData: (data: any) => void
}

// Generar próximos 14 días disponibles
const generateAvailableDates = () => {
  const dates = []
  const today = new Date()

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    // Saltar domingos
    if (date.getDay() !== 0) {
      dates.push(date)
    }
  }

  return dates
}

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

export function DatetimeSelector({ bookingData, setBookingData }: DatetimeSelectorProps) {
  const availableDates = generateAvailableDates()
  const [selectedDate, setSelectedDate] = useState<Date | null>(bookingData.date)

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

  return (
    <div className="space-y-6">
      {/* Seleccionar Fecha */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Selecciona una Fecha
        </h3>
        <div className="grid gap-2 grid-cols-4 lg:grid-cols-7">
          {availableDates.map((date) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString()
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center"
                onClick={() => handleSelectDate(date)}
              >
                <span className={`text-xs ${isSelected ? "text-black" : "text-white"}`}>
                  {date.toLocaleDateString("es-ES", { weekday: "short" })}
                </span>
                <span className="font-semibold">{date.getDate()}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Seleccionar Hora */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Selecciona una Hora
          </h3>
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
