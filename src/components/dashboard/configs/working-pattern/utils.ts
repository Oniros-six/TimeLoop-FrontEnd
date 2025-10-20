import type { DaySchedule } from "./types"

// Validar horarios
export const validateSchedule = (
  dayId: string,
  field: keyof DaySchedule,
  value: string,
  schedule: DaySchedule
): { errorKey: string; errorMessage: string } | null => {
  let errorKey = ""
  let errorMessage = ""

  if (field === "morningOpen" && schedule.morningClose && schedule.morningClose <= value) {
    errorKey = `${dayId}_morning_schedule`
    errorMessage = "La hora de apertura debe ser menor a la de cierre"
  } else if (field === "morningClose" && schedule.morningOpen && schedule.morningOpen >= value) {
    errorKey = `${dayId}_morning_schedule`
    errorMessage = "La hora de cierre debe ser mayor a la de apertura"
  } else if (field === "afternoonOpen" && schedule.afternoonClose && schedule.afternoonClose <= value) {
    errorKey = `${dayId}_afternoon_schedule`
    errorMessage = "La hora de apertura debe ser menor a la de cierre"
  } else if (field === "afternoonClose" && schedule.afternoonOpen && schedule.afternoonOpen >= value) {
    errorKey = `${dayId}_afternoon_schedule`
    errorMessage = "La hora de cierre debe ser mayor a la de apertura"
  }

  return errorKey ? { errorKey, errorMessage } : null
}

// Validar que haya al menos un turno activo
export const validateShiftRemoval = (
  dayId: string,
  shiftType: 'morning' | 'afternoon',
  schedule: DaySchedule
): { errorKey: string; errorMessage: string } | null => {
  const hasOtherShift = shiftType === 'morning' 
    ? (schedule.afternoonOpen && schedule.afternoonClose)
    : (schedule.morningOpen && schedule.morningClose)

  if (!hasOtherShift) {
    return {
      errorKey: `${dayId}_shifts`,
      errorMessage: "Debe tener al menos un turno activo"
    }
  }

  return null
}
