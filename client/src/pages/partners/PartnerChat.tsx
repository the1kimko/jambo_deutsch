import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import api from '@/utils/api';
import { usePartnerSocket } from '@/hooks/usePartnerSocket';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/utils/storage';

interface PartnerSummary {
  id: string;
  name: string;
  location: string;
  goal: string;
  level: string;
  online: boolean;
}

interface PartnerMessage {
  id: string;
  partnerId: string;
  userId: string;
  senderType: 'user' | 'partner';
  text?: string;
  attachments?: Array<{ url?: string; type?: string; name?: string }>;
  createdAt: string;
  readAt?: string;
}

const PartnerChat: React.FC = () => {
  const { partnerId = '' } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partner, setPartner] = useState<PartnerSummary | null>(null);
  const [messages, setMessages] = useState<PartnerMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = storage.getUser<{ id?: string }>()?.id;

  const {
    connected,
    joinPartnerRoom,
    sendMessage,
    sendTyping,
    typingEvent,
    lastMessage,
  } = usePartnerSocket({ enabled: Boolean(partnerId) });

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    if (!partnerId) return;
    const fetchPartner = async () => {
      try {
        const { data } = await api.get('/partners');
        const matched = (data as PartnerSummary[]).find((p) => p.id === partnerId);
        setPartner(matched || null);
      } catch (error) {
        console.error(error);
        toast({ title: 'Unable to load partner', description: 'Please try again later.' });
      }
    };

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<PartnerMessage[]>(`/partners/${partnerId}/messages`);
        setMessages(data.reverse());
        scrollToBottom();
      } catch (error) {
        console.error(error);
        toast({ title: 'Failed to load conversation', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
    fetchMessages();
  }, [partnerId, toast, scrollToBottom]);

  useEffect(() => {
    if (!partnerId || !connected) return;
    joinPartnerRoom(partnerId);
  }, [partnerId, connected, joinPartnerRoom]);

  useEffect(() => {
    if (!typingEvent || typingEvent.partnerId !== partnerId) return;
    setTypingIndicator(typingEvent.typing);
  }, [typingEvent, partnerId]);

  useEffect(() => {
    if (!lastMessage || lastMessage.partner !== partnerId) return;
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === lastMessage._id)) return prev;
      return [...prev, {
        id: lastMessage._id,
        partnerId: lastMessage.partner,
        userId: lastMessage.user,
        senderType: lastMessage.senderType as 'user' | 'partner',
        text: lastMessage.text,
        attachments: lastMessage.attachments,
        createdAt: lastMessage.createdAt,
        readAt: lastMessage.readAt || undefined,
      }];
    });
    scrollToBottom();
  }, [lastMessage, partnerId, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !partnerId) return;
    setIsSending(true);
    setInput('');
    try {
      if (connected) {
        sendMessage(partnerId, trimmed);
      } else {
        const { data } = await api.post(`/partners/${partnerId}/messages`, { text: trimmed });
        setMessages((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Message failed', description: 'Unable to send message right now.' });
      setInput(trimmed);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    if (!partnerId) return;
    sendTyping(partnerId, true);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => sendTyping(partnerId, false), 1200);
  };

  const conversationTitle = useMemo(() => partner?.name || 'Partner chat', [partner]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        <div className="mb-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Chatting with</p>
            <h1 className="text-xl font-semibold text-foreground">{conversationTitle}</h1>
            {partner?.location && (
              <p className="text-xs text-muted-foreground">{partner.location}</p>
            )}
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden">
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-card px-4 py-6">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl bg-muted/40 p-6 text-center text-muted-foreground">
                Say hallo and start a conversation!
              </div>
            ) : (
              messages.map((message) => {
                const mine = currentUserId && message.userId?.toString() === currentUserId.toString();
                return (
                  <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        mine
                          ? 'bg-gradient-primary text-white rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      <div>{message.text}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-wide opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {typingIndicator && (
              <div className="flex justify-start">
                <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  Typing…
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-border bg-card/95 p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message…"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isSending}
                className="h-12"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isSending} className="h-12 px-4">
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerChat;
