import { useMutation } from '@tanstack/react-query';
import type { IService } from '@/interfaces/Service'

interface CreateServiceResponse {
    success: boolean;
    message: string;
    service?: IService;
}

const createService = async (serviceData: IService): Promise<CreateServiceResponse> => {
    const response = await fetch('/api/services/createService', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el servicio');
    }

    return response.json();
};

export const useCreateService = () => {
    return useMutation<CreateServiceResponse, Error, IService>({
        mutationFn: createService,
    });
};
