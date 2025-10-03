import type { APIRoute } from 'astro'
import { logger } from '@/lib/logger'

export const prerender = false

export const PATCH: APIRoute = async ({ request, params }) => {
    try {
        logger.dev('Users change status request received:', {
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

        // Obtener el estado desde el body
        const body = await request.json()

        const { active } = body;

        if (!userId) {
            logger.error('userId no proporcionado en la URL')
            return new Response(JSON.stringify({ error: 'ID de usuario requerido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        let response
        if (active) {
            // Enviar al backend para activar al usuario
            response = await fetch(`${backendURL}/user/reinstate?userId=${userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Cookie': request.headers.get('cookie') || ''
                }
            })
        } else {
            // Enviar al backend para suspender el usuario
            response = await fetch(`${backendURL}/user/suspend?userId=${userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Cookie': request.headers.get('cookie') || ''
                }
            })
        }

        logger.dev('Backend response:', {
            status: response.status,
            ok: response.ok
        })

        const result = await response.json()

        if (response.ok) {
            logger.dev('User status updated successfully:', { userId })
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } else {
            logger.dev('Failed to update user status')
            return new Response(JSON.stringify({
                error: 'Error al actualizar el estado del usuario',
                usersData: null
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            })
        }

    } catch (error) {
        logger.error('Error al actualizar el estado del usuario:', error)
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
