import { useMutation } from "@tanstack/react-query";
import type { IWorkingPattern } from "@/interfaces/WorkingPattern";

interface Response {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useUserUpdateWP() {
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: number; data: IWorkingPattern[] }) => {
            const response = await fetch(`/api/config/user/WP/${userId}`, {
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

