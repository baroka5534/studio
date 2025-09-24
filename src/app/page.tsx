'use client';

import { Bot, FileText, BrainCircuit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatPanel } from '@/components/tokmakchat/chat-panel';
import { DocumentPanel } from '@/components/tokmakchat/document-panel';
import { TasksPanel } from '@/components/tokmakchat/tasks-panel';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-center p-4 border-b border-border/20 shadow-lg">
        <Bot className="w-8 h-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          TokmakChat
        </h1>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent p-0 border-b border-border/20">
            <TabsTrigger value="chat" className="py-4 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-card/50">
              <Bot className="mr-2 h-5 w-5" />
              Sohbet
            </TabsTrigger>
            <TabsTrigger value="documents" className="py-4 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-card/50">
              <FileText className="mr-2 h-5 w-5" />
              Belge Analizi
            </TabsTrigger>
            <TabsTrigger value="tasks" className="py-4 rounded-none text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-card/50">
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
