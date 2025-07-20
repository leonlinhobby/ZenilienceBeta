import { ChatMessage, ChatSettings } from './types';

const CHAT_HISTORY_KEY = 'zenilience_chat_history';
const CHAT_SETTINGS_KEY = 'zenilience_chat_settings';

export const getChatHistory = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const saveChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const getChatSettings = (): ChatSettings | null => {
  try {
    const stored = localStorage.getItem(CHAT_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading chat settings:', error);
    return null;
  }
};

export const saveChatSettings = (settings: ChatSettings): void => {
  try {
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving chat settings:', error);
  }
};

export const clearChatData = (): void => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    localStorage.removeItem(CHAT_SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing chat data:', error);
  }
};