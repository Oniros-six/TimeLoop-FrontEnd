import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  isAdmin: boolean;
  showInactive: boolean;
  onToggleInactive: () => void;
  onCreateUser: () => void;
  usersCount: number;
}

export function UsersHeader({
  isAdmin,
  showInactive,
  onToggleInactive,
  onCreateUser,
  usersCount
}: UsersHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col rounded-lg border bg-card p-4 gap-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <div className="flex gap-4">
          <Button
            size="sm"
            className="cursor-pointer hover:scale-105 transition-all tracking-wide"
            onClick={onToggleInactive}
          >
            {showInactive ? "Mostrar activos" : "Mostrar inactivos"}
          </Button>
        </div>
      </div>

      {/* Header principal */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {showInactive ? "Usuarios Inactivos" : "Usuarios Activos"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {usersCount} usuario{usersCount !== 1 ? "s" : ""} encontrado{usersCount !== 1 ? "s" : ""}
              </p>
            </div>

            {isAdmin && (
              <Button onClick={onCreateUser} className="w-full sm:w-auto">
                Agregar usuario
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
