
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = (
  onTranscript: (transcript: string) => void,
  onSpeechEnd: () => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

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

        recognitionRef.current = recognition;
      }
    }
  }, [onTranscript, onSpeechEnd]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition could not start.", error);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const speak = useCallback((text: string, onEnd: () => void) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';

      // Find a Turkish voice
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
      
      // Ensure other utterances are cancelled
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Pre-load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      }
    }
  }, []);

  return { isListening, isSpeaking, startListening, speak };
};
