import { useMutation } from "@tanstack/react-query";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";

interface Response {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useCommerceUpdateWP() {
    return useMutation({
        mutationFn: async ({ commerceId, data }: { commerceId: number; data: IWorkingPattern[] }) => {
            const response = await fetch(`/api/config/commerce/WP/${commerceId}`, {
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

