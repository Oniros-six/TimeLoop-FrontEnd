import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";
import { dashboardAtom } from "@/atoms/dashboard";

export default function DashboardIsland() {
  const [user,] = useAtom(userAtom);
  const [dashboardData, setDashboardData] = useAtom(dashboardAtom);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/dashboard/${user.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.statusCode === 200) {
          setDashboardData(data.data);
        } else {
          throw error
        }

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error al cargar los datos del panel de control');
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex h-[98vh] w-full self-center items-center justify-center ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Cargando datos del panel...</p>
        </div>
      </div>
    )
  }

  if (error || dashboardData === undefined) {
    return (
      <div className="flex h-[98vh] w-full self-center items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} commerceName={dashboardData.commerceName} />
      <SidebarInset>
        <DashboardContent dashboardData={dashboardData} />
      </SidebarInset>
    </SidebarProvider>
  )
}
