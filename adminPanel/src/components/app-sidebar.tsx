import { Briefcase, Calendar, BarChartBig as ChartBar, FileText, HelpCircle, Home, Settings, User, Users } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Datos de navegación centralizados en config
const items = [
  {
    title: "Panel de control",
    url: "#",
    icon: Home,
    isActive: true,
  },
  {
    title: "Servicios",
    url: "#",
    icon: Briefcase,
  },
  {
    title: "Usuarios",
    url: "#",
    icon: Users,
  },
  {
    title: "Agenda",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Reportes",
    url: "#",
    icon: FileText,
  },
]

// Menú inferior
const bottomItems = [
  {
    title: "Configuración",
    url: "#",
    icon: Settings,
  },
  {
    title: "Soporte",
    url: "#",
    icon: HelpCircle,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
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
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <User />
                    <span>Usuario activo</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
