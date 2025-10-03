import { useMutation } from "@tanstack/react-query";
import { UserRole } from "@/interfaces/User";

interface ChangeRoleResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useChangeRol() {
    
    return useMutation({
        mutationFn: async ({ userId, newRole }: { userId: number; newRole: UserRole }) => {
            const response = await fetch(`/api/users/changeRole/${userId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as ChangeRoleResponse;
        },
    });
}
