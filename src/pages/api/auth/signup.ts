import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    logger.dev('Signup request received:', {
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
    logger.dev('Signup payload:', { 
      email: body.email, 
      ownerName: body.ownerName,
      businessName: body.name,
      passwordLength: body.password?.length,
      billingType: body.billingType
    })

    // Validar campos requeridos
    const requiredFields = ['ownerName', 'email', 'ownerPhone', 'password', 'name', 'phone', 'address', 'businessCategory', 'schedules', 'billingType']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Campos requeridos faltantes', 
        missingFields 
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

    // Validar contraseña
    if (body.password.length < 10 || !/\d/.test(body.password) || !/[a-zA-Z]/.test(body.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(body.password)) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 10 caracteres, números, letras y símbolos' }), {
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
    const response = await fetch(`${backendURL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()
    logger.dev('Backend response:', { status: response.status, statusCode: result.statusCode })

    // Retornar la respuesta del backend
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    logger.error('Error en signup:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Por favor verifica tu internet e intenta nuevamente.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
