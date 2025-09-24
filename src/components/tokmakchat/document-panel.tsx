'use client';

import { useState } from 'react';
import { handleDocumentAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, FileCheck, AlertCircle, FileQuestion } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AvatarStatus, RobotAvatar } from '../icons/robot-avatar';

interface AnalysisResult {
  abstractSummary: string;
  concreteSummary: string;
}

export function DocumentPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>('idle');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (['application/pdf', 'image/jpeg', 'text/html'].includes(file.type)) {
        setSelectedFile(file);
        setFileName(file.name);
        setResult(null);
        setAvatarStatus('idle');
      } else {
        toast({
          variant: "destructive",
          title: "Geçersiz Dosya Türü",
          description: "Lütfen bir PDF, JPG veya HTML dosyası seçin.",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "Dosya Seçilmedi",
        description: "Lütfen analiz etmek için bir dosya seçin.",
      });
      return;
    }

    setIsLoading(true);
    setAvatarStatus('analyzing');
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const documentDataUri = reader.result as string;
      const response = await handleDocumentAnalysis({ documentDataUri });

      if (response.success && response.data) {
        setResult(response.data);
        setAvatarStatus('speaking');
      } else {
        toast({
          variant: "destructive",
          title: "Analiz Başarısız",
          description: response.error,
        });
        setAvatarStatus('idle');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Dosya Okuma Hatası",
        description: "Dosya okunurken bir hata oluştu.",
      });
      setIsLoading(false);
      setAvatarStatus('idle');
    };
  };

  return (
    <div className="p-4 md:p-8 h-full flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div className="flex flex-col items-center justify-center">
                 <div className="w-64 h-64">
                    <RobotAvatar status={avatarStatus} />
                 </div>
                 <p className="mt-4 text-muted-foreground text-sm">
                    {
                        avatarStatus === 'idle' ? 'Analiz için bir dosya bekliyorum.' :
                        avatarStatus === 'analyzing' ? 'Belgeyi analiz ediyorum...' :
                        avatarStatus === 'speaking' ? 'İşte sonuçlar!' :
                        '...'
                    }
                 </p>
            </div>
            <Card className="glassmorphism h-full flex flex-col max-h-[70vh]">
                <CardHeader>
                    <CardTitle>Belge Analizi</CardTitle>
                    <CardDescription>PDF, JPG veya HTML dosyalarınızı yükleyerek özetler oluşturun.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label htmlFor="file-upload" className="flex-1 w-full">
                            <Input id="file-upload" type="file" accept=".pdf,.jpg,.jpeg,.html" onChange={handleFileChange} className="hidden" />
                            <Button asChild variant="outline" className="w-full cursor-pointer">
                               <div>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    {fileName || 'Dosya Seç'}
                               </div>
                            </Button>
                        </label>
                        <Button onClick={handleAnalyze} disabled={isLoading || !selectedFile} className="w-full sm:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Analiz Et
                        </Button>
                    </div>
                    
                    <div className="flex-1 overflow-auto relative border border-border/30 rounded-md p-4 bg-background/20">
                    {isLoading && (
                      <div className="absolute inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    {result && (
                      <ScrollArea className="h-full pr-4">
                      <div className="space-y-6 text-sm">
                        <div>
                          <h3 className="text-lg font-semibold text-primary mb-2">Soyut Özet</h3>
                          <p className="text-muted-foreground leading-relaxed selection:bg-primary/20">{result.abstractSummary}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-accent mb-2">Somut Özet</h3>
                          <p className="text-muted-foreground leading-relaxed selection:bg-accent/20">{result.concreteSummary}</p>
                        </div>
                      </div>
                      </ScrollArea>
                    )}
                     {!isLoading && !result && (
                        <div className="flex flex-col justify-center items-center h-full text-center text-muted-foreground">
                            {selectedFile ? (
                                <>
                                    <FileCheck className="w-12 h-12 mb-4 text-green-500"/>
                                    <p className='font-semibold'>{fileName}</p>
                                    <p>Dosya analize hazır.</p>
                                </>
                            ) : (
                                <>
                                    <FileQuestion className="w-12 h-12 mb-4" />
                                    <p>Analiz sonuçları burada görünecektir.</p>
                                </>
                            )}
                        </div>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
