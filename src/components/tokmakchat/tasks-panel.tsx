'use client';

import { useEffect, useState } from 'react';
import { handleIntelligentTaskAutomation } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface AnticipatedTask {
  taskDescription: string;
  reasoning: string;
}

export function TasksPanel() {
  const [tasks, setTasks] = useState<AnticipatedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const userProfile = "A software developer interested in AI and productivity, with a meeting scheduled for later today.";
      const currentDateTime = new Date().toISOString();
      const response = await handleIntelligentTaskAutomation({ userProfile, currentDateTime });

      if (response.success && response.data) {
        setTasks(response.data.anticipatedTasks);
      } else {
        toast({
          variant: 'destructive',
          title: 'Görevler Alınamadı',
          description: response.error,
        });
      }
      setIsLoading(false);
    };

    fetchTasks();
  }, [toast]);

  return (
    <div className="p-4 md:p-8 h-full">
      <Card className="glassmorphism h-full flex flex-col">
        <CardHeader>
          <CardTitle>Akıllı Görev Otomasyonu</CardTitle>
          <CardDescription>Yapay zeka, ihtiyaçlarınızı tahmin ederek görevler önerir.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length > 0 ? (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg bg-background/30">
                  <h3 className="font-semibold text-primary mb-1">{task.taskDescription}</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-accent">Neden:</span> {task.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
            <div className="flex flex-col justify-center items-center h-full text-center text-muted-foreground">
                <BrainCircuit className="w-12 h-12 mb-4" />
                <p>Şu anda önerilecek proaktif bir görev bulunamadı.</p>
            </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
