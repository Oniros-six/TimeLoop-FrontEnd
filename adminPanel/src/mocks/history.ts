export type HistoryItem = {
  id: string
  client: string
  service: string
  date: string
  amount: string
  status: "completado" | "pendiente" | "cancelado"
}

export const historyData: HistoryItem[] = [
  { id: "001", client: "Patricia López", service: "Corte y color", date: "15/01/2024", amount: "$85.00", status: "completado" },
  { id: "002", client: "Roberto Silva", service: "Corte clásico", date: "15/01/2024", amount: "$25.00", status: "completado" },
  { id: "003", client: "Carmen Díaz", service: "Peinado para evento", date: "14/01/2024", amount: "$120.00", status: "completado" },
  { id: "004", client: "Miguel Torres", service: "Barba y corte", date: "14/01/2024", amount: "$35.00", status: "completado" },
  { id: "005", client: "Elena Morales", service: "Tratamiento capilar", date: "13/01/2024", amount: "$95.00", status: "completado" },
]


