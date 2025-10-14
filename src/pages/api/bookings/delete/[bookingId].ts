import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const PATCH: APIRoute = async ({ request, params }) => {
    try {
        logger.dev('Booking cancelation request received:', {
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

        // Obtener bookingId desde los parámetros de la URL
        const bookingId = params.bookingId
        const body = await request.json()
        if (!bookingId) {
            logger.error('bookingId no proporcionado en la URL')
            return new Response(JSON.stringify({ error: 'ID de la reserva es requerido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar al backend
        const response = await fetch(`${backendURL}/booking/${bookingId}`, {
            method: 'PATCH',
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
            logger.dev('Booking canceled successfully:', { bookingId })
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } else {
            logger.dev('Failed to cancel booking')
            return new Response(JSON.stringify({
                error: 'Error al cancelar la reserva'
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            })
        }

    } catch (error) {
        logger.error('Error en la cancelacion de la reserva:', error)
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
