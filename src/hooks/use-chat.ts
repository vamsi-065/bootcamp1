import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useChat(chatId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    // 1. Fetch existing messages
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
      setIsLoading(false);
    };

    fetchMessages();

    // 2. Subscribe to new messages
    const messageSub = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    // 3. Handle Presence (Typing Indicators)
    const presenceChannel = supabase.channel(`presence:${chatId}`, {
      config: {
        presence: {
          key: 'user',
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        // Process state to find typing users
        const typing = Object.values(state)
          .flat()
          .filter((u: any) => u.isTyping)
          .map((u: any) => u.user_id);
        setTypingUsers(typing);
      })
      .subscribe();

    return () => {
      messageSub.unsubscribe();
      presenceChannel.unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async (content: string, senderId: string, imageUrl?: string) => {
    const { error } = await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: senderId,
      content,
      image_url: imageUrl,
    });
    return { error };
  };

  const setTypingStatus = async (isTyping: boolean, userId: string) => {
    if (!chatId) return;
    const channel = supabase.channel(`presence:${chatId}`);
    await channel.track({
      user_id: userId,
      isTyping,
    });
  };

  return { messages, typingUsers, isLoading, sendMessage, setTypingStatus };
}
