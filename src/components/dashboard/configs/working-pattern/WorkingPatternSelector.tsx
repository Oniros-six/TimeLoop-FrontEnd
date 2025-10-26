import { useState, useCallback, useRef, useEffect } from "react"
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
  title,
  description,
  showTitle,
  className
}: WorkingPatternSelectorProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  
  // Mantener referencias estables usando un solo ref
  const refs = useRef({ data, onChange, errors, onErrorChange })
  
  useEffect(() => {
    refs.current = { data, onChange, errors, onErrorChange }
  }, [data, onChange, errors, onErrorChange])

  // Notificar al padre cuando cambien los errores locales
  useEffect(() => {
    if (refs.current.onErrorChange) {
      refs.current.onErrorChange(localErrors)
    }
  }, [localErrors])

  // Actualizar errores locales
  const setError = useCallback((key: string, value: string) => {
    setLocalErrors(prev => {
      const newErrors = { ...prev }
      if (value) {
        newErrors[key] = value
      } else {
        delete newErrors[key]
      }
      return newErrors
    })
  }, [])

  // Manejar selección/deselección de días
  const handleDayToggle = useCallback((dayId: string, checked: boolean) => {
    const { workingDays, schedules } = refs.current.data
    let newDays: string[]
    const newSchedules = { ...schedules }

    if (checked) {
      newDays = [...workingDays, dayId]
      newSchedules[dayId] = DEFAULT_DAY_SCHEDULE
    } else {
      newDays = workingDays.filter(day => day !== dayId)
      delete newSchedules[dayId]
    }

    refs.current.onChange({ workingDays: newDays, schedules: newSchedules })

    // Limpiar error de días de trabajo si hay días seleccionados
    if (newDays.length > 0 && refs.current.errors.workingDays) {
      setError('workingDays', '')
    }
  }, [setError])

  // Manejar cambios en horarios
  const handleScheduleChange = useCallback((
    dayId: string,
    field: keyof DaySchedule,
    value: string,
  ) => {
    const currentData = refs.current.data
    const currentSchedule = currentData.schedules[dayId] || {}
    const updatedSchedule = {
      ...currentSchedule,
      [field]: value,
    }

    const newSchedules = {
      ...currentData.schedules,
      [dayId]: updatedSchedule,
    }

    // Validar horarios
    const validation = validateSchedule(dayId, field, value, updatedSchedule)
    
    if (validation) {
      setError(validation.errorKey, validation.errorMessage)
    } else {
      // Limpiar errores del día si la validación pasa
      setError(`${dayId}_morning_schedule`, '')
      setError(`${dayId}_afternoon_schedule`, '')
    }

    refs.current.onChange({ ...currentData, schedules: newSchedules })
  }, [setError])

  // Agregar un turno
  const handleAddShift = useCallback((dayId: string, shiftType: 'morning' | 'afternoon') => {
    const currentData = refs.current.data
    const currentSchedule = currentData.schedules[dayId] || {}
    const shiftTimes = DEFAULT_SHIFT_TIMES[shiftType]

    const newSchedules = {
      ...currentData.schedules,
      [dayId]: {
        ...currentSchedule,
        [`${shiftType}Open`]: shiftTimes.open,
        [`${shiftType}Close`]: shiftTimes.close,
      },
    }

    refs.current.onChange({ ...currentData, schedules: newSchedules })
  }, [])

  // Remover un turno
  const handleRemoveShift = useCallback((dayId: string, shiftType: 'morning' | 'afternoon') => {
    const currentData = refs.current.data
    const currentSchedule = currentData.schedules[dayId] || {}

    // Validar que haya al menos un turno activo
    const validation = validateShiftRemoval(dayId, shiftType, currentSchedule)
    
    if (validation) {
      setError(validation.errorKey, validation.errorMessage)
      return
    }

    const newSchedules = {
      ...currentData.schedules,
      [dayId]: {
        ...currentSchedule,
        [`${shiftType}Open`]: undefined,
        [`${shiftType}Close`]: undefined,
      },
    }

    // Limpiar error si existe
    setError(`${dayId}_shifts`, '')
    refs.current.onChange({ ...currentData, schedules: newSchedules })
  }, [setError])

  // Combinar errores externos con errores locales
  const allErrors = { ...errors, ...localErrors }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {showTitle && title && (
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

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
        
        {errors.workingDays && (
          <p className="text-sm text-red-500">{errors.workingDays}</p>
        )}
      </div>
    </div>
  )
}
