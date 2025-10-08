import { Button } from "@/components/ui/button";
import type { IUser } from "@/interfaces/User";

interface ServicesEmptyProps {
  selectedUser: IUser | null;
  currentUser: IUser | null;
  onCreateService: () => void;
}

export function ServicesEmpty({ selectedUser, currentUser, onCreateService }: ServicesEmptyProps) {
  const isViewingOtherUser = selectedUser?.id !== currentUser?.id;

  if (isViewingOtherUser) {
    return (
      <div className="flex flex-col gap-4">
        <div className="max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded content-center self-center">
          No encontramos servicios para {selectedUser?.name}.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded justify-center self-center">
      No tienes servicios asociados aún, prueba crear el primero:
      <div>
        <Button onClick={onCreateService}>Crear servicio</Button>
      </div>
    </div>
  );
}
