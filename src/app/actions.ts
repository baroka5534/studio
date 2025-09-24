'use server';

import { analyzeDocuments, AnalyzeDocumentsInput } from '@/ai/flows/analyze-documents';
import { intelligentTaskAutomation, IntelligentTaskAutomationInput } from '@/ai/flows/intelligent-task-automation';
import { multilingualVoiceChat, MultilingualVoiceChatInput } from '@/ai/flows/multilingual-voice-chat';

export async function handleDocumentAnalysis(input: AnalyzeDocumentsInput) {
  try {
    const result = await analyzeDocuments(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in document analysis:', error);
    return { success: false, error: 'Failed to analyze document.' };
  }
}

export async function handleMultilingualVoiceChat(input: MultilingualVoiceChatInput) {
  try {
    const result = await multilingualVoiceChat(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in voice chat:', error);
    return { success: false, error: 'Failed to get a response.' };
  }
}

export async function handleIntelligentTaskAutomation(input: IntelligentTaskAutomationInput) {
  try {
    const result = await intelligentTaskAutomation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in task automation:', error);
    return { success: false, error: 'Failed to get automated tasks.' };
  }
}
