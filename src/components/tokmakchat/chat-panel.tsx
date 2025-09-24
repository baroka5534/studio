'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { handleMultilingualVoiceChat } from '@/app/actions';
import { AvatarStatus, RobotAvatar } from '@/components/icons/robot-avatar';
import { useSpeech } from '@/hooks/use-speech';
import { Button } from '@/components/ui/button';
import { Bot, Mic, Send, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AudioVisualizer } from './audio-visualizer';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Merhaba! Ben TokmakChat. Size nasıl yardımcı olabilirim?', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>('idle');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };
  
  const handleAiResponse = useCallback((response: string) => {
    addMessage(response, 'ai');
    speak(response, () => setAvatarStatus('idle'));
  }, []);

  const processUserQuery = async (query: string) => {
    if (!query.trim()) return;

    addMessage(query, 'user');
    setAvatarStatus('thinking');

    const response = await handleMultilingualVoiceChat({ query, language: 'tr' });
    
    if (response.success && response.data) {
      handleAiResponse(response.data.response);
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: response.error,
      });
      setAvatarStatus('idle');
    }
  };

  const { isListening, isSpeaking, startListening, speak } = useSpeech(
    (transcript) => {
      setInput(transcript);
      processUserQuery(transcript);
    },
    () => {
      if (avatarStatus === 'listening') {
        setAvatarStatus('idle');
      }
    }
  );

  useEffect(() => {
    if (isListening) setAvatarStatus('listening');
  }, [isListening]);

  useEffect(() => {
    if (isSpeaking) setAvatarStatus('speaking');
  }, [isSpeaking]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    processUserQuery(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full max-h-full w-full items-center p-4 gap-4">
      <div className="w-48 h-48 md:w-64 md:h-64">
        <RobotAvatar status={avatarStatus} />
      </div>
      <div className="w-full h-20">
         <AudioVisualizer isAnimating={isListening || isSpeaking} />
      </div>
      <div className="w-full flex-1 flex flex-col glassmorphism rounded-lg overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn('flex items-start gap-3', { 'justify-end': msg.sender === 'user' })}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg max-w-sm',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
             {avatarStatus === 'thinking' && (
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                       <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                       </div>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border/20">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Bir mesaj yazın veya mikrofona basın..."
              className="flex-1 bg-background/50"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <Button size="icon" onClick={handleSend} disabled={avatarStatus === 'thinking' || !input}>
              <Send className="w-5 h-5" />
            </Button>
            <Button size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={startListening} disabled={avatarStatus === 'thinking' || isSpeaking}>
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
