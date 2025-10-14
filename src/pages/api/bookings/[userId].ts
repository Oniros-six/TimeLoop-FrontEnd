import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const GET: APIRoute = async ({ request, params, url }) => {
    try {
        logger.dev('Bookings request received:', {
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

        // Obtener userId desde los parámetros de la URL
        const userId = params.userId

        if (!userId) {
            logger.error('userId no proporcionado en la URL')
            return new Response(JSON.stringify({ error: 'ID de usuario requerido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Obtener parámetros de paginación
        const searchParams = new URL(url).searchParams
        const cursor = searchParams.get('cursor')
        const limit = searchParams.get('limit') || '10'

        // Construir URL del backend con parámetros de paginación
        const backendUrl = new URL(`${backendURL}/booking/user`)
        backendUrl.searchParams.set('userId', userId)
        backendUrl.searchParams.set('limit', limit)
        if (cursor) {
            backendUrl.searchParams.set('cursor', cursor)
        }

        // Enviar al backend para obtener datos
        const response = await fetch(backendUrl.toString(), {
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
            logger.dev('Bookings data retrieved successfully:', { userId })
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } else {
            logger.dev('Failed to retrieve services')
            return new Response(JSON.stringify({
                error: 'Error al obtener reservas',
                servicesData: null
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            })
        }

    } catch (error) {
        logger.error('Error en obtención de reservas:', error)
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
            servicesData: null
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
