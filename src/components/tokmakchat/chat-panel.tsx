'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { handleMultilingualVoiceChat } from '@/app/actions';
import { AvatarStatus, RobotAvatar } from '@/components/icons/robot-avatar';
import { useSpeech } from '@/hooks/use-speech';
import { Button } from '@/components/ui/button';
import { Bot, Mic, Send, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AudioVisualizer } from './audio-visualizer';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>('idle');
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const processUserQuery = async (query: string) => {
    if (!query.trim()) return;

    addMessage(query, 'user');
    setInput('');
    setAvatarStatus('thinking');

    const response = await handleMultilingualVoiceChat({ query, language: 'tr' });
    
    if (response.success && response.data) {
      addMessage(response.data.response, 'ai');
      setAvatarStatus('idle');
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: response.error,
      });
      addMessage("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.", 'ai');
      setAvatarStatus('idle');
    }
  };

  const handleSend = () => {
    processUserQuery(input);
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center p-4 gap-4 bg-background">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        
        <div 
          className="w-full aspect-video md:aspect-[2/1] max-w-2xl bg-card/60 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          {imagePreview ? (
            <img src={imagePreview} alt="Yüklenen görsel" className="object-contain h-full w-full rounded-lg" />
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="mx-auto h-16 w-16" />
              <p>Bir resim yüklemek için tıklayın</p>
            </div>
          )}
        </div>

        <Textarea
          placeholder="Mesajınızı buraya yazın..."
          className="w-full bg-card/60 border-border text-base min-h-[100px] resize-none"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        
        <div className="w-full flex items-center justify-between gap-4">
          <Button variant="destructive" size="lg" onClick={handleSend} disabled={avatarStatus === 'thinking' || !input}>
            Sohbete başla
          </Button>
          <div className="flex-grow flex items-center gap-4">
            <Progress value={33} className="w-full h-2" />
            <Progress value={66} className="w-full h-2" />
          </div>
        </div>

      </div>
    </div>
  );
}

    