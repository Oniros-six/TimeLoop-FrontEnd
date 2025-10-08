import { useMutation } from "@tanstack/react-query";
import type { IService } from "@/interfaces/Service";
import { userAtom } from "@/atoms/auth";
import { useAtom } from "jotai";

interface Response {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useUpdateService() {
    const [currentUser] = useAtom(userAtom);

    return useMutation({
        mutationFn: async ({ serviceId, data }: { serviceId: number; data: IService | null }) => {
            const updatedData = { ...data, commerceId: currentUser?.commerceId }
            const response = await fetch(`/api/services/update/${serviceId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as Response;
        },
    });
}
