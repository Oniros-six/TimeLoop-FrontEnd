import { Briefcase, Calendar, CalendarDays, Clock, ExternalLink, FileText, Handshake, HelpCircle, Home, Receipt, Settings, User, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import LogoutButton from "@/components/auth/logout/LogoutButton";

import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { Link } from "react-router-dom";
import { useCommerce } from "@/hooks/commerce/useCommerce";
// Datos de navegación centralizados en config
const items = [
  {
    title: "Panel de control",
    url: "/",
    icon: Home,
  },
  {
    title: "Servicios",
    url: "servicios",
    icon: Briefcase,
  },
  {
    title: "Usuarios",
    url: "usuarios",
    icon: Users,
  },
  {
    title: "Clientes",
    url: "proximamente", // TODO: Agregar la ruta de los clientes
    icon: Handshake,
  },
  {
    title: "Agenda",
    url: "proximamente", // TODO: Agregar la ruta de la agenda
    icon: Calendar,
  },
  {
    title: "Planilla de trabajo",
    url: "proximamente", // TODO: Agregar la ruta de la planilla de trabajo
    icon: CalendarDays,
  },
  {
    title: "Historial",
    url: "proximamente", // TODO: Agregar la ruta del historial
    icon: Clock,
  },
  {
    title: "Reportes",
    url: "proximamente", // TODO: Agregar la ruta de los reportes
    icon: FileText,
  },
  {
    title: "Facturas",
    url: "proximamente", // TODO: Agregar la ruta de las facturas
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

export function AppSidebar({ view }: { view: string }) {
  const [user,] = useAtom(userAtom);
  const { commerce, loading: commerceLoading } = useCommerce();
  const HeaderSkeleton = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  )

  const Header = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        <img
          src={commerce?.logo || "https://res.cloudinary.com/dsnt2xrb9/image/upload/v1759200427/timeloop/Timeloop_logo.png"}
          alt={user?.name || "Usuario"}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{commerce?.name}</span>
        <div className="flex flex-row gap-2 items-center">
          <a href={`/${commerce?.uniqueName}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
            Link de reservas
          </a>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
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
        {commerceLoading || !commerce ? <HeaderSkeleton /> : <Header />}
      </SidebarHeader>

      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.title === view}>
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
