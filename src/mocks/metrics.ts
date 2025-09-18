import { DollarSign, Users, UserCheck, Clock } from "lucide-react"

export type Metric = {
  title: string
  value: string
  change: string
  icon: any
  color: string
}

export const metrics: Metric[] = [
  {
    title: "Ganancias este mes",
    value: "$12,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Nuevos clientes",
    value: "24",
    change: "+8 esta semana",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Clientes recurrentes",
    value: "89%",
    change: "+2.1% vs mes anterior",
    icon: UserCheck,
    color: "text-purple-600",
  },
  {
    title: "Horario pico",
    value: "2:00 - 4:00 PM",
    change: "Sábados",
    icon: Clock,
    color: "text-orange-600",
  },
]


