import { useMutation } from "@tanstack/react-query";
import { UserRole } from "@/interfaces/User";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";

interface ChangeRoleResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useChangeRol() {
    const [currentUser] = useAtom(userAtom);
    
    return useMutation({
        mutationFn: async ({ userId, newRole }: { userId: number; newRole: UserRole }) => {
            
            // Validación: No permitir que un usuario cambie su propio rol
            if (currentUser && currentUser.id === userId) {
                throw new Error("No puedes cambiar tu propio rol");
            }
            
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
