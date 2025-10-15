import { Button } from "@/components/ui/button";
import type { IUser } from "@/interfaces/User";

interface BookingsEmptyProps {
  searchingByUser: boolean;
  selectedUser: IUser | null;
  currentUser: IUser | null;
}

export function BookingsEmpty({ searchingByUser, selectedUser, currentUser }: BookingsEmptyProps) {
  const isViewingOtherUser = selectedUser?.id !== currentUser?.id;

  if (searchingByUser && isViewingOtherUser) {
    return (
      <div className="flex flex-col gap-4">
        <div className="max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded content-center self-center">
          No encontramos reservas para {selectedUser?.name}.
        </div>
      </div>
    );
  }

  if (searchingByUser && !isViewingOtherUser) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded justify-center self-center">
        No tienes reservas asignadas aún.
        <p className="text-sm">Las reservas que te asignen aparecerán aquí.</p>
      </div>
    );
  }

  // Vista general del comercio
  return (
    <div className="flex flex-col gap-4 max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded justify-center self-center">
      No hay reservas en el comercio aún.
      <p className="text-sm">Las reservas de todos los usuarios aparecerán aquí.</p>
    </div>
  );
}
