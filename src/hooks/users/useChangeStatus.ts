import { useMutation } from "@tanstack/react-query";

interface ChangeStatusResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useChangeStatus() {
    
    return useMutation({
        mutationFn: async ({ userId, active }: { userId: number; active: boolean }) => {
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
