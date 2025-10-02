import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { DashboardContent } from "./admin/dashboard-content";
import { UsersContent } from "./user/users-content";
import { useAtom } from "jotai";
import { viewAtom } from "@/atoms/view";

export default function DashboardIsland() {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const [view,] = useAtom(viewAtom);

  return (
                  <h1 className="text-xl font-semibold">{view}</h1>
                  <span className="text-sm text-muted-foreground hidden sm:block capitalize">

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
