import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";
import WorkingPatternCard from "./WorkingPatternCard";
import type { WorkingPattern } from "@/components/dashboard/configs/WorkingPatternSelector";

interface ConfigTabProps {
    // Contenido de la pestaña básica
    basicContent: ReactNode;
    
    // Props para la pestaña de horarios
    workingPatternData: WorkingPattern;
    onWorkingPatternChange: (newPattern: WorkingPattern) => void;
    workingPatternErrors: Record<string, string>;
    onWorkingPatternErrorChange: (errors: Record<string, string>) => void;
    workingPatternTitle: string;
    workingPatternDescription: string;
    onSaveWorkingPattern: () => void;
    isLoadingWorkingPattern: boolean;
    workingPatternErrorMessage: string | null;
    workingPatternSuccessMessage: string | null;
}

export default function ConfigTab({
    basicContent,
    workingPatternData,
    onWorkingPatternChange,
    workingPatternErrors,
    onWorkingPatternErrorChange,
    workingPatternTitle,
    workingPatternDescription,
    onSaveWorkingPattern,
    isLoadingWorkingPattern,
    workingPatternErrorMessage,
    workingPatternSuccessMessage
}: ConfigTabProps) {
    return (
        <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-6">
                <TabsTrigger className="cursor-pointer" value="basico">Básico</TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="horarios">Horarios</TabsTrigger>
            </TabsList>

            <TabsContent value="basico">
                {basicContent}
            </TabsContent>

            <TabsContent value="horarios">
                <WorkingPatternCard
                    data={workingPatternData}
                    onChange={onWorkingPatternChange}
                    errors={workingPatternErrors}
                    onErrorChange={onWorkingPatternErrorChange}
                    title={workingPatternTitle}
                    description={workingPatternDescription}
                    onSave={onSaveWorkingPattern}
                    isLoading={isLoadingWorkingPattern}
                    errorMessage={workingPatternErrorMessage}
                    successMessage={workingPatternSuccessMessage}
                />
            </TabsContent>
        </Tabs>
    );
}

