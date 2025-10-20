// Configuración de días de la semana
export const DAYS_OF_WEEK = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
]

// Generar opciones de tiempo
export const generateTimeOptions = () => {
  const times = []
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      times.push(timeString)
    }
  }
  return times
}

export const TIME_OPTIONS = generateTimeOptions()

// Configuraciones por defecto para turnos
export const DEFAULT_SHIFT_TIMES = {
  morning: {
    open: "09:00",
    close: "13:00"
  },
  afternoon: {
    open: "16:00", 
    close: "20:00"
  }
}

// Configuración por defecto cuando se selecciona un día
export const DEFAULT_DAY_SCHEDULE = {
  morningOpen: "09:00",
  morningClose: "18:00"
}
