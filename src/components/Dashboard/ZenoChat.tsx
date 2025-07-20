import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { sendMessageToDeepSeek } from '../ChatBot/api';
import { Send, Plus, Settings, MessageCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  last_message_at: string;
  message_count: number;
}

const ZenoChat: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [personality, setPersonality] = useState<'friendly' | 'professional'>('friendly');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
      fetchUserSettings();
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      fetchMessages();
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserSettings = async () => {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('chat_personality')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setPersonality(data.chat_personality);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
      
      if (data && data.length > 0 && !currentSession) {
        setCurrentSession(data[0]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchMessages = async () => {
    if (!currentSession) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user?.id,
          title: 'Neuer Chat'
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessions(prev => [data, ...prev]);
      setCurrentSession(data);
      setMessages([]);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const updatePersonality = async (newPersonality: 'friendly' | 'professional') => {
    try {
      await supabase
        .from('user_settings')
        .update({ chat_personality: newPersonality })
        .eq('user_id', user?.id);

      setPersonality(newPersonality);
    } catch (error) {
      console.error('Error updating personality:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add user message to UI
      const newUserMessage = {
        id: Date.now().toString(),
        content: userMessage,
        role: 'user' as const,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newUserMessage]);

      // Save user message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user?.id,
          content: userMessage,
          role: 'user'
        });

      // Get AI response
      const systemPrompt = personality === 'friendly' 
        ? 'Du bist Zeno, ein freundlicher und einfühlsamer Begleiter für mentale Gesundheit. Antworte kurz (1-2 Sätze), warm und unterstützend. Verwende keine Formatierung wie **fett** oder _kursiv_.'
        : 'Du bist Zeno, ein professioneller Psychologe und Therapeut. Antworte kurz (1-2 Sätze), sachlich und hilfreich. Verwende keine Formatierung wie **fett** oder _kursiv_.';

      const response = await sendMessageToDeepSeek(
        userMessage,
        messages.map(m => ({ type: m.role, content: m.content })),
        {
          temperature: 0.7,
          model: 'deepseek/deepseek-r1-0528',
          maxTokens: 150,
          systemPrompt
        }
      );

      const aiResponse = response.choices[0].message.content;

      // Add AI response to UI
      const newAiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant' as const,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newAiMessage]);

      // Save AI message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user?.id,
          content: aiResponse,
          role: 'assistant'
        });

      // Update session
      await supabase
        .from('chat_sessions')
        .update({
          last_message_at: new Date().toISOString(),
          message_count: messages.length + 2,
          title: messages.length === 0 ? userMessage.slice(0, 30) + '...' : currentSession.title
        })
        .eq('id', currentSession.id);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-24 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Zeno Chat</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
          
          <button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            <span>Neuer Chat</span>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">Chat-Persönlichkeit</h3>
            <div className="space-y-2">
              <button
                onClick={() => updatePersonality('friendly')}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  personality === 'friendly' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                Freundschaftlich
              </button>
              <button
                onClick={() => updatePersonality('professional')}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  personality === 'professional' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                Professionell
              </button>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>Noch keine Chats</p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    currentSession?.id === session.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800 truncate">{session.title}</div>
                  <div className="text-sm text-gray-500">
                    {session.message_count} Nachrichten
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="font-semibold text-gray-800">{currentSession.title}</h2>
              <p className="text-sm text-gray-500">
                {personality === 'friendly' ? 'Freundschaftlicher Modus' : 'Professioneller Modus'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Hallo! Ich bin Zeno</h3>
                  <p className="text-gray-600">
                    {personality === 'friendly' 
                      ? 'Ich bin hier, um dir zu helfen und zuzuhören. Wie geht es dir heute?'
                      : 'Ich bin dein professioneller Begleiter für mentale Gesundheit. Womit kann ich dir helfen?'
                    }
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Schreibe eine Nachricht..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Wähle einen Chat</h3>
              <p className="text-gray-600">Oder erstelle einen neuen Chat, um zu beginnen.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenoChat;