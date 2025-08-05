import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { sendMessageToGemini } from '../ChatBot/geminiApi';
import { Send, Plus, Settings, MessageCircle, Lock, Menu, X } from 'lucide-react';

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

interface UserProfile {
  subscription_type: 'explorer' | 'zenith';
}

const ZenoChat: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [personality, setPersonality] = useState<'friendly' | 'professional'>('friendly');
  const [profile, setProfile] = useState<UserProfile>({ subscription_type: 'explorer' });
  const [dailyMessages, setDailyMessages] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSessions();
      fetchUserSettings();
      fetchDailyMessageCount();
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

  const fetchProfile = async () => {
    try {
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setProfile({ subscription_type: 'zenith' });
        console.log('Demo profile loaded for chat');
        return;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_type')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        console.log('Profile loaded for chat:', data.subscription_type);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDailyMessageCount = async () => {
    try {
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setDailyMessages(2); // Demo user has used 2 messages
        console.log('Demo daily messages loaded');
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id')
        .eq('user_id', user?.id)
        .eq('role', 'user')
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      if (error) {
        console.error('Error fetching daily message count:', error);
        return;
      }

      setDailyMessages(data?.length || 0);
      console.log('Daily messages used:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching daily message count:', error);
    }
  };

  const canSendMessage = () => {
    if (profile.subscription_type === 'zenith') return true;
    return dailyMessages < 5;
  };

  const fetchUserSettings = async () => {
    try {
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setPersonality('friendly');
        console.log('Demo settings loaded');
        return;
      }
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('chat_personality')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setPersonality(data.chat_personality);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      // Handle demo user with sample sessions
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        const demoSessions = [
          {
            id: 'demo-session-1',
            title: 'Getting Started with Wellness',
            last_message_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            message_count: 6
          },
          {
            id: 'demo-session-2',
            title: 'Managing Daily Stress',
            last_message_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            message_count: 4
          }
        ];
        setSessions(demoSessions);
        console.log('Demo chat sessions loaded:', demoSessions.length);
        
        if (!currentSession) {
          setCurrentSession(demoSessions[0]);
        }
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      setSessions(data || []);
      console.log('Chat sessions loaded:', data?.length || 0);
      
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
      // Handle demo user with sample messages
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        if (currentSession.id === 'demo-session-1') {
          const demoMessages = [
            {
              id: 'demo-msg-1',
              content: 'Hi Zeno! I\'m new to meditation and feeling a bit overwhelmed with stress lately.',
              role: 'user' as const,
              created_at: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 'demo-msg-2',
              content: 'Hello! I\'m so glad you\'re here. It\'s completely normal to feel overwhelmed, and you\'ve taken a wonderful first step by reaching out. Meditation can be incredibly helpful for stress. Would you like to start with a simple 5-minute breathing exercise?',
              role: 'assistant' as const,
              created_at: new Date(Date.now() - 7199000).toISOString()
            },
            {
              id: 'demo-msg-3',
              content: 'That sounds perfect. I\'ve never done meditation before though.',
              role: 'user' as const,
              created_at: new Date(Date.now() - 7198000).toISOString()
            },
            {
              id: 'demo-msg-4',
              content: 'No worries at all! Everyone starts somewhere. The beauty of meditation is that there\'s no "perfect" way to do it. I\'ll guide you through a gentle breathing exercise that\'s perfect for beginners.',
              role: 'assistant' as const,
              created_at: new Date(Date.now() - 7197000).toISOString()
            }
          ];
          setMessages(demoMessages);
          console.log('Demo messages loaded for session 1');
        } else {
          setMessages([]);
        }
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
      console.log('Messages loaded for session:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createNewSession = async () => {
    try {
      console.log('Creating new chat session...');
      
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        const newDemoSession = {
          id: `demo-session-${Date.now()}`,
          title: 'New Chat',
          last_message_at: new Date().toISOString(),
          message_count: 0
        };
        setSessions(prev => [newDemoSession, ...prev]);
        setCurrentSession(newDemoSession);
        setMessages([]);
        setShowSidebar(false);
        console.log('Demo session created');
        return;
      }
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user?.id,
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return;
      }

      console.log('New session created:', data.id);
      setSessions(prev => [data, ...prev]);
      setCurrentSession(data);
      setMessages([]);
      setShowSidebar(false);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const updatePersonality = async (newPersonality: 'friendly' | 'professional') => {
    try {
      // Handle demo user
      if (user?.id === 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        setPersonality(newPersonality);
        console.log('Demo personality updated to:', newPersonality);
        return;
      }
      
      const { error } = await supabase
        .from('user_settings')
        .update({ chat_personality: newPersonality })
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating personality:', error);
        return;
      }

      setPersonality(newPersonality);
      console.log('Personality updated to:', newPersonality);
    } catch (error) {
      console.error('Error updating personality:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession || isLoading || !canSendMessage()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message:', userMessage);

      // Add user message to UI
      const newUserMessage = {
        id: Date.now().toString(),
        content: userMessage,
        role: 'user' as const,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newUserMessage]);

      // Handle demo user - don't save to database
      if (user?.id !== 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        // Save user message to database
        const { error: userMessageError } = await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSession.id,
            user_id: user?.id,
            content: userMessage,
            role: 'user'
          });

        if (userMessageError) {
          console.error('Error saving user message:', userMessageError);
        }
      }

      // Get AI response
      const systemPrompt = personality === 'friendly' 
        ? 'You are Zeno, a friendly and empathetic mental health companion for Zenilience. Respond warmly and supportively in 1-2 sentences. Focus on wellness, mindfulness, and emotional support. Use no formatting like **bold** or _italic_.'
        : 'You are Zeno, a professional psychologist and therapist for Zenilience. Respond professionally and helpfully in 1-2 sentences. Provide evidence-based mental health guidance. Use no formatting like **bold** or _italic_.';

      const response = await sendMessageToGemini(
        userMessage,
        messages.map(m => ({ type: m.role, content: m.content })),
        {
          temperature: 0.7,
          model: 'gemini-2.0-flash-exp',
          maxTokens: 150,
          systemPrompt
        }

      const aiResponse = response.candidates[0].content.parts[0].text;
      console.log('AI response received');

      // Add AI response to UI
      const newAiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant' as const,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newAiMessage]);

      // Handle demo user - don't save to database
      if (user?.id !== 'demo-user-id-12345678-1234-1234-1234-123456789012') {
        // Save AI message to database
        const { error: aiMessageError } = await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSession.id,
            user_id: user?.id,
            content: aiResponse,
            role: 'assistant'
          });

        if (aiMessageError) {
          console.error('Error saving AI message:', aiMessageError);
        }

        // Update session
        const { error: sessionError } = await supabase
          .from('chat_sessions')
          .update({
            last_message_at: new Date().toISOString(),
            message_count: messages.length + 2,
            title: messages.length === 0 ? userMessage.slice(0, 30) + '...' : currentSession.title
          })
          .eq('id', currentSession.id);

        if (sessionError) {
          console.error('Error updating session:', sessionError);
        }
      }

      // Update daily message count
      setDailyMessages(prev => prev + 1);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to UI
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: 'assistant' as const,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-24 flex relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
        w-80 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Zeno Chat</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Subscription Info */}
        {profile.subscription_type === 'explorer' && (
          <div className="p-4 border-b border-gray-200 bg-yellow-50">
            <div className="flex items-center">
              <Lock className="w-4 h-4 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium text-sm">Explorer Plan</p>
                <p className="text-yellow-700 text-xs">
                  {dailyMessages}/5 daily messages used
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">Chat Personality</h3>
            <div className="space-y-2">
              <button
                onClick={() => updatePersonality('friendly')}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  personality === 'friendly' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Friendly</div>
                <div className="text-xs text-gray-600">Warm and empathetic responses</div>
              </button>
              <button
                onClick={() => updatePersonality('professional')}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  personality === 'professional' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">Professional</div>
                <div className="text-xs text-gray-600">Clinical and evidence-based guidance</div>
              </button>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>No chats yet</p>
              <p className="text-sm">Start a conversation with Zeno!</p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setCurrentSession(session);
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    currentSession?.id === session.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800 truncate">{session.title}</div>
                  <div className="text-sm text-gray-500">
                    {session.message_count} messages
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden mr-3"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="font-semibold text-gray-800">{currentSession.title}</h2>
                <p className="text-sm text-gray-500">
                  {personality === 'friendly' ? 'Friendly & Empathetic' : 'Professional & Clinical'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Hello! I'm Zeno</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {personality === 'friendly' 
                      ? 'I\'m here to support you on your wellness journey. How are you feeling today?'
                      : 'I\'m your professional mental health companion. How can I help you achieve better mental wellness today?'
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
              {!canSendMessage() && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    You've reached your daily limit of 5 messages. Upgrade to Zenith for unlimited chat!
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={canSendMessage() ? "Ask Zeno anything about wellness..." : "Daily limit reached"}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={isLoading || !canSendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim() || !canSendMessage()}
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
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden mb-4"
              >
                <Menu size={24} />
              </button>
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Zeno Chat</h3>
              <p className="text-gray-600 mb-4">Select a chat or create a new one to get started.</p>
              <button
                onClick={createNewSession}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-2 px-6 hover:shadow-lg transition-all duration-300"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZenoChat;