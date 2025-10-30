import { useMutation } from "@tanstack/react-query";

interface Response {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useUpdateUserInfo() {
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: number; data: Record<string, any> }) => {
            const response = await fetch(`/api/user/${userId}`, {
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

