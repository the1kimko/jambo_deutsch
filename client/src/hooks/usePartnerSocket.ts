import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

const DEFAULT_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5001');

type PartnerMessagePayload = {
  _id: string;
  partner: string;
  user: string;
  senderType: string;
  text?: string;
  attachments?: Array<{ url?: string; type?: string; name?: string }>;
  createdAt: string;
  readAt?: string | null;
};

type PresencePayload = {
  partnerId: string;
  userId: string;
  online: boolean;
};

type TypingPayload = {
  partnerId: string;
  userId: string;
  typing: boolean;
};

type ReadReceiptPayload = {
  partnerId: string;
  userId: string;
  messageIds: string[];
  readAt: string;
};

interface UsePartnerSocketOptions {
  enabled?: boolean;
}

export const usePartnerSocket = ({ enabled = true }: UsePartnerSocketOptions = {}) => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState<PartnerMessagePayload | null>(null);
  const [typingEvent, setTypingEvent] = useState<TypingPayload | null>(null);
  const [presenceEvent, setPresenceEvent] = useState<PresencePayload | null>(null);
  const [readReceiptEvent, setReadReceiptEvent] = useState<ReadReceiptPayload | null>(null);

  useEffect(() => {
    if (!token || !enabled) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = io(DEFAULT_SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('partner:message', (payload: PartnerMessagePayload) => setIncomingMessage(payload));
    socket.on('partner:typing', (payload: TypingPayload) => setTypingEvent(payload));
    socket.on('partner:presence', (payload: PresencePayload) => setPresenceEvent(payload));
    socket.on('partner:read', (payload: ReadReceiptPayload) => setReadReceiptEvent(payload));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, enabled]);

  const emit = useCallback((event: string, payload: unknown) => {
    if (!socketRef.current || !connected) return;
    socketRef.current.emit(event, payload);
  }, [connected]);

  const joinPartnerRoom = useCallback(
    (partnerId: string) => emit('partner:join', { partnerId }),
    [emit]
  );

  const sendTyping = useCallback(
    (partnerId: string, typing: boolean) => emit('partner:typing', { partnerId, typing }),
    [emit]
  );

  const sendMessage = useCallback(
    (partnerId: string, text?: string, attachments: Array<{ url?: string; type?: string; name?: string }> = []) => {
      emit('partner:message', { partnerId, text, attachments });
    },
    [emit]
  );

  const markAsRead = useCallback(
    (partnerId: string, messageIds: string[]) => {
      if (!messageIds.length) return;
      emit('partner:read', { partnerId, messageIds });
    },
    [emit]
  );

  return {
    socket: socketRef.current,
    connected,
    lastMessage: incomingMessage,
    typingEvent,
    presenceEvent,
    readReceiptEvent,
    joinPartnerRoom,
    sendTyping,
    sendMessage,
    markAsRead,
  };
};

export default usePartnerSocket;
