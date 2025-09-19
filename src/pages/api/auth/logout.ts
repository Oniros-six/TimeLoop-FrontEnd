import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    logger.dev('Logout request received:', {
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

    // Enviar al backend
    const response = await fetch(`${backendURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    const result = await response.json()
    logger.dev('Backend response:', { status: response.status, success: response.ok })

    // Si el logout es exitoso, establecer las cookies del backend
    if (response.ok) {
      // Copiar las cookies de la respuesta del backend (para limpiar cookies de sesión)
      const setCookieHeader = response.headers.get('set-cookie')
      if (setCookieHeader) {
        return new Response(JSON.stringify(result), {
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            'Set-Cookie': setCookieHeader
          }
        })
      }
    }

    // Retornar la respuesta del backend
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    logger.error('Error en logout:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
