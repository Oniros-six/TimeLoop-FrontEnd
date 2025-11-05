import { useMutation } from "@tanstack/react-query";

interface UploadLogoResponse {
    success: boolean;
    message: string;
    logoUrl?: string;
}

export function useUploadLogo() {
    return useMutation({
        mutationFn: async (logoFile: File): Promise<UploadLogoResponse> => {
            const formData = new FormData();
            formData.append('file', logoFile);

            const response = await fetch('/api/upload-logo', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
            }

            return await response.json();
        },
    });
}

