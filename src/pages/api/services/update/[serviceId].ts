import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const PUT: APIRoute = async ({ request, params }) => {
    try {
        logger.dev('Service update request received:', {
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

        // Obtener serviceId desde los parámetros de la URL
        const serviceId = params.serviceId
        const body = await request.json()

        if (!serviceId) {
            logger.error('serviceId no proporcionado en la URL')
            return new Response(JSON.stringify({ error: 'ID de servicio es requerido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar al backend
        const response = await fetch(`${backendURL}/service/${serviceId}`, {
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
            logger.dev('Service updated successfully:', { serviceId })
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } else {
            logger.dev('Failed to update service', { serviceId, result })
            return new Response(JSON.stringify({
                error: result.message
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    } catch (error) {
        logger.error('Error en la actualizacion del servicio:', error)
        return new Response(JSON.stringify({
            error: 'Error interno del servidor',
            message: 'Error de conexión. Verifica tu internet e intenta nuevamente.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
