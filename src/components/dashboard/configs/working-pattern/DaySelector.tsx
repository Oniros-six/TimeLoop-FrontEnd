import { memo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { DaySelectorProps } from "./types"

export const DaySelector = memo(function DaySelector({ 
  dayId, 
  dayLabel, 
  isSelected, 
  onToggle 
}: DaySelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={dayId}
        checked={isSelected}
        onCheckedChange={(checked) => onToggle(dayId, checked as boolean)}
        className="cursor-pointer"
      />
      <Label htmlFor={dayId} className="text-sm font-medium cursor-pointer">
        {dayLabel}
      </Label>
    </div>
  )
})
