import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type IUser } from "@/interfaces/User";
import UserActionsDropdown from "./UserActionsDropdown";
import { Mail, User as UserIcon, Shield, ShieldCheck, Phone } from "lucide-react";

interface UserCardProps {
    user: IUser;
    currentUser: IUser | null;
    onRoleChange: (user: IUser) => void;
    onStatusToggle: (user: IUser) => void;
    isStatusPending: boolean;
}

export default function UserCard({
    user,
    currentUser,
    onRoleChange,
    onStatusToggle,
    isStatusPending,
}: UserCardProps) {
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

    // Helper para obtener iniciales del nombre
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper para determinar si es el usuario actual
    const isCurrentUser = currentUser?.id === user.id;
    const isAdmin = currentUser?.role === "ADMIN" && currentUser?.active;

    return (
        <Card className={`relative transition-all hover:shadow-md hover:border-primary/50 pt-10 ${
            isCurrentUser ? "ring-2 ring-primary/20 bg-primary/5" : ""
        }`}>
            {/* Badge de estado */}
            <Badge 
                variant="secondary" 
                className={`absolute top-1 left-1 sm:top-3 sm:left-3 ${
                    user.active 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
            >
                {user.active ? "Activo" : "Inactivo"}
            </Badge>

            {/* Dropdown de acciones (solo para admin y no para el usuario actual) */}
            {isAdmin && !isCurrentUser && (
                <div className="absolute top-1 right-1 sm:top-3 sm:right-3">
                    <UserActionsDropdown
                        user={user}
                        onRoleChange={onRoleChange}
                        onStatusToggle={onStatusToggle}
                        isAdmin={isAdmin}
                        isStatusPending={isStatusPending}
                    />
                </div>
            )}

            <CardHeader className="">
                <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || ""} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2">{user.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                            {user.role === "ADMIN" ? (
                                <ShieldCheck className="h-4 w-4 text-purple-600" />
                            ) : (
                                <UserIcon className="h-4 w-4 text-blue-600" />
                            )}
                            <Badge variant="secondary" className={`text-xs ${getRolColor(user.role)}`}>
                                {user.role === "ADMIN" ? "Administrador" : "Colaborador"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-2">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="truncate">{user.phone || ""}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
