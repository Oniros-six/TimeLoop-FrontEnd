"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { SignupData } from "@/components/signUp/MultiStepSignup"

interface InitialConfigStepProps {
  data: SignupData
  updateData: (stepKey: keyof SignupData, data: any) => void
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

export function InitialConfigStep({ data, updateData }: InitialConfigStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleDayToggle = (dayId: string, checked: boolean) => {
    const currentDays = data.initialConfig.workingDays
    const currentSchedules = data.initialConfig.schedules
    let newDays: string[]
    const newSchedules = { ...currentSchedules }

    if (checked) {
      newDays = [...currentDays, dayId]
      newSchedules[dayId] = [{ open: "09:00", close: "18:00" }]
    } else {
      newDays = currentDays.filter((day) => day !== dayId)
      delete newSchedules[dayId]
    }

    updateData("initialConfig", { workingDays: newDays, schedules: newSchedules })

    if (newDays.length > 0 && errors.workingDays) {
      setErrors((prev) => ({ ...prev, workingDays: "" }))
    }
  }

  const handleScheduleChange = (dayId: string, shiftIndex: number, type: "open" | "close", value: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedules = [...(currentSchedules[dayId] || [])]

    if (!daySchedules[shiftIndex]) {
      daySchedules[shiftIndex] = { open: "09:00", close: "18:00" }
    }

    daySchedules[shiftIndex] = {
      ...daySchedules[shiftIndex],
      [type]: value,
    }

    const newSchedules = {
      ...currentSchedules,
      [dayId]: daySchedules,
    }

    const shift = daySchedules[shiftIndex]
    if (type === "open" && shift.close <= value) {
      setErrors((prev) => ({
        ...prev,
        [`${dayId}_${shiftIndex}_schedule`]: "La hora de apertura debe ser menor a la de cierre",
      }))
    } else if (type === "close" && shift.open >= value) {
      setErrors((prev) => ({
        ...prev,
        [`${dayId}_${shiftIndex}_schedule`]: "La hora de cierre debe ser mayor a la de apertura",
      }))
    } else {
      setErrors((prev) => ({ ...prev, [`${dayId}_${shiftIndex}_schedule`]: "" }))
    }

    updateData("initialConfig", { schedules: newSchedules })
  }

  const addShift = (dayId: string) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedules = [...(currentSchedules[dayId] || [])]

    if (daySchedules.length >= 2) {
      return
    }

    daySchedules.push({ open: "09:00", close: "18:00" })

    const newSchedules = {
      ...currentSchedules,
      [dayId]: daySchedules,
    }

    updateData("initialConfig", { schedules: newSchedules })
  }

  const removeShift = (dayId: string, shiftIndex: number) => {
    const currentSchedules = data.initialConfig.schedules
    const daySchedules = [...(currentSchedules[dayId] || [])]
    daySchedules.splice(shiftIndex, 1)

    const newSchedules = {
      ...currentSchedules,
      [dayId]: daySchedules,
    }

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
                      {(data.initialConfig.schedules[day.id] || []).map((shift, shiftIndex) => (
                        <div key={shiftIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                              {shiftIndex === 0 ? "Turno Mañana" : "Turno Tarde"}
                            </span>
                            {shiftIndex > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeShift(day.id, shiftIndex)}
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                              >
                                Eliminar
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-muted-foreground font-medium">APERTURA:</span>
                              <Select
                                value={shift.open}
                                onValueChange={(value) => handleScheduleChange(day.id, shiftIndex, "open", value)}
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
                                value={shift.close}
                                onValueChange={(value) => handleScheduleChange(day.id, shiftIndex, "close", value)}
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

                          {errors[`${day.id}_${shiftIndex}_schedule`] && (
                            <p className="text-xs text-red-500">{errors[`${day.id}_${shiftIndex}_schedule`]}</p>
                          )}
                        </div>
                      ))}

                      {(data.initialConfig.schedules[day.id] || []).length < 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addShift(day.id)}
                          className="w-full h-8 text-xs"
                        >
                          + Agregar turno tarde
                        </Button>
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
