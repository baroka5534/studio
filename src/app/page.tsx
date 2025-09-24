'use client';

import { Bot, FileText, BrainCircuit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatPanel } from '@/components/tokmakchat/chat-panel';
import { DocumentPanel } from '@/components/tokmakchat/document-panel';
import { TasksPanel } from '@/components/tokmakchat/tasks-panel';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center p-4 border-b border-border/20 bg-card/80">
        <Bot className="w-6 h-6 mr-3 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">
          TokmakChat
        </h1>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent p-0 border-b border-border/20">
            <TabsTrigger value="chat" className="py-3 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
              <Bot className="mr-2 h-5 w-5" />
              Sohbet
            </TabsTrigger>
            <TabsTrigger value="documents" className="py-3 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
              <FileText className="mr-2 h-5 w-5" />
              Belge Analizi
            </TabsTrigger>
            <TabsTrigger value="tasks" className="py-3 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent">
              <BrainCircuit className="mr-2 h-5 w-5" />
              Akıllı Görevler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 overflow-auto mt-0">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="documents" className="flex-1 overflow-auto mt-0">
            <DocumentPanel />
          </TabsContent>
          <TabsContent value="tasks" className="flex-1 overflow-auto mt-0">
            <TasksPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

    