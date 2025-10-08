import { X } from "lucide-react";

interface ErrorDisplayProps {
    errorMessage: string | null | undefined;
    onClearError?: () => void;
}

export default function ErrorDisplay({ errorMessage, onClearError }: ErrorDisplayProps) {
    if (!errorMessage) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-start">
                <div className="flex-1">
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
                {onClearError && (
                    <button
                        onClick={onClearError}
                        className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
