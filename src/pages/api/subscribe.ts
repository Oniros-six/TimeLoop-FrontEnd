import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    })

    // Verificar que el request tenga contenido
    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type debe ser application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Leer el body como texto primero para debugging
    const textBody = await request.text()
    console.log('Raw body:', textBody)

    if (!textBody || textBody.trim() === '') {
      return new Response(JSON.stringify({ error: 'Body vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let body
    try {
      body = JSON.parse(textBody)
      console.log('Parsed body:', body)
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      return new Response(JSON.stringify({ error: 'JSON inválido en el request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { email } = body
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email es requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Formato de email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Obtener variables de entorno del servidor
    const makeUrl = import.meta.env.MAKE_URL
    const makeApiKey = import.meta.env.MAKE_API_KEY

    if (!makeUrl || !makeApiKey) {
      console.error('Variables de entorno MAKE_URL o MAKE_API_KEY no están configuradas')
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Enviar a Make.com
    const response = await fetch(makeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-make-apikey': makeApiKey
      },
      body: JSON.stringify({ email })
    })

    if (!response.ok) {
      throw new Error(`Error de Make.com: ${response.status}`)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Suscripción exitosa' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error en suscripción:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
