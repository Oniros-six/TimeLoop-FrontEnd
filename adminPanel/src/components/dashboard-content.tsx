import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { MetricsGrid } from "@/components/metrics-grid"
import { RecentActivityCard } from "@/components/recent-activity-card"
import { HistoryCard } from "@/components/history-card"

export function DashboardContent() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">Panel de control</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">{currentDate}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Métricas */}
        <MetricsGrid />

        {/* Actividad Reciente */}
        <RecentActivityCard />

        {/* Historial */}
        <HistoryCard />
      </div>
    </div>
  )
}
