import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { WorkingPatternSelector, type WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector";
import StatusMessage from "./StatusMessage";

interface WorkingPatternCardProps {
    data: WorkingPattern;
    onChange: (newPattern: WorkingPattern) => void;
    errors: Record<string, string>;
    onErrorChange: (errors: Record<string, string>) => void;
    title: string;
    description: string;
    onSave: () => void;
    isLoading: boolean;
    errorMessage: string | null;
    successMessage: string | null;
}

export default function WorkingPatternCard({
    data,
    onChange,
    errors,
    onErrorChange,
    title,
    description,
    onSave,
    isLoading,
    errorMessage,
    successMessage
}: WorkingPatternCardProps) {
    return (
        <Card>
            <CardContent className="px-3 sm:px-6 space-y-4">
                <WorkingPatternSelector
                    data={data}
                    onChange={onChange}
                    errors={errors}
                    onErrorChange={onErrorChange}
                    title={title}
                    description={description}
                    showTitle={true}
                />

                {errorMessage && <StatusMessage type="error" message={errorMessage} />}
                {successMessage && <StatusMessage type="success" message={successMessage} />}
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </CardFooter>
        </Card>
    );
}

