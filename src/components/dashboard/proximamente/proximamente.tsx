import { Construction, Clock } from "lucide-react";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { viewAtom } from "@/atoms/view";

export function Proximamente() {
    const [, setView] = useAtom(viewAtom);
    
    useEffect(() => {
        setView("Próximamente");
    }, [setView]);

    return (
        <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-6 text-center max-w-md px-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative bg-card border border-border rounded-full p-8 shadow-lg">
                        <Construction className="h-16 w-16 text-primary" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">
                        Próximamente
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Esta función está en desarrollo
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-6 w-6 md:h-4 md:w-4" />
                    <span>Estamos trabajando para traerte esta funcionalidad pronto</span>
                </div>

                <div className="mt-4 w-full max-w-xs">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

