import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function SidebarLayoutIsland() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
