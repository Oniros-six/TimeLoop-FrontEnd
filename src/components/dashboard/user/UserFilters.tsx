import { Button } from "@/components/ui/button";

interface UserFiltersProps {
    showInactive: boolean;
    onToggleInactive: () => void;
}

export default function UserFilters({ showInactive, onToggleInactive }: UserFiltersProps) {
    return (
        <div className="flex flex-col rounded-lg border bg-card p-4 gap-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <div className="flex gap-4">
                <Button
                    size="sm"
                    className="cursor-pointer hover:scale-105 transition-all tracking-wide"
                    onClick={onToggleInactive}
                >
                    {showInactive ? "Mostrar activos" : "Mostrar inactivos"}
                </Button>
            </div>
        </div>
    );
}
