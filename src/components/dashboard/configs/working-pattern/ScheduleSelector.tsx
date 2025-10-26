import { memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ShiftSelector } from "./ShiftSelector"
import type { ScheduleSelectorProps } from "./types"

export const ScheduleSelector = memo(function ScheduleSelector({
  dayId,
  schedule,
  onScheduleChange,
  onAddShift,
  onRemoveShift,
  errors = {}
}: ScheduleSelectorProps) {
  const hasMorningShift = schedule.morningOpen && schedule.morningClose
  const hasAfternoonShift = schedule.afternoonOpen && schedule.afternoonClose
  const shiftError = errors[`${dayId}_shifts`]

  // Callbacks estables para evitar re-renders
  const handleAddMorning = useCallback(() => onAddShift(dayId, 'morning'), [dayId, onAddShift])
  const handleAddAfternoon = useCallback(() => onAddShift(dayId, 'afternoon'), [dayId, onAddShift])

  return (
    <div className="ml-6 space-y-3">
      {/* Turno Mañana */}
      {hasMorningShift ? (
        <ShiftSelector
          dayId={dayId}
          shiftType="morning"
          schedule={schedule}
          onScheduleChange={onScheduleChange}
          onRemove={onRemoveShift}
          errors={errors}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddMorning}
          className="w-full h-8 text-xs"
        >
          + Agregar turno mañana
        </Button>
      )}

      {/* Turno Tarde */}
      {hasAfternoonShift ? (
        <ShiftSelector
          dayId={dayId}
          shiftType="afternoon"
          schedule={schedule}
          onScheduleChange={onScheduleChange}
          onRemove={onRemoveShift}
          errors={errors}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddAfternoon}
          className="w-full h-8 text-xs"
        >
          + Agregar turno tarde
        </Button>
      )}

      {/* Error de turnos */}
      {shiftError && (
        <p className="text-xs text-red-500">{shiftError}</p>
      )}
    </div>
  )
})
