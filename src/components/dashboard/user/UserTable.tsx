import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type IUser } from "@/interfaces/User";
import UserActionsDropdown from "./UserActionsDropdown";

interface UserTableProps {
    users: IUser[];
    isAdmin: boolean;
    onRoleChange: (user: IUser) => void;
    onStatusToggle: (user: IUser) => void;
    isStatusPending: boolean;
    showInactive: boolean;
}

export default function UserTable({
    users,
    isAdmin,
    onRoleChange,
    onStatusToggle,
    isStatusPending,
    showInactive
}: UserTableProps) {
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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    {isAdmin && (
                        <TableHead className="text-right">Acciones</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={isAdmin ? 4 : 3} className="h-24 text-center text-muted-foreground">
                            No se encontraron usuarios {showInactive ? "inactivos" : "activos"}
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell className="font-medium">{usuario.name}</TableCell>
                            <TableCell>{usuario.email}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={getRolColor(usuario.role)}>
                                    {usuario.role === "ADMIN" ? "Administrador" : "Colaborador"}
                                </Badge>
                            </TableCell>
                            {isAdmin && (
                                <TableCell className="text-right">
                                    <UserActionsDropdown
                                        user={usuario}
                                        onRoleChange={onRoleChange}
                                        onStatusToggle={onStatusToggle}
                                        isAdmin={isAdmin}
                                        isStatusPending={isStatusPending}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
