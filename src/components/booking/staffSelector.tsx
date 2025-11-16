import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User as UserIcon, Mail, Phone } from "lucide-react"
import type { IUser } from "@/interfaces/User"
import { UserRole } from "@/interfaces/User"
import type { BookingData } from "./bookingFlow"
import { useUsers } from "@/hooks/users/useUsers"

interface StaffSelectorProps {
  commerceId: number
  bookingData: BookingData
  setBookingData: (data: BookingData) => void
}

export function StaffSelector({ commerceId, bookingData, setBookingData }: StaffSelectorProps) {
  const { users, loading, error } = useUsers(commerceId)

  // Filtrar solo empleados activos (no admins)
  const staffMembers = useMemo(() => {
    return users.filter((user) => user.active)
  }, [users])

  const handleSelectStaff = (staff: IUser) => {
    setBookingData({
      ...bookingData,
      staff
    })
  }

  const skeletonCards = useMemo(() => Array.from({ length: 4 }), [])

  const introText = (
    <p className="text-muted-foreground">Elige el profesional que te atenderá</p>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="grid gap-4 sm:grid-cols-2">
          {skeletonCards.map((_, index) => (
            <Card key={`staff-skeleton-${index}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    )
  }

  if (staffMembers.length === 0) {
    return (
      <div className="space-y-6">
        {introText}
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          No hay profesionales disponibles en este momento.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {introText}

      <div className="grid gap-4 sm:grid-cols-2">
        {staffMembers.map((staff) => {
          const isSelected = bookingData.staff?.id === staff.id
          return (
            <Card
              key={staff.id}
              className={`cursor-pointer transition-all ${
                isSelected ? "border-primary bg-primary/5 shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => handleSelectStaff(staff)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {staff.avatar ? (
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{staff.name}</CardTitle>
                    </div>
                  </div>
                  {isSelected && <Badge>Seleccionado</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.phone}</span>
                  </div>
                </div> */}

                <Button
                  size="sm"
                  className="w-full"
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectStaff(staff)
                  }}
                >
                  {isSelected ? "Seleccionado" : "Seleccionar"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
