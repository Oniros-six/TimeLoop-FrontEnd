import type { LucideIcon } from "lucide-react"
import { Home, Briefcase, Users, Calendar, FileText, Settings, HelpCircle } from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

export const navItems: NavItem[] = [
  { title: "Panel de control", url: "#", icon: Home, isActive: true },
  { title: "Servicios", url: "#", icon: Briefcase },
  { title: "Usuarios", url: "#", icon: Users },
  { title: "Agenda", url: "#", icon: Calendar },
  { title: "Reportes", url: "#", icon: FileText },
]

export const bottomNavItems: NavItem[] = [
  { title: "Configuración", url: "#", icon: Settings },
  { title: "Soporte", url: "#", icon: HelpCircle },
]


