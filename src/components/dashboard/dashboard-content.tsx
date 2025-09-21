import { SidebarTrigger } from "@/components/ui/sidebar"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card"
import { HistoryCard } from "@/components/dashboard/history-card"
import type { DashboardData } from "@/interfaces/DashboardData"

export function DashboardContent({dashboardData}: { dashboardData: DashboardData}) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-1 flex-col gap-4 sm:p-4">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Panel de control</h1>
          <span className="text-sm text-muted-foreground hidden sm:block">{currentDate}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 pt-0">
        {/* Métricas */}
        <MetricsGrid />

        {/* Actividad Reciente */}
        <RecentActivityCard />

        {/* Historial */}
        <HistoryCard history={dashboardData.history}/>
      </div>
    </div>
  )
}
