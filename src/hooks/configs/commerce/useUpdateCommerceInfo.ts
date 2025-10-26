import { useMutation } from "@tanstack/react-query";

interface Response {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useUpdateCommerceInfo() {
    return useMutation({
        mutationFn: async ({ commerceId, data }: { commerceId: number; data: Record<string, any> }) => {
            const response = await fetch(`/api/commerce/${commerceId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as Response;
        },
    });
}

