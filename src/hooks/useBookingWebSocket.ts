// hooks/useBookingWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '@/lib/logger';

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectedEventData {
  commerceId: number;
}

//! Corregir esto luego
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

export interface UseBookingWebSocketOptions {
  /** ID del comercio (requerido) */
  commerceId: number | undefined;
  /** URL del backend. Si no se proporciona, se construye desde PUBLIC_BACKEND_URL */
  url?: string;
  /** Habilitar reconexión automática (default: true) */
  reconnect?: boolean;
  /** Intervalo de reconexión en ms (default: 1000) */
  reconnectDelay?: number;
  /** Número máximo de intentos de reconexión (default: 5) */
  maxReconnectAttempts?: number;
  /** Callback cuando se conecta exitosamente */
  onConnected?: (data: ConnectedEventData) => void;
  /** Callback cuando se recibe actualización de disponibilidad */
  onAvailabilityUpdate?: (event: AvailabilityUpdateEventData) => void;
  /** Callback cuando hay un error */
  onError?: (error: WebSocketErrorData) => void;
  /** Callback cuando se desconecta */
  onDisconnect?: (reason: string) => void;
  /** Habilitar/deshabilitar la conexión (default: true) */
  enabled?: boolean;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useBookingWebSocket = (options: UseBookingWebSocketOptions) => {
  const {
    commerceId,
    url,
    reconnect = true,
    reconnectDelay = 1000,
    maxReconnectAttempts = 5,
    onConnected,
    onAvailabilityUpdate,
    onError,
    onDisconnect,
    enabled = true,
  } = options;

  // Estados
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<AvailabilityUpdateEventData | null>(null);
  const [error, setError] = useState<WebSocketErrorData | null>(null);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const enabledRef = useRef(enabled);
  const callbacksRef = useRef({
    onConnected,
    onAvailabilityUpdate,
    onError,
    onDisconnect,
  });

  // Actualizar refs cuando cambian
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    callbacksRef.current = {
      onConnected,
      onAvailabilityUpdate,
      onError,
      onDisconnect,
    };
  }, [onConnected, onAvailabilityUpdate, onError, onDisconnect]);

  // Construir URL del WebSocket
  const getWebSocketUrl = useCallback((): string | null => {
    if (url) {
      return url;
    }

    const backendURL = import.meta.env.PUBLIC_BACKEND_URL;
    if (!backendURL) {
      logger.error('PUBLIC_BACKEND_URL no está configurada');
      return null;
    }

    return backendURL;
  }, [url]);

  // Conectar Socket.IO
  const connect = useCallback(() => {
    if (!enabledRef.current || !commerceId) {
      return;
    }

    const baseUrl = getWebSocketUrl();
    if (!baseUrl) {
      setStatus('error');
      setError({ message: 'WebSocket URL no configurada' });
      return;
    }

    // Cerrar conexión existente si hay una
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    try {
      setStatus('connecting');
      logger.dev('Conectando a Socket.IO:', `${baseUrl}/bookings`);

      const socket = io(`${baseUrl}/bookings`, {
        query: {
          commerceId: String(commerceId),
        },
        reconnection: reconnect,
        reconnectionDelay: reconnectDelay,
        reconnectionAttempts: maxReconnectAttempts,
      });

      socketRef.current = socket;

      // Evento: Conexión exitosa (después de validación)
      socket.on('connected', (data: ConnectedEventData) => {
        console.log('🔌 [WebSocket] Conectado:', data);
        logger.dev('Socket.IO conectado al comercio:', data.commerceId);
        setStatus('connected');
        setError(null);
        callbacksRef.current.onConnected?.(data);
      });

      // Evento: Actualización de disponibilidad
      socket.on('availabilityUpdated', (event: AvailabilityUpdateEventData) => {
        console.log('📡 [WebSocket] Actualización de disponibilidad:', event);
        logger.dev('Actualización de disponibilidad recibida:', event);
        setLastUpdate(event);
        callbacksRef.current.onAvailabilityUpdate?.(event);
      });

      // Evento: Error
      socket.on('error', (errorData: WebSocketErrorData) => {
        console.error('❌ [WebSocket] Error:', errorData);
        logger.error('Error en Socket.IO:', errorData.message);
        setStatus('error');
        setError(errorData);
        callbacksRef.current.onError?.(errorData);
      });

      // Evento: Desconexión
      socket.on('disconnect', (reason: string) => {
        console.log('🔌 [WebSocket] Desconectado:', reason);
        logger.dev('Socket.IO desconectado:', reason);
        setStatus('disconnected');
        callbacksRef.current.onDisconnect?.(reason);
      });

      // Evento nativo: Conexión establecida (antes de validación)
      socket.on('connect', () => {
        console.log('🔌 [WebSocket] Conexión establecida (validando...)');
        logger.dev('Socket.IO conectado (validando...)');
      });

    } catch (err) {
      logger.error('Error al crear Socket.IO:', err);
      setStatus('error');
      setError({ message: err instanceof Error ? err.message : 'Error desconocido' });
    }
  }, [commerceId, getWebSocketUrl, reconnect, reconnectDelay, maxReconnectAttempts]);

  // Desconectar Socket.IO
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  // Efecto principal: conectar/desconectar según enabled
  useEffect(() => {
    if (enabled && commerceId) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup al desmontar o cuando cambia enabled/commerceId
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, commerceId]);

  return {
    status,
    lastUpdate,
    error,
    connect,
    disconnect,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
  };
};