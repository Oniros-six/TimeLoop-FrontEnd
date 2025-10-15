import { type IUser } from "@/interfaces/User";
import UserCard from "./UserCard";

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
  // Ordenar usuarios: el usuario actual primero, luego el resto
  const sortedUsers = [...users].sort((a, b) => {
    if (currentUser) {
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
    }
    return 0;
  });

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No se encontraron usuarios
        </h3>
        <p className="text-sm text-muted-foreground">
          Los usuarios aparecerán aquí cuando se agreguen al sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          currentUser={currentUser}
          onRoleChange={onRoleChange}
          onStatusToggle={onStatusToggle}
          isStatusPending={isStatusPending}
        />
      ))}
    </div>
  );
}
