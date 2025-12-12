import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useBookingWebSocket } from '@/hooks/useBookingWebSocket';
import { logger } from '@/lib/logger';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

export interface TimeSlot {
  start: string; // ISO 8601 string: "2025-07-08T10:00:00.000Z"
  end: string; // ISO 8601 string: "2025-07-08T10:30:00.000Z"
}

// Slot formateado para mostrar en la UI
export interface FormattedSlot {
  start: string; // ISO 8601
  end: string; // ISO 8601
  time: string; // Formato legible: "HH:mm"
  available: boolean; // Siempre true porque solo se devuelven los disponibles
}

// Tipos para eventos WebSocket
export interface ConnectedEventData {
  commerceId: number;
}

export interface AvailabilityUpdateEventData {
  bookingId: number;
  status: 'HOLD' | 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'NO_SHOW' | 'COMPLETED' | 'RESCHEDULED';
  timeStart: string; // ISO 8601 string
  timeEnd: string; // ISO 8601 string
  employeeId: number;
  commerceId: number;
}

export interface WebSocketErrorData {
  message: string;
}

interface UseBookingAvailabilityOptions {
  commerceId: string | number | undefined;
  userId: string | number | undefined;
  date: Date | null;
  services: (string | number)[]; // Array de IDs de servicios
  enabled?: boolean;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useBookingAvailability({
  commerceId,
  userId,
  date,
  services,
  enabled = true,
}: UseBookingAvailabilityOptions) {
  // Estados
  const [slots, setSlots] = useState<FormattedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  // Refs para evitar llamadas duplicadas
  const lastParamsRef = useRef<string | null>(null);
  const userIdNum = useMemo(() => {
    if (!userId) return null;
    return typeof userId === 'string' ? parseInt(userId, 10) : userId;
  }, [userId]);

  // Formatear fecha a ISO string para la API
  const formatDateForAPI = useCallback((date: Date): string => {
    return date.toISOString();
  }, []);

  // Formatear slot del backend a formato de UI
  const formatSlot = useCallback((slot: TimeSlot): FormattedSlot => {
    const startDate = new Date(slot.start);
    const hours = String(startDate.getUTCHours()).padStart(2, '0');
    const minutes = String(startDate.getUTCMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    return {
      start: slot.start,
      end: slot.end,
      time,
      available: true,
    };
  }, []);

  // Memorizar string de services para comparación estable
  const servicesKey = useMemo(() => {
    if (!services || services.length === 0) return '';
    return [...services].sort().join(',');
  }, [services]);

  // Función para obtener disponibilidad inicial vía REST
  const fetchInitialAvailability = useCallback(async () => {
    if (!commerceId || !userIdNum || !date || !services || services.length === 0) {
      setSlots([]);
      return;
    }

    const dateISO = formatDateForAPI(date);
    
    // Evitar llamadas duplicadas
    const cacheKey = `${dateISO}-${commerceId}-${userIdNum}-${servicesKey}`;
    if (lastParamsRef.current === cacheKey) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        commerceId: String(commerceId),
        userId: String(userIdNum),
        date: dateISO,
        services: services.map(s => String(s)).join(','),
      });

      const backendURL = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000';
      const response = await fetch(`${backendURL}/booking/availability?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('🌐 [Frontend] Respuesta de disponibilidad del backend:', result);
      
      if (result.statusCode === 200 && Array.isArray(result.data)) {
        const formattedSlots = result.data.map((slot: TimeSlot) => formatSlot(slot));
        console.log('✅ [Frontend] Slots formateados:', formattedSlots);
        setSlots(formattedSlots);
        lastParamsRef.current = cacheKey;
        logger.dev('Disponibilidad inicial cargada:', formattedSlots.length, 'slots');
      } else {
        console.warn('⚠️ [Frontend] Respuesta inesperada:', result);
        setSlots([]);
      }
    } catch (err) {
      logger.error('Error al obtener disponibilidad inicial:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar disponibilidad');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [commerceId, userIdNum, date, servicesKey, formatDateForAPI, formatSlot]);

  // Manejar actualizaciones de disponibilidad desde WebSocket
  const handleAvailabilityUpdate = useCallback((event: AvailabilityUpdateEventData) => {
    logger.dev('Actualización de disponibilidad recibida:', event);

    // Solo procesar eventos del usuario y fecha que estamos viendo
    if (event.employeeId !== userIdNum) {
      return; // Ignorar eventos de otros empleados
    }

    const eventStart = new Date(event.timeStart);
    const eventEnd = new Date(event.timeEnd);
    const currentDate = date ? new Date(date) : null;

    // Verificar que el evento sea del mismo día
    if (currentDate && (
      eventStart.getUTCDate() !== currentDate.getUTCDate() ||
      eventStart.getUTCMonth() !== currentDate.getUTCMonth() ||
      eventStart.getUTCFullYear() !== currentDate.getUTCFullYear()
    )) {
      return; // Ignorar eventos de otros días
    }

    setSlots((prevSlots) => {
      const updatedSlots = [...prevSlots];

      if (event.status === 'CANCELED') {
        // El slot está disponible nuevamente
        // Verificar si el slot ya existe
        const exists = updatedSlots.some(slot => {
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);
          return (
            slotStart.getTime() === eventStart.getTime() &&
            slotEnd.getTime() === eventEnd.getTime()
          );
        });

        if (!exists) {
          // Agregar el slot disponible
          const newSlot = formatSlot({
            start: event.timeStart,
            end: event.timeEnd,
          });
          updatedSlots.push(newSlot);
          // Ordenar por hora de inicio
          updatedSlots.sort((a, b) => 
            new Date(a.start).getTime() - new Date(b.start).getTime()
          );
        }
      } else if (['HOLD', 'PENDING', 'CONFIRMED'].includes(event.status)) {
        // El slot está ocupado, removerlo
        return updatedSlots.filter(slot => {
          const slotStart = new Date(slot.start);
          const slotEnd = new Date(slot.end);
          
          // Remover si hay solapamiento
          return !(
            slotStart < eventEnd && 
            eventStart < slotEnd
          );
        });
      }

      return updatedSlots;
    });
  }, [userIdNum, date, formatSlot]);

  // Callbacks memorizados para WebSocket
  const handleWebSocketConnected = useCallback((data: ConnectedEventData) => {
    logger.dev('WebSocket conectado al comercio:', data.commerceId);
    setWsStatus('connected');
  }, []);

  const handleWebSocketError = useCallback((err: WebSocketErrorData) => {
    logger.error('Error en WebSocket:', err.message);
    setWsStatus('error');
  }, []);

  const handleWebSocketDisconnect = useCallback((reason: string) => {
    logger.dev('WebSocket desconectado:', reason);
    setWsStatus('disconnected');
  }, []);

  // Hook de WebSocket (usando Socket.IO)
  const {
    status: wsConnectionStatus,
    isConnected: wsConnected,
    lastUpdate,
  } = useBookingWebSocket({
    commerceId: typeof commerceId === 'string' ? parseInt(commerceId, 10) : commerceId,
    enabled: enabled && !!commerceId && !!userIdNum && !!date,
    onConnected: handleWebSocketConnected,
    onAvailabilityUpdate: handleAvailabilityUpdate,
    onError: handleWebSocketError,
    onDisconnect: handleWebSocketDisconnect,
  });

  // Actualizar estado del WebSocket
  useEffect(() => {
    setWsStatus(wsConnectionStatus);
  }, [wsConnectionStatus]);

  // Efecto: Cargar disponibilidad inicial cuando cambian los parámetros
  useEffect(() => {
    if (enabled && commerceId && userIdNum && date && services && services.length > 0) {
      fetchInitialAvailability();
    } else {
      setSlots([]);
      lastParamsRef.current = null;
    }
  }, [enabled, commerceId, userIdNum, date, servicesKey, fetchInitialAvailability]);

  // Función para actualizar manualmente un slot (útil para optimismo)
  const updateSlot = useCallback((start: string, available: boolean) => {
    setSlots((prevSlots) => {
      const slotIndex = prevSlots.findIndex((slot) => slot.start === start);
      if (slotIndex >= 0) {
        const newSlots = [...prevSlots];
        newSlots[slotIndex] = { ...newSlots[slotIndex], available };
        return newSlots;
      }
      return prevSlots;
    });
  }, []);

  return {
    slots,
    loading,
    error,
    wsStatus,
    wsConnected,
    refetch: fetchInitialAvailability,
    updateSlot,
  };
}