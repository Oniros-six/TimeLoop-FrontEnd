import type { APIRoute } from 'astro';
import { logger } from '@/lib/logger';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  try {
    logger.dev('Availability request received:', {
      method: request.method,
      url: request.url,
    });

    // Obtener URL del backend
    const backendURL = import.meta.env.PUBLIC_BACKEND_URL;

    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada');
      return new Response(
        JSON.stringify({ error: 'Configuración del servidor incompleta' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Obtener parámetros de la URL
    const searchParams = new URL(url).searchParams;
    const commerceId = searchParams.get('commerceId');
    const userId = searchParams.get('userId');
    const date = searchParams.get('date'); // Puede ser YYYY-MM-DD o ISO 8601
    const services = searchParams.get('services'); // Array de IDs separados por coma

    // Validar parámetros requeridos
    if (!commerceId || !userId || !date || !services) {
      logger.error('Parámetros requeridos faltantes');
      return new Response(
        JSON.stringify({
          error: 'commerceId, userId, date y services son requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar que commerceId y userId sean números
    const commerceIdNum = Number(commerceId);
    const userIdNum = Number(userId);

    if (isNaN(commerceIdNum) || isNaN(userIdNum)) {
      return new Response(
        JSON.stringify({
          error: 'commerceId y userId deben ser números válidos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar y parsear servicios
    const servicesArray = services
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (servicesArray.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Debe especificar al menos un servicio',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar que todos los servicios sean números
    const servicesNums = servicesArray.map((s) => Number(s));
    if (servicesNums.some((s) => isNaN(s))) {
      return new Response(
        JSON.stringify({
          error: 'Todos los servicios deben ser números válidos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Convertir fecha a ISO 8601 si viene como YYYY-MM-DD
    let dateISO: string;
    try {
      // Si ya es ISO 8601, usarlo directamente
      if (date.includes('T')) {
        dateISO = new Date(date).toISOString();
      } else {
        // Si es YYYY-MM-DD, convertirlo a ISO 8601
        // El backend espera ISO 8601, pero acepta cualquier formato de fecha válido
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Fecha inválida');
        }
        dateISO = dateObj.toISOString();
      }
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'Formato de fecha inválido. Use YYYY-MM-DD o ISO 8601',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Construir URL del backend
    const backendUrl = new URL(`${backendURL}/booking/availability`);
    backendUrl.searchParams.set('commerceId', String(commerceIdNum));
    backendUrl.searchParams.set('userId', String(userIdNum));
    backendUrl.searchParams.set('date', dateISO);

    // Agregar servicios como múltiples query params (NestJS los convierte a array)
    servicesNums.forEach((serviceId) => {
      backendUrl.searchParams.append('services', String(serviceId));
    });

    logger.dev('Proxying to backend:', {
      url: backendUrl.toString(),
      commerceId: commerceIdNum,
      userId: userIdNum,
      date: dateISO,
      services: servicesNums,
    });

    // Enviar al backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    logger.dev('Backend availability response:', {
      status: response.status,
      ok: response.ok,
    });

    const result = await response.json();
    console.log('🌐 [Backend API] Respuesta del backend:', result);

    if (response.ok) {
      logger.dev('Availability data retrieved successfully');
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ [Backend API] Error en respuesta:', result);
      logger.error('Failed to retrieve availability data:', result);
      return new Response(
        JSON.stringify({
          error: result.message || 'Error al obtener disponibilidad',
          statusCode: result.statusCode || response.status,
          data: result.data || null,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    logger.error('Error en obtención de disponibilidad:', error);
    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        message:
          error instanceof Error
            ? error.message
            : 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        data: null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};