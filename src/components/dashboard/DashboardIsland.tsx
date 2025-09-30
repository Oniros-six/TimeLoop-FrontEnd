import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { DashboardContent } from "./admin/dashboard-content";
import { UsersContent } from "./user/users-content";

export default function DashboardIsland() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <BrowserRouter basename="/admin">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 sm:p-4">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-1 items-center justify-between">
                <h1 className="text-xl font-semibold">{"view"}</h1>
                <span className="text-sm text-muted-foreground hidden sm:block capitalize">
                  {currentDate}
                </span>
              </div>
            </header>

            {/* Aquí entran las rutas internas */}
            <Routes>
              <Route path="/" element={<DashboardContent />} />
              <Route path="/users" element={<UsersContent />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}
