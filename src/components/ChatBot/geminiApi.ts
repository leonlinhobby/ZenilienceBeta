import { ChatMessage, ChatSettings, GeminiResponse } from './types';

const GEMINI_API_KEY = 'AIzaSyAYN5aoXyC77yKzE19Zv2i-plUWa7vAX9A';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export const sendMessageToGemini = async (
  message: string,
  conversationHistory: ChatMessage[],
  settings: ChatSettings
): Promise<GeminiResponse> => {
  try {
    // Prepare conversation history for Gemini API
    const contents = [
      {
        role: 'user',
        parts: [{ text: settings.systemPrompt }]
      },
      // Add conversation history (last 10 messages to avoid token limit)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
        topP: 0.8,
        topK: 10
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response:', data);
      return {
        candidates: [{
          content: {
            parts: [{ text: 'I apologize, but I encountered an issue processing your request. Please try again.' }]
          }
        }],
        usageMetadata: {
          promptTokenCount: 0,
          candidatesTokenCount: 0,
          totalTokenCount: 0
        }
      };
    }

    return {
      candidates: [{
        content: {
          parts: [{ text: data.candidates[0].content.parts[0].text }]
        }
      }],
      usageMetadata: data.usageMetadata || {
        promptTokenCount: 0,
        candidatesTokenCount: 0,
        totalTokenCount: 0
      }
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};