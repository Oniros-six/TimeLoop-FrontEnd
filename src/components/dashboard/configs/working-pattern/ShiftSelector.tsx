import { Button } from "@/components/ui/button"
import { TimeSelector } from "./TimeSelector"
import { DEFAULT_SHIFT_TIMES } from "./constants"
import type { ShiftSelectorProps } from "./types"

export function ShiftSelector({
  dayId,
  shiftType,
  schedule,
  onScheduleChange,
  onRemove,
  errors = {}
}: ShiftSelectorProps) {
  const isMorning = shiftType === 'morning'
  const openField = isMorning ? 'morningOpen' : 'afternoonOpen'
  const closeField = isMorning ? 'morningClose' : 'afternoonClose'
  const openValue = schedule[openField] || DEFAULT_SHIFT_TIMES[shiftType].open
  const closeValue = schedule[closeField] || DEFAULT_SHIFT_TIMES[shiftType].close
  const errorKey = `${dayId}_${shiftType}_schedule`
  const errorMessage = errors[errorKey]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Turno {isMorning ? 'Mañana' : 'Tarde'}
        </span>
        <button
          onClick={() => onRemove(dayId, shiftType)}
          className="h-6 px-2 text-sm tracking-wider cursor-pointer text-red-500 hover:ring hover:ring-red-500 rounded-md"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">APERTURA:</span>
          <TimeSelector
            value={openValue}
            onChange={(value) => onScheduleChange(dayId, openField, value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">CIERRE:</span>
          <TimeSelector
            value={closeValue}
            onChange={(value) => onScheduleChange(dayId, closeField, value)}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}
