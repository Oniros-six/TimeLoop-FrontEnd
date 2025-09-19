// Sistema de logging condicional basado en el entorno
const isDev = import.meta.env.PUBLIC_ENV === "DEV"

export const logger = {
  // Solo en desarrollo
  dev: (...args: any[]) => {
    if (isDev) {
      console.log('[DEV]', ...args)
    }
  },

  // Siempre mostrar (errores importantes)
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },

  // Solo en desarrollo (info general)
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[INFO]', ...args)
    }
  },

  // Solo en desarrollo (warnings)
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[WARN]', ...args)
    }
  }
}
