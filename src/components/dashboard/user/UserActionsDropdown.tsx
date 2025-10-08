import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserCog, UserX, UserCheck } from "lucide-react";
import { type IUser } from "@/interfaces/User";

interface UserActionsDropdownProps {
    user: IUser;
    onRoleChange: (user: IUser) => void;
    onStatusToggle: (user: IUser) => void;
    isAdmin: boolean;
    isStatusPending: boolean;
}

export default function UserActionsDropdown({
    user,
    onRoleChange,
    onStatusToggle,
    isAdmin,
    isStatusPending
}: UserActionsDropdownProps) {
    if (!isAdmin) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menú de opciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="tracking-wide">Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRoleChange(user)}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Cambiar rol
                </DropdownMenuItem>
                {user.active ? (
                    <DropdownMenuItem
                        disabled={isStatusPending}
                        className="text-destructive hover:!bg-destructive hover:text-destructive-foreground"
                        onClick={() => onStatusToggle(user)}
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        Suspender usuario
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        disabled={isStatusPending}
                        onClick={() => onStatusToggle(user)}
                    >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Reactivar usuario
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
