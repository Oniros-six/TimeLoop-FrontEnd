export type Activity = {
  id: number
  type: "reserva" | "cancelación" | "pendiente"
  client: string
  service: string
  time: string
  date: string
  status: "confirmada" | "cancelada" | "pendiente"
}

export const activities: Activity[] = [
  { id: 1, type: "reserva", client: "María González", service: "Corte y peinado", time: "10:30 AM", date: "Hoy", status: "confirmada" },
  { id: 2, type: "cancelación", client: "Carlos Ruiz", service: "Barba y bigote", time: "2:00 PM", date: "Hoy", status: "cancelada" },
  { id: 3, type: "reserva", client: "Ana Martín", service: "Tinte y corte", time: "4:30 PM", date: "Mañana", status: "pendiente" },
  { id: 4, type: "reserva", client: "Luis Fernández", service: "Corte clásico", time: "11:00 AM", date: "Mañana", status: "confirmada" },
]


