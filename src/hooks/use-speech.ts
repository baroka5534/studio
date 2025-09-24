'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

export const useSpeech = (
  onTranscript: (transcript: string) => void,
  onSpeechEnd: () => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'tr-TR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
          onSpeechEnd();
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
           toast({
            variant: "destructive",
            title: "Ses Tanıma Hatası",
            description: "Mikrofon izni verilmemiş veya bir hata oluştu. Lütfen kontrol edin.",
          });
          setIsListening(false);
          onSpeechEnd();
        }

        recognitionRef.current = recognition;
      } else {
         console.warn("SpeechRecognition API is not supported in this browser.");
      }
    }
  }, [onTranscript, onSpeechEnd, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition could not start.", error);
        toast({
          variant: "destructive",
          title: "Dinleme Başlatılamadı",
          description: "Lütfen tarayıcı izinlerinizi kontrol edin.",
        });
        setIsListening(false);
      }
    }
  }, [isListening, toast]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error("Speech recognition could not be stopped.", error);
      }
    }
  }, [isListening]);


  const speak = useCallback((text: string, onEnd: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';

      const voices = window.speechSynthesis.getVoices();
      const turkishVoice = voices.find(voice => voice.lang === 'tr-TR');
      if (turkishVoice) {
        utterance.voice = turkishVoice;
      } else {
        console.warn("Turkish voice not found, using default.");
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event.error);
        toast({
          variant: "destructive",
          title: "Konuşma Hatası",
          description: "Yapay zeka yanıtı seslendirilemedi.",
        });
        setIsSpeaking(false);
        onEnd();
      };
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
        console.warn("SpeechSynthesis API is not supported in this browser.");
        onEnd(); // fallback to ensure state is reset
    }
  }, [toast]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }
  }, []);

  return { isListening, isSpeaking, startListening, stopListening, speak };
};
