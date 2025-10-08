import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { IService } from "@/interfaces/Service";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ServiceOptionsInterface {
    service: IService
    handleDelete: (service: IService) => void
    handleUpdate: (service: IService) => void
}

export default function ServiceOptions({
    service,
    handleDelete,
    handleUpdate
}: ServiceOptionsInterface) {

    return (
        <div className="absolute top-2 right-2 z-10">
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
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUpdate(service)
                        }}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(service)
                        }}
                        className="text-destructive/90 tracking-wide font-semibold hover:!bg-destructive hover:text-destructive-foreground"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}