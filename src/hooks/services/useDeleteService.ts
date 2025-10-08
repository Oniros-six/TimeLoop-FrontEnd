import { useMutation } from "@tanstack/react-query";

interface DeleteResponse {
    statusCode: number;
    data?: any;
    error?: string;
}

export function useDeleteService() {

    return useMutation({
        mutationFn: async ({ serviceId }: { serviceId: number}) => {

            const response = await fetch(`/api/services/delete/${serviceId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}`);
            }

            return (await response.json()) as DeleteResponse;
        },
    });
}
