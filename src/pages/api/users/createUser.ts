import type { APIRoute } from 'astro';
import { logger } from '@/lib/logger';
import { UserRole } from '@/interfaces/User';

interface CreateUserRequest {
  commerceId: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const backendURL = import.meta.env.PUBLIC_BACKEND_URL;
    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada');
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Leer body tal cual llega y validarlo mínimamente antes de proxy
    const body: CreateUserRequest = await request.json();
    const { commerceId, name, email, password, role } = body;

    if (!commerceId || !name || !email || !password || !role) {
      return new Response(JSON.stringify({
        error: 'Faltan campos requeridos: commerceId, name, email, password, role'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Proxy al backend
    const backendResponse = await fetch(`${backendURL}/user`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({ commerceId, name, email, password, role })
    });

    const result = await backendResponse.json().catch(() => ({}));

    if (backendResponse.ok) {
      logger.dev('Usuario creado exitosamente en backend');
      return new Response(JSON.stringify(result), {
        status: backendResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.dev('Fallo al crear usuario en backend', { status: backendResponse.status });
    return new Response(JSON.stringify(result), {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Error en proxy de creación de usuario:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
