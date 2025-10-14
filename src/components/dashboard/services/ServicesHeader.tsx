import { Button } from "@/components/ui/button";
import UserSelector from "../UserSelector";
import type { IUser } from "@/interfaces/User";

interface ServicesHeaderProps {
  isAdmin: boolean;
  selectedUser: IUser | null;
  setSelectedUser: (user: IUser | null) => void;
  currentUser: IUser | null;
  users: IUser[];
  onCreateService: () => void;
}

export function ServicesHeader({
  isAdmin,
  selectedUser,
  setSelectedUser,
  currentUser,
  users,
  onCreateService,
}: ServicesHeaderProps) {
  return (
    <>
      {isAdmin && (
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col rounded-lg border bg-card p-4 gap-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <div className="flex gap-4">
              <UserSelector
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                currentUser={currentUser}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      <div className="content-center">
        <Button size="lg" onClick={onCreateService}>
          Crear servicio
        </Button>
      </div>
    </>
  );
}
