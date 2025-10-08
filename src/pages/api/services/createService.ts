import type { APIRoute } from 'astro';
import { logger } from '@/lib/logger';

interface CreateServiceRequest {
  id: number;
  commerceId: number;
  userId: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
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
    const body: CreateServiceRequest = await request.json();
    const { commerceId, userId, name, description, price, durationMinutes } = body;

    if (!commerceId || !userId || !name || !description || !price || !durationMinutes) {
      return new Response(JSON.stringify({
        error: 'Falta al menos uno de los siguientes campos requeridos: commerceId, userId, name, description, price, durationMinutes'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Proxy al backend
    const backendResponse = await fetch(`${backendURL}/service`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({ commerceId, userId, name, description, price, durationMinutes })
    });

    const result = await backendResponse.json().catch(() => ({}));

    if (backendResponse.ok) {
      logger.dev('servicio creado exitosamente en backend');
      return new Response(JSON.stringify(result), {
        status: backendResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    logger.dev('Fallo al crear servicio en backend', { status: backendResponse.status });
    return new Response(JSON.stringify(result), {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Error en proxy de creación de servicio:', error);

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
