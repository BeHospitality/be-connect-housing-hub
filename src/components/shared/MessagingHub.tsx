import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Plus, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useAppContext } from '@/context/AppContext';
import { View } from '@/types';

interface Channel {
  id: string;
  name: string;
  channel_type: string;
  unit_id: string | null;
  created_at: string;
}

interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const MessagingHub: React.FC = () => {
  const { user } = useAuth();
  const { setActiveView, appMode } = useAppContext();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderNames, setSenderNames] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
      const channel = supabase
        .channel(`messages:${selectedChannel.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${selectedChannel.id}`,
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChannels = async () => {
    if (!user) return;
    const { data: memberships } = await supabase
      .from('channel_members')
      .select('channel_id')
      .eq('user_id', user.id);

    if (memberships && memberships.length > 0) {
      const channelIds = memberships.map(m => m.channel_id);
      const { data } = await supabase
        .from('message_channels')
        .select('*')
        .in('id', channelIds)
        .order('created_at', { ascending: false });
      if (data) setChannels(data as Channel[]);
    }
  };

  const fetchMessages = async (channelId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data as Message[]);
      // Fetch sender display names
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', senderIds);

      if (profiles) {
        const names: Record<string, string> = {};
        profiles.forEach(p => { names[p.user_id] = p.display_name || 'Unknown'; });
        setSenderNames(names);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    await supabase.from('messages').insert({
      channel_id: selectedChannel.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const backView = appMode === 'resident' ? View.RESIDENT_HOME : View.DASHBOARD;

  // Channel List View
  if (!selectedChannel) {
    return (
      <div className="animate-fade-in">
        <div className="header-gradient text-primary-foreground p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView(backView)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Messages</h1>
          </div>
        </div>

        <div className="p-4">
          {channels.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-foreground mb-2">No Conversations Yet</h3>
              <p className="text-sm text-muted-foreground">
                Channels will appear here when you're added to a unit group chat or direct message.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  className="w-full bg-card rounded-xl p-4 shadow-sm flex items-center gap-3 text-left hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ch.channel_type === 'group' ? 'bg-secondary/10' : 'bg-info/10'
                  }`}>
                    {ch.channel_type === 'group' ? (
                      <Users className="w-5 h-5 text-secondary" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-info" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{ch.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{ch.channel_type} chat</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="animate-fade-in flex flex-col h-screen">
      <div className="header-gradient text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedChannel(null)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">{selectedChannel.name}</h1>
            <p className="text-xs opacity-80 capitalize">{selectedChannel.channel_type} chat</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                isMe
                  ? 'bg-secondary text-secondary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}>
                {!isMe && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {senderNames[msg.sender_id] || 'Unknown'}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessagingHub;
