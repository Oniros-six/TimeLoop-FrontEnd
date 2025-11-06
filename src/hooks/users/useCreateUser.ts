import { useMutation } from '@tanstack/react-query';
import { UserRole } from '@/interfaces/User';

interface CreateUserData {
  commerceId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

interface CreateUserResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    commerceId: number;
  };
}

const createUser = async (userData: CreateUserData): Promise<CreateUserResponse> => {
  const response = await fetch('/api/users/createUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el usuario');
  }

  return response.json();
};

export const useCreateUser = () => {
  return useMutation<CreateUserResponse, Error, CreateUserData>({
    mutationFn: createUser,
  });
};
