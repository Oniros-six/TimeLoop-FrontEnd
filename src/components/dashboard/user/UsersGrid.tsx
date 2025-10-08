import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type IUser } from "@/interfaces/User";
import UserActionsDropdown from "./UserActionsDropdown";

interface UsersGridProps {
  users: IUser[];
  currentUser: IUser | null;
  onRoleChange: (user: IUser) => void;
  onStatusToggle: (user: IUser) => void;
  isStatusPending: boolean;
}

export function UsersGrid({
  users,
  currentUser,
  onRoleChange,
  onStatusToggle,
  isStatusPending,
}: UsersGridProps) {
  // Helper de color del badge
  const getRolColor = (rol: string) => {
    switch (rol) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "EMPLOYEE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              {currentUser?.role === "ADMIN" && currentUser?.active && (
                <TableHead className="text-right">Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={currentUser?.role === "ADMIN" ? 4 : 3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((usuario) => (
                <TableRow
                  key={usuario.id}
                  className={`${currentUser?.id === usuario.id ? "bg-accent/30" : ""}`}
                >
                  <TableCell className="font-medium">{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getRolColor(usuario.role)}>
                      {usuario.role === "ADMIN" ? "Administrador" : "Colaborador"}
                    </Badge>
                  </TableCell>
                  {currentUser?.role === "ADMIN" && currentUser?.active && (
                    <TableCell className={`text-right ${currentUser?.id === usuario.id ? "invisible" : ""}`}>
                      <UserActionsDropdown
                        user={usuario}
                        onRoleChange={onRoleChange}
                        onStatusToggle={onStatusToggle}
                        isAdmin={currentUser?.role === "ADMIN"}
                        isStatusPending={isStatusPending}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
