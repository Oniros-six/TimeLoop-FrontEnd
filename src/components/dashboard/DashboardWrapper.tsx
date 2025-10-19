import { useCommerce } from "@/hooks/commerce/useCommerce";
import { useUsersGlobal } from "@/hooks/users/useUsersGlobal";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  useCommerce();
  useUsersGlobal();
  
  // ========================================
  // POSIBLES UTILIDADES ADICIONALES:
  // ========================================
  
  // 1. 🚨 MANEJO DE ERRORES GLOBALES
  // - Verificar permisos del usuario
  // - Redirigir a login si no está autenticado
  // - Mostrar ErrorBoundary para errores del comercio
  // - Manejar errores de red globalmente
  
  // 2. ⏳ LOADING STATES GLOBALES
  // - Mostrar skeleton mientras cargan datos esenciales
  // - Loading spinner para operaciones críticas
  // - Estados de carga para diferentes secciones
  
  // 3. 🔔 CONFIGURACIÓN DE NOTIFICACIONES
  // - Configurar toast notifications globales
  // - Permisos de notificaciones del navegador
  // - Sonidos de notificaciones
  // - Configuración de notificaciones push
  
  // 4. 📊 ANALYTICS Y TRACKING
  // - Tracking de eventos del dashboard
  // - Métricas de uso por usuario
  // - Eventos de navegación
  // - Performance monitoring
  
  // 5. 🎨 CONFIGURACIÓN DE TEMA/IDIOMA
  // - Aplicar tema del usuario (dark/light mode)
  // - Configuración de idioma
  // - Preferencias de accesibilidad
  // - Configuración de fuentes
  
  // 6. 🔐 VERIFICACIÓN DE PERMISOS
  // - Context de permisos para componentes hijos
  // - Verificación de roles (ADMIN/EMPLOYEE)
  // - Permisos específicos por funcionalidad
  // - Guards de rutas protegidas
  
  // 7. ⌨️ SHORTCUTS DE TECLADO
  // - Ctrl+K: Búsqueda global
  // - Ctrl+N: Crear nuevo elemento
  // - Ctrl+S: Guardar cambios
  // - Escape: Cerrar modales
  
  // 8. 🌐 WEBSOCKETS Y TIEMPO REAL
  // - Conexión a websockets para updates en vivo
  // - Notificaciones de nuevas reservas
  // - Updates de estado de servicios
  // - Chat en tiempo real
  
  // 9. 🔄 SINCRONIZACIÓN DE DATOS
  // - Auto-refresh de datos críticos
  // - Sincronización offline/online
  // - Cache invalidation inteligente
  // - Conflict resolution
  
  // 10. 🎯 CONFIGURACIÓN DE USUARIO
  // - Preferencias personales
  // - Configuración de dashboard
  // - Widgets personalizables
  // - Layout preferences
  
  // 11. 🛡️ SEGURIDAD Y VALIDACIÓN
  // - Validación de sesión
  // - Timeout de sesión
  // - Detección de actividad sospechosa
  // - Logs de seguridad
  
  // 12. 📱 RESPONSIVE Y MOBILE
  // - Detección de dispositivo
  // - Configuración mobile específica
  // - Touch gestures
  // - PWA features
  
  return <>{children}</>;
}
