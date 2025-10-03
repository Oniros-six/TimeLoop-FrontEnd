import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/auth";

interface ChangeStatusResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useChangeStatus() {
    const [currentUser] = useAtom(userAtom);
    
    return useMutation({
        mutationFn: async ({ userId, active }: { userId: number; active: boolean }) => {
            
            // Validación: No permitir que un usuario se suspenda a sí mismo
            if (currentUser && currentUser.id === userId && !active) {
                throw new Error("No puedes suspenderte a ti mismo");
            }
            
            //? Active == true, significa reactivar el usuario, false significa suspenderlo
            const response = await fetch(`/api/users/changeStatus/${userId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as ChangeStatusResponse;
        },
    });
}
