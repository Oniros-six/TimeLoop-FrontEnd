import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone } from "lucide-react"
import type { BookingData } from "./bookingFlow"
import type { ICustomer } from "@/interfaces/Customer"

interface CustomerInfoFormProps {
  bookingData: BookingData
  setBookingData: (data: BookingData) => void
}

export function CustomerInfoForm({ bookingData, setBookingData }: CustomerInfoFormProps) {
  const [liveErrors, setLiveErrors] = useState<{ customer: { name?: string, email?: string, phone?: string } }>({
    customer: { name: "", email: "", phone: "" }
  })

  const validatePhone = (phone: string): string => {
    if (phone && phone.length > 0) {
      if (!/^\d+$/.test(phone)) {
        return "El teléfono solo puede contener números"
      } else if (!phone.startsWith('09')) {
        return "El teléfono debe empezar por 09"
      } else if (phone.length !== 9) {
        return "El teléfono debe tener exactamente 9 dígitos"
      }
    }
    return ""
  }

  const validateEmail = (email: string): string => {
    if (email && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return "Por favor ingresa un email válido"
      }
    }
    return ""
  }

  const validateName = (name: string): string => {
    if (name && name.length > 0) {
      if (name.trim().length < 5) {
        return "El nombre debe tener al menos 5 caracteres"
      }
    }
    return ""
  }

  const handleChange = (field: string, value: string) => {
    const currentCustomer = bookingData.customer || { name: "", email: "", phone: "" }
    setBookingData({
      ...bookingData,
      customer: {
        name: field === 'name' ? value : currentCustomer.name || "",
        email: field === 'email' ? value : currentCustomer.email || "",
        phone: field === 'phone' ? value : currentCustomer.phone || "",
      } as ICustomer,
    })

    // Validación en vivo
    if (field === 'phone') {
      const phoneError = validatePhone(value)
      setLiveErrors(prev => ({
        ...prev,
        customer: { ...prev.customer, phone: phoneError }
      }))
    } else if (field === 'email') {
      const emailError = validateEmail(value)
      setLiveErrors(prev => ({
        ...prev,
        customer: { ...prev.customer, email: emailError }
      }))
    } else if (field === 'name') {
      const nameError = validateName(value)
      setLiveErrors(prev => ({
        ...prev,
        customer: { ...prev.customer, name: nameError }
      }))
    }
  }
  useEffect(() => {
    console.log(bookingData)
  }, [bookingData])

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Completa tus datos personales para finalizar la reserva</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nombre y Apellido */}
        <div className="sm:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre y Apellido
            </Label>
            <Input
              id="customerName"
              placeholder="Ej: Juan Pérez"
              value={bookingData.customer?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={liveErrors.customer?.name ? "border-red-500" : ""}
            />
            {liveErrors.customer?.name && (
              <p className="text-sm text-red-500">{liveErrors.customer?.name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={bookingData.customer?.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={liveErrors.customer?.email ? "border-red-500" : ""}
            />
            {liveErrors.customer?.email && (
              <p className="text-sm text-red-500">{liveErrors.customer?.email}</p>
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="098765432"
              value={bookingData.customer?.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              maxLength={9}
              className={liveErrors.customer?.phone ? "border-red-500" : ""}
            />
            {liveErrors.customer?.phone && (
              <p className="text-sm text-red-500">{liveErrors.customer?.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información importante */}
      <Card className="border-2 border-[#ffd105] ">
        <CardContent>
          <p>
            Recibirás un correo de confirmación con los detalles de tu reserva. Por favor,
            verifica que tu email y teléfono sean correctos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
