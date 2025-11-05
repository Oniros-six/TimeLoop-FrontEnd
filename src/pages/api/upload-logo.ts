import type { APIRoute } from 'astro';
import { logger } from '@/lib/logger';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    logger.dev('Upload logo request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Obtener URL del backend
    const backendURL = import.meta.env.PUBLIC_BACKEND_URL;

    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada');
      return new Response(JSON.stringify({ error: 'Configuración del servidor incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener el FormData del request
    const formData = await request.formData();
    const logo = formData.get('file');
    if (!logo || !(logo instanceof File)) {
      logger.error('No se proporcionó un archivo válido');
      return new Response(JSON.stringify({ error: 'Archivo de logo requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validaciones del archivo
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(logo.type)) {
      logger.error('Tipo de archivo no permitido:', logo.type);
      return new Response(JSON.stringify({ 
        error: 'Solo se permiten imágenes JPG, PNG o WEBP' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (logo.size > maxSize) {
      logger.error('Archivo demasiado grande:', logo.size);
      return new Response(JSON.stringify({ 
        error: 'La imagen no puede pesar más de 1MB' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const backendFormData = new FormData();
    backendFormData.append('file', logo);

    const response = await fetch(`${backendURL}/commerce/upload-logo`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      },
      body: backendFormData
    });

    logger.dev('Backend response:', { 
      status: response.status, 
      ok: response.ok 
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      logger.error('Error parsing JSON response:', jsonError);
      return new Response(JSON.stringify({
        error: 'Error al procesar respuesta del servidor'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (response.ok) {
      logger.dev('Logo uploaded successfully');
      return new Response(JSON.stringify({
        success: true,
        message: 'Logo guardado exitosamente',
        logoUrl: result.logoUrl
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      logger.dev('Failed to upload logo');
      return new Response(JSON.stringify({ 
        error: result.message || result.error || 'Error al subir el logo',
        success: false
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    logger.error('Error en subida de logo:', error);
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      message: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

