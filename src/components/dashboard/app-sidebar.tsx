import { useEffect, useState } from "react";
import { Briefcase, Calendar, CalendarDays, BarChartBig as ChartBar, Clock, FileText, HelpCircle, Home, Receipt, Settings, User, Users } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import LogoutButton from "@/components/auth/logout/LogoutButton";

import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { dashboardAtom } from "@/atoms/dashboard";
import { Link } from "react-router-dom";
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
    url: "agenda",
    icon: Calendar,
  },
  {
    title: "Planilla de trabajo",
    url: "planilla",
    icon: CalendarDays,
  },
  {
    title: "Historial",
    url: "historial",
    icon: Clock,
  },
  {
    title: "Reportes",
    url: "reporte",
    icon: FileText,
  },
  {
    title: "Facturas",
    url: "facturas",
    icon: Receipt,
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
  const [user,] = useAtom(userAtom);
  const [dashboardData,] = useAtom(dashboardAtom);

  const HeaderSkeleton = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  )

  //TODO Traer el logo del comercio en algun llamado
  const Header = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        <img
          src={"/timeloop.png"}
          alt={user?.name || "Usuario"}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <span className="font-semibold">{dashboardData?.commerceName}</span>
    </div>
  )

  const FooterSkeleton = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  )

  const Footer = () => (
    <div className="flex gap-2 align-content-center w-full justify-start px-1">
      <User />
      <span>{user?.name}</span>
    </div>
  )

  return (
    <Sidebar className="h-full">
      <SidebarHeader className="p-4 bg-card">
        {dashboardData != undefined ? <Header /> : <HeaderSkeleton />}
      </SidebarHeader>

      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-card">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        <LogoutButton />

        <SidebarGroup className="bg-card">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {user != null ? <Footer /> : <FooterSkeleton />}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
