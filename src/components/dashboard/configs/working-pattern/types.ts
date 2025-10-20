// Interfaces para el sistema de patrones de trabajo
export interface DaySchedule {
  morningOpen?: string
  morningClose?: string
  afternoonOpen?: string
  afternoonClose?: string
}

export interface WorkingPattern {
  workingDays: string[]
  schedules: Record<string, DaySchedule>
}

export interface WorkingPatternSelectorProps {
  data: WorkingPattern
  onChange: (data: WorkingPattern) => void
  errors?: Record<string, string>
  onErrorChange?: (errors: Record<string, string>) => void
  title?: string
  description?: string
  showTitle?: boolean
  className?: string
}

export interface DaySelectorProps {
  dayId: string
  dayLabel: string
  isSelected: boolean
  onToggle: (dayId: string, checked: boolean) => void
}

export interface ScheduleSelectorProps {
  dayId: string
  schedule: DaySchedule
  onScheduleChange: (dayId: string, field: keyof DaySchedule, value: string) => void
  onAddShift: (dayId: string, shiftType: 'morning' | 'afternoon') => void
  onRemoveShift: (dayId: string, shiftType: 'morning' | 'afternoon') => void
  errors?: Record<string, string>
}

export interface TimeSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface ShiftSelectorProps {
  dayId: string
  shiftType: 'morning' | 'afternoon'
  schedule: DaySchedule
  onScheduleChange: (dayId: string, field: keyof DaySchedule, value: string) => void
  onRemove: (dayId: string, shiftType: 'morning' | 'afternoon') => void
  errors?: Record<string, string>
}
