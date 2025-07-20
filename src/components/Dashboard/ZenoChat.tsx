import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Settings, 
  X, 
  User, 
  Bot, 
  Loader2,
  RotateCcw,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { UserSettings, ChatSession, ChatMessage } from '../../types/dashboard';
import { sendMessageToDeepSeek } from '../ChatBot/api';

interface ZenoChatProps {
  profile: UserProfile;
  settings: UserSettings | null;
  chatSessions: ChatSession[];
  onCreateSession: (title: string) => Promise<ChatSession | null>;
  onAddMessage: (sessionId: string, content: string, role: 'user' | 'assistant') => Promise<void>;
  onGetMessages: (sessionId: string) => Promise<ChatMessage[]>;
  onUpdateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

const ZenoChat: React.FC<ZenoChatProps> = ({
  profile,
  settings,
  chatSessions,
  onCreateSession,
  onAddMessage,
  onGetMessages,
  onUpdateSettings
}) => {
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dailyMessageCount, setDailyMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const maxDailyMessages = profile.subscription_type === 'zenith' ? 999 : 5;

  useEffect(() => {
    if (chatSessions.length > 0 && !activeSession) {
      setActiveSession(chatSessions[0]);
    }
  }, [chatSessions, activeSession]);

  useEffect(() => {
    if (activeSession) {
      loadMessages();
    }
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!activeSession) return;
    
    const sessionMessages = await onGetMessages(activeSession.id);
    setMessages(sessionMessages);
    
    // Count today's messages
    const today = new Date().toDateString();
    const todayMessages = sessionMessages.filter(msg => 
      msg.role === 'user' && 
      new Date(msg.created_at).toDateString() === today
    );
    setDailyMessageCount(todayMessages.length);
  };

  const handleNewChat = async () => {
    const newSession = await onCreateSession('Neuer Chat');
    if (newSession) {
      setActiveSession(newSession);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !activeSession) return;
    
    if (dailyMessageCount >= maxDailyMessages) {
      alert('Tageslimit für Nachrichten erreicht. Upgrade zu Zenith für unbegrenzte Chats.');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMsgObj: ChatMessage = {
      id: Date.now().toString(),
      session_id: activeSession.id,
      user_id: profile.id,
      content: userMessage,
      role: 'user',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsgObj]);
    await onAddMessage(activeSession.id, userMessage, 'user');

    try {
      // Get AI response
      const systemPrompt = `Du bist Zeno, der persönliche KI-Wellness-Begleiter für Zenilience. Du bist ${
        settings?.chat_personality === 'professional' ? 'professionell und sachlich' : 'freundlich und unterstützend'
      }.

Über den Nutzer:
- Name: ${profile.full_name || 'Unbekannt'}
- Alter: ${profile.age || 'Unbekannt'}
- Beruf: ${profile.occupation || 'Unbekannt'}
- Interessen: ${profile.interests?.join(', ') || 'Unbekannt'}

Wichtige Richtlinien:
- Antworte IMMER auf Deutsch
- Halte Antworten kurz und prägnant (1-2 Sätze)
- Verwende keine Formatierungen wie **fett** oder *kursiv*
- Maximal 1-2 Emojis pro Nachricht
- Konzentriere dich auf mentale Gesundheit und Wohlbefinden
- Gib praktische, umsetzbare Ratschläge
- Sei empathisch und verständnisvoll

Du hilfst bei:
- Stress-Management
- Meditation und Achtsamkeit
- CBT-Techniken
- Schlafhygiene
- Emotionale Unterstützung
- Motivation und Zielsetzung`;

      const response = await sendMessageToDeepSeek(
        userMessage,
        messages,
        {
          temperature: 0.7,
          model: 'deepseek/deepseek-r1-0528',
          maxTokens: 300,
          systemPrompt
        }
      );

      const aiMessage = response.choices[0].message.content;
      
      // Add AI response
      const aiMsgObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: activeSession.id,
        user_id: profile.id,
        content: aiMessage,
        role: 'assistant',
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsgObj]);
      await onAddMessage(activeSession.id, aiMessage, 'assistant');
      
      setDailyMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsgObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: activeSession.id,
        user_id: profile.id,
        content: 'Entschuldigung, ich konnte nicht antworten. Bitte versuche es später noch einmal.',
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsgObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSendMessage = dailyMessageCount < maxDailyMessages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/zenilience_z_logo_2-removebg-preview.png" 
              alt="Zeno" 
              className="w-10 h-10 rounded-full bg-stone-100 p-2 mr-3"
            />
            <div>
              <h1 className="text-xl font-bold text-stone-800">Zeno Chat</h1>
              <p className="text-sm text-stone-600">
                Dein persönlicher Wellness-Begleiter
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleNewChat}
              className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Usage Limit */}
      {profile.subscription_type === 'explorer' && (
        <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-800">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {dailyMessageCount}/{maxDailyMessages} Nachrichten heute
              </span>
            </div>
            {!canSendMessage && (
              <div className="flex items-center text-yellow-800">
                <Lock className="w-4 h-4 mr-1" />
                <span className="text-sm">Limit erreicht</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-4 bg-white/80 border-b border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Chat-Einstellungen</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Chat-Persönlichkeit
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => onUpdateSettings({ chat_personality: 'friendly' })}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  settings?.chat_personality === 'friendly'
                    ? 'bg-stone-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Freundlich
              </button>
              <button
                onClick={() => onUpdateSettings({ chat_personality: 'professional' })}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  settings?.chat_personality === 'professional'
                    ? 'bg-stone-600 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Professionell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-stone-200 hidden sm:block">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full bg-stone-600 text-white py-2 px-4 rounded-lg hover:bg-stone-700 transition-colors flex items-center justify-center mb-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neuer Chat
            </button>
            
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSession?.id === session.id
                      ? 'bg-stone-100 text-stone-800'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-medium text-sm truncate">
                    {session.title}
                  </div>
                  <div className="text-xs text-stone-500">
                    {session.message_count} Nachrichten
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-stone-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  Hallo! Ich bin Zeno.
                </h3>
                <p className="text-stone-600">
                  Ich bin hier, um dir bei deinem Wohlbefinden zu helfen. Wie kann ich dir heute helfen?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-stone-600 text-white'
                        : 'bg-white text-stone-800 border border-stone-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <img 
                          src="/zenilience_z_logo_2-removebg-preview.png" 
                          alt="Zeno" 
                          className="w-4 h-4 mt-0.5 rounded-full"
                        />
                      )}
                      {message.role === 'user' && (
                        <User className="w-4 h-4 text-white mt-0.5" />
                      )}
                      <div className="text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-stone-800 border border-stone-200 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/zenilience_z_logo_2-removebg-preview.png" 
                      alt="Zeno" 
                      className="w-4 h-4 rounded-full"
                    />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-stone-200">
            <div className="flex items-end space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={canSendMessage ? "Schreibe Zeno eine Nachricht..." : "Tageslimit erreicht"}
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent resize-none"
                disabled={isLoading || !canSendMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim() || !canSendMessage}
                className="bg-stone-600 text-white p-3 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZenoChat;