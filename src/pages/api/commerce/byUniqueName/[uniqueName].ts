import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const GET: APIRoute = async ({ request, params }) => {
  try {
    logger.dev('Commerce info request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    })

    // Obtener URL del backend
    const backendURL = import.meta.env.PUBLIC_BACKEND_URL

    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada')
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Obtener commerceId desde los parámetros de la URL
    const commerceName = params.uniqueName

    if (!commerceName) {
      logger.error('commerceName no proporcionado en la URL')
      return new Response(JSON.stringify({ error: 'Nombre único de comercio requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Enviar al backend para obtener datos del comercio
    const response = await fetch(`${backendURL}/commerce/find-by-name/${commerceName}`, {
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
      logger.dev('Commerce data retrieved successfully:', { commerceName })
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      logger.dev('Failed to retrieve commerce data by unique name')
      return new Response(JSON.stringify({ 
        error: 'Error al obtener datos del comercio por nombre único',
        commerceData: null
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    logger.error('Error en obtención de datos del comercio por nombre único:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      commerceData: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
