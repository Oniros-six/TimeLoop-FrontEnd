import { Button } from "@/components/ui/button";
import UserSelector from "../UserSelector";
import type { IUser } from "@/interfaces/User";

interface BookingsHeaderProps {
  isAdmin: boolean;
  selectedUser: IUser | null;
  setSelectedUser: (user: IUser | null) => void;
  setSearchingByUser: (state: boolean) => void;
  currentUser: IUser | null;
  users: IUser[];
}

export function BookingsHeader({
  isAdmin,
  selectedUser,
  setSelectedUser,
  setSearchingByUser,
  currentUser,
  users,
}: BookingsHeaderProps) {

  return (
    <>
      {isAdmin && (
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col rounded-lg border bg-card p-2 md:p-4 gap-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <div className="flex gap-4">
              <UserSelector
                setSearchingByUser={setSearchingByUser}
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
                currentUser={currentUser}
                users={users}
              />
              <Button onClick={() => {
                setSearchingByUser(false);
                setSelectedUser(null);
              }}>Ver todas</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
