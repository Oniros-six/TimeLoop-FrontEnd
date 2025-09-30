import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { SignupData } from "@/components/auth/signUp/MultiStepSignup"

interface InitialConfigStepProps {
  data: SignupData
  updateData: (stepKey: keyof SignupData, data: any) => void
  errors: Record<string, string>
  clearErrors: () => void
}

const DAYS_OF_WEEK = [
  { id: "monday", label: "Lunes" },
  { id: "tuesday", label: "Martes" },
  { id: "wednesday", label: "Miércoles" },
  { id: "thursday", label: "Jueves" },
  { id: "friday", label: "Viernes" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
]

const generateTimeOptions = () => {
  const times = []
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      times.push(timeString)
    }
  }
  return times
}

const TIME_OPTIONS = generateTimeOptions()

export function InitialConfigStep({ data, updateData, errors, clearErrors }: InitialConfigStepProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const handleDayToggle = (dayId: string, checked: boolean) => {
    const currentDays = data.initialConfig.workingDays
    const currentSchedules = data.initialConfig.schedules
    let newDays: string[]
    const newSchedules = { ...currentSchedules }

    if (checked) {
      newDays = [...currentDays, dayId]
      newSchedules[dayId] = {
        morningOpen: "09:00",
        morningClose: "18:00",
      }
    } else {
      newDays = currentDays.filter((day) => day !== dayId)
      delete newSchedules[dayId]
    }

    updateData("initialConfig", { workingDays: newDays, schedules: newSchedules })

    // Limpiar error cuando el usuario selecciona días
    if (newDays.length > 0 && errors.workingDays) {
      clearErrors()
    }
  }

  const handleScheduleChange = (
    dayId: string,
    field: "morningOpen" | "morningClose" | "afternoonOpen" | "afternoonClose",
    value: string,
  ) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedule = currentSchedules[dayId] || {}

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        [field]: value,
      },
    }

    // Validar horarios
    const schedule = newSchedules[dayId]
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
    } else {
      // Limpiar errores si todo está bien
      setLocalErrors((prev) => ({
        ...prev,
        [`${dayId}_morning_schedule`]: "",
        [`${dayId}_afternoon_schedule`]: "",
      }))
      
    }

    if (errorKey) {
      setLocalErrors((prev) => ({ ...prev, [errorKey]: errorMessage }))
    }

    updateData("initialConfig", { schedules: newSchedules })
  }

  const addMorningShift = (dayId: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedule = currentSchedules[dayId] || {}

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        morningOpen: "09:00",
        morningClose: "13:00",
      },
    }

    updateData("initialConfig", { schedules: newSchedules })
  }

  const removeMorningShift = (dayId: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedule = currentSchedules[dayId] || {}

    if (!daySchedule.afternoonOpen || !daySchedule.afternoonClose) {
      setLocalErrors((prev) => ({
        ...prev,
        [`${dayId}_shifts`]: "Debe tener al menos un turno activo",
      }))
      return
    }

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        afternoonOpen: daySchedule.afternoonOpen,
        afternoonClose: daySchedule.afternoonClose,
      },
    }

    // Limpiar error si existe
    setLocalErrors((prev) => ({ ...prev, [`${dayId}_shifts`]: "" }))
    updateData("initialConfig", { schedules: newSchedules })
  }

  const addAfternoonShift = (dayId: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedule = currentSchedules[dayId] || {}

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        afternoonOpen: "16:00",
        afternoonClose: "20:00",
      },
    }

    updateData("initialConfig", { schedules: newSchedules })
  }

  const removeAfternoonShift = (dayId: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedule = currentSchedules[dayId] || {}

    if (!daySchedule.morningOpen || !daySchedule.morningClose) {
      setLocalErrors((prev) => ({
        ...prev,
        [`${dayId}_shifts`]: "Debe tener al menos un turno activo",
      }))
      return
    }

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        morningOpen: daySchedule.morningOpen,
        morningClose: daySchedule.morningClose,
      },
    }

    // Limpiar error si existe
    setLocalErrors((prev) => ({ ...prev, [`${dayId}_shifts`]: "" }))
    updateData("initialConfig", { schedules: newSchedules })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Paso 3 — Configuración inicial</h3>
        <p className="text-muted-foreground">Define los días y horarios de atención de tu comercio</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Días que abre el comercio</Label>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={data.initialConfig.workingDays.includes(day.id)}
                      onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                    />
                    <Label htmlFor={day.id} className="text-sm font-medium cursor-pointer">
                      {day.label}
                    </Label>
                  </div>

                  {data.initialConfig.workingDays.includes(day.id) && (
                    <div className="ml-6 space-y-3">
                      {data.initialConfig.schedules[day.id]?.morningOpen &&
                      data.initialConfig.schedules[day.id]?.morningClose ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Turno Mañana</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMorningShift(day.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground font-medium">APERTURA:</span>
                              <Select
                                value={data.initialConfig.schedules[day.id]?.morningOpen || "09:00"}
                                onValueChange={(value) => handleScheduleChange(day.id, "morningOpen", value)}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground font-medium">CIERRE:</span>
                              <Select
                                value={data.initialConfig.schedules[day.id]?.morningClose || "13:00"}
                                onValueChange={(value) => handleScheduleChange(day.id, "morningClose", value)}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {errors[`${day.id}_morning_schedule`] && (
                            <p className="text-xs text-red-500">{errors[`${day.id}_morning_schedule`]}</p>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addMorningShift(day.id)}
                          className="w-full h-8 text-xs"
                        >
                          + Agregar turno mañana
                        </Button>
                      )}

                      {data.initialConfig.schedules[day.id]?.afternoonOpen &&
                      data.initialConfig.schedules[day.id]?.afternoonClose ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">Turno Tarde</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAfternoonShift(day.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground font-medium">APERTURA:</span>
                              <Select
                                value={data.initialConfig.schedules[day.id]?.afternoonOpen || "16:00"}
                                onValueChange={(value) => handleScheduleChange(day.id, "afternoonOpen", value)}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground font-medium">CIERRE:</span>
                              <Select
                                value={data.initialConfig.schedules[day.id]?.afternoonClose || "20:00"}
                                onValueChange={(value) => handleScheduleChange(day.id, "afternoonClose", value)}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {errors[`${day.id}_afternoon_schedule`] && (
                            <p className="text-xs text-red-500">{errors[`${day.id}_afternoon_schedule`]}</p>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addAfternoonShift(day.id)}
                          className="w-full h-8 text-xs"
                        >
                          + Agregar turno tarde
                        </Button>
                      )}

                      {localErrors[`${day.id}_shifts`] && (
                        <p className="text-xs text-red-500">{localErrors[`${day.id}_shifts`]}</p>
                      )}
                      
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.workingDays && <p className="text-sm text-red-500">{errors.workingDays}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
