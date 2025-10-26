import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const GET: APIRoute = async ({ request, params }) => {
  try {
    logger.dev('Commerce config request received:', {
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
    const commerceId = params.commerceId

    if (!commerceId) {
      logger.error('commerceId no proporcionado en la URL')
      return new Response(JSON.stringify({ error: 'ID de comercio requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Enviar al backend para obtener configuración del comercio
    const response = await fetch(`${backendURL}/commerce-config/${commerceId}`, {
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
      logger.dev('Commerce config data retrieved successfully:', { commerceId })
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      logger.dev('Failed to retrieve commerce config data')
      return new Response(JSON.stringify({ 
        error: 'Error al obtener configuración del comercio',
        configData: null
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    logger.error('Error en obtención de configuración del comercio:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      configData: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    logger.dev('Commerce config update request received:', {
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
    const commerceId = params.commerceId
    const body = await request.json()

    if (!commerceId) {
      logger.error('commerceId no proporcionado en la URL')
      return new Response(JSON.stringify({ error: 'ID de comercio requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Enviar al backend para actualizar configuración del comercio
    const response = await fetch(`${backendURL}/commerce-config/${commerceId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify(body)
    })

    logger.dev('Backend response:', { 
      status: response.status, 
      ok: response.ok 
    })

    let result
    try {
      result = await response.json()
    } catch (jsonError) {
      logger.error('Error parsing JSON response:', jsonError)
      return new Response(JSON.stringify({
        error: 'Error al procesar respuesta del servidor'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (response.ok) {
      logger.dev('Commerce config updated successfully:', { commerceId })
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      logger.dev('Failed to update commerce config data')
      return new Response(JSON.stringify({ 
        error: result.message || 'Error al actualizar configuración del comercio',
        configData: null
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    logger.error('Error en actualización de configuración del comercio:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      configData: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}