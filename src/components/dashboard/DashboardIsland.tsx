import { viewAtom } from "@/atoms/view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { DashboardContent } from "./admin/dashboard-content";
import { AppSidebar } from "./app-sidebar";
import { BookingsContent } from "./bookings/bookings-content";
import ConfigsContent from "./configs/configs-content";
import { ServicesContent } from "./services/services-content";
import { UsersContent } from "./user/users-content";
import { DashboardWrapper } from "./DashboardWrapper";
import { Proximamente } from "./proximamente/proximamente";

export default function DashboardIsland() {
  const queryClient = new QueryClient();

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const [view,] = useAtom(viewAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/admin">
        <SidebarProvider>
          <DashboardWrapper>
            <AppSidebar view={view} />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 sm:px-4">
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-xl font-semibold">{view}</h1>
                    <span className="text-sm text-muted-foreground hidden sm:block capitalize">
                      {currentDate}
                    </span>
                  </div>
                </header>
                <Routes>
                  <Route path="/" element={<DashboardContent />} />
                  <Route path="/usuarios" element={<UsersContent />} />
                  <Route path="/servicios" element={<ServicesContent />} />
                  <Route path="/agenda" element={<BookingsContent />} />
                  <Route path="/config" element={<ConfigsContent />} />
                  <Route path="/proximamente" element={<Proximamente />} />
                </Routes>
              </div>
            </SidebarInset>
          </DashboardWrapper>
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
