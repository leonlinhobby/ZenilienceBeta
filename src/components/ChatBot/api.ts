import { ChatMessage, ChatSettings, DeepSeekResponse } from './types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const sendMessageToDeepSeek = async (
  message: string,
  conversationHistory: ChatMessage[],
  settings: ChatSettings
): Promise<DeepSeekResponse> => {
  try {
    // Prepare conversation history for API
    const messages = [
      {
        role: 'system',
        content: settings.systemPrompt
      },
      // Add conversation history (last 10 messages to avoid token limit)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://zenilience.site',
        'X-Title': 'Zenilience'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528',
        messages: messages,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};