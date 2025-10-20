import { useState } from "react"
import { Label } from "@/components/ui/label"
import { DaySelector } from "./DaySelector"
import { ScheduleSelector } from "./ScheduleSelector"
import { DAYS_OF_WEEK, DEFAULT_DAY_SCHEDULE, DEFAULT_SHIFT_TIMES } from "./constants"
import { validateSchedule, validateShiftRemoval } from "./utils"
import type { WorkingPatternSelectorProps, DaySchedule } from "./types"

export function WorkingPatternSelector({
  data,
  onChange,
  errors = {},
  onErrorChange,
  title = "Configuración de horarios",
  description = "Define los días y horarios de atención",
  showTitle = true,
  className = ""
}: WorkingPatternSelectorProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})

  const updateErrors = (newErrors: Record<string, string>) => {
    setLocalErrors(newErrors)
    onErrorChange?.(newErrors)
  }

  const handleDayToggle = (dayId: string, checked: boolean) => {
    const currentDays = data.workingDays
    const currentSchedules = data.schedules
    let newDays: string[]
    const newSchedules = { ...currentSchedules }

    if (checked) {
      newDays = [...currentDays, dayId]
      newSchedules[dayId] = DEFAULT_DAY_SCHEDULE
    } else {
      newDays = currentDays.filter((day) => day !== dayId)
      delete newSchedules[dayId]
    }

    onChange({ workingDays: newDays, schedules: newSchedules })

    // Limpiar error cuando el usuario selecciona días
    if (newDays.length > 0 && errors.workingDays) {
      updateErrors({})
    }
  }

  const handleScheduleChange = (
    dayId: string,
    field: keyof DaySchedule,
    value: string,
  ) => {
    const currentSchedules = data.schedules
    const daySchedule = currentSchedules[dayId] || {}

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        [field]: value,
      },
    }

    // Validar horarios
    const validation = validateSchedule(dayId, field, value, newSchedules[dayId])
    
    if (validation) {
      updateErrors({ ...localErrors, [validation.errorKey]: validation.errorMessage })
    } else {
      // Limpiar errores si todo está bien
      updateErrors({
        ...localErrors,
        [`${dayId}_morning_schedule`]: "",
        [`${dayId}_afternoon_schedule`]: "",
      })
    }

    onChange({ ...data, schedules: newSchedules })
  }

  const handleAddShift = (dayId: string, shiftType: 'morning' | 'afternoon') => {
    const currentSchedules = data.schedules
    const daySchedule = currentSchedules[dayId] || {}
    const shiftTimes = DEFAULT_SHIFT_TIMES[shiftType]

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        [`${shiftType}Open`]: shiftTimes.open,
        [`${shiftType}Close`]: shiftTimes.close,
      },
    }

    onChange({ ...data, schedules: newSchedules })
  }

  const handleRemoveShift = (dayId: string, shiftType: 'morning' | 'afternoon') => {
    const currentSchedules = data.schedules
    const daySchedule = currentSchedules[dayId] || {}

    // Validar que haya al menos un turno activo
    const validation = validateShiftRemoval(dayId, shiftType, daySchedule)
    
    if (validation) {
      updateErrors({ ...localErrors, [validation.errorKey]: validation.errorMessage })
      return
    }

    const newSchedules = {
      ...currentSchedules,
      [dayId]: {
        ...daySchedule,
        [`${shiftType}Open`]: undefined,
        [`${shiftType}Close`]: undefined,
      },
    }

    // Limpiar error si existe
    updateErrors({ ...localErrors, [`${dayId}_shifts`]: "" })
    onChange({ ...data, schedules: newSchedules })
  }

  const allErrors = { ...errors, ...localErrors }

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Días de trabajo</Label>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.id} className="space-y-3">
                  <DaySelector
                    dayId={day.id}
                    dayLabel={day.label}
                    isSelected={data.workingDays.includes(day.id)}
                    onToggle={handleDayToggle}
                  />

                  {data.workingDays.includes(day.id) && (
                    <ScheduleSelector
                      dayId={day.id}
                      schedule={data.schedules[day.id] || {}}
                      onScheduleChange={handleScheduleChange}
                      onAddShift={handleAddShift}
                      onRemoveShift={handleRemoveShift}
                      errors={allErrors}
                    />
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
