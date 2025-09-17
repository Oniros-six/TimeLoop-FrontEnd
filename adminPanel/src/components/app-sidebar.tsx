import { Briefcase, Calendar, BarChartBig as ChartBar, Clock, FileText, HelpCircle, Home, Settings, User, Users } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"

// Datos de navegación centralizados en config
const items = [
  {
    title: "Panel de control",
    url: "/",
    icon: Home,
    isActive: true,
  },
  {
    title: "Servicios",
    url: "services",
    icon: Briefcase,
  },
  {
    title: "Usuarios",
    url: "users",
    icon: Users,
  },
  {
    title: "Agenda",
    url: "schedule",
    icon: Calendar,
  },
  {
    title: "Historial",
    url: "history",
    icon: Clock,
  },
  {
    title: "Reportes",
    url: "reports",
    icon: FileText,
  },
]

// Menú inferior
const bottomItems = [
  {
    title: "Configuración",
    url: "config",
    icon: Settings,
  },
  {
    title: "Soporte",
    url: "support",
    icon: HelpCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="h-full">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChartBar className="h-4 w-4" />
          </div>
          <span className="font-semibold">Logo</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                  <div className="flex gap-2 align-content-center w-full justify-start">
                    <User />
                    <span>Usuario activo</span>
                  </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
