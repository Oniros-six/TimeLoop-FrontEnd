import { useState } from "react";

export interface ConfigMessages {
    errorMessage: string | null;
    successMessage: string | null;
    setErrorMessage: (message: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
    clearMessages: () => void;
}

export function useConfigMessages(): ConfigMessages {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const clearMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return {
        errorMessage,
        successMessage,
        setErrorMessage,
        setSuccessMessage,
        clearMessages
    };
}

