import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    logger.dev('Login request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    })

    // Verificar que el request tenga contenido
    const contentType = request.headers.get('content-type')
    logger.dev('Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Leer el body
    const body = await request.json()
    logger.dev('Login payload:', { email: body.email, passwordLength: body.password?.length })

    // Validar campos requeridos
    if (!body.email || !body.password) {
      return new Response(JSON.stringify({ 
        error: 'Email y contraseña son requeridos'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({ error: 'Formato de email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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
    const response = await fetch(`${backendURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()
    logger.dev('Backend response:', { status: response.status, hasUser: !!result.user })

    // Si el login es exitoso, establecer las cookies del backend
    if (response.ok && result.user) {
      // Copiar las cookies de la respuesta del backend
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
    logger.error('Error en login:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
