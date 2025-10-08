import { Button } from "@/components/ui/button";
import UserSelector from "./UserSelector";
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
        <UserSelector
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          currentUser={currentUser}
          users={users}
        />
      )}
      
      <div className="content-center">
        <Button size="lg" onClick={onCreateService}>
          Crear servicio
        </Button>
      </div>
    </>
  );
}
