import { Button } from "@/components/ui/button";

interface UsersEmptyProps {
  showInactive: boolean;
  onCreateUser: () => void;
}

export function UsersEmpty({ showInactive, onCreateUser }: UsersEmptyProps) {
  return (
    <div className="flex flex-col gap-4 max-w-4xl w-full h-40 p-2 border-1 border-border text-center text-secondary-foreground rounded justify-center self-center">
      {showInactive ? (
        <>
          No hay usuarios inactivos en tu comercio.
          <p className="text-sm">Los usuarios suspendidos aparecerán aquí.</p>
        </>
      ) : (
        <>
          No tienes usuarios activos en tu comercio.
          <div>
            <Button onClick={onCreateUser}>
              Agregar primer usuario
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
