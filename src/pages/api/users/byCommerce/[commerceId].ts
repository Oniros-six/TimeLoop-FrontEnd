import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const GET: APIRoute = async ({ request, params }) => {
  try {
    logger.dev('Users info request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    })

    const backendURL = import.meta.env.PUBLIC_BACKEND_URL

    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada')
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const commerceId = params.commerceId

    if (!commerceId) {
      logger.error('commerceId no proporcionado en la URL')
      return new Response(JSON.stringify({ error: 'ID de comercio requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = await fetch(`${backendURL}/user?commerceId=${commerceId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    })

    logger.dev('Backend response:', {
      status: response.status,
      ok: response.ok
    })

    const result = await response.json()

    if (response.ok) {
      logger.dev('Users data retrieved successfully:', { commerceId })
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      logger.dev('Failed to retrieve users data')
      return new Response(JSON.stringify({
        error: 'Error al obtener datos de los usuarios',
        usersData: null
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    logger.error('Error en obtención de datos de usuarios:', error)
    return new Response(JSON.stringify({
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      usersData: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

