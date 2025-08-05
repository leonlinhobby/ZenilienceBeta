import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Settings, Send, Loader2, Bot, User, RotateCcw } from 'lucide-react';
import { ChatMessage, ChatSettings, DeepSeekResponse } from './types';
import { getChatHistory, saveChatHistory, getChatSettings, saveChatSettings } from './storage';
import { sendMessageToGemini } from './geminiApi';
import { ZENILIENCE_CONTEXT } from './context';
import SettingsPanel from './SettingsPanel';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    temperature: 0.7,
    model: 'gemini-2.0-flash-exp',
    maxTokens: 1000,
    systemPrompt: `You are Zeno, a helpful wellness assistant for Zenilience. ${ZENILIENCE_CONTEXT}`
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = getChatHistory();
    const savedSettings = getChatSettings();
    
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Welcome message
      setMessages([{
        id: Date.now().toString(),
        type: 'bot',
        content: "Hi! I'm ZenoHelp, your personal assistant for Zenilience. I can help you with questions about our AI-powered mental wellness platform. How can I assist you today?",
        timestamp: new Date()
      }]);
    }
    
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    saveChatSettings(settings);
  }, [settings]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(
        input.trim(), 
        messages.slice(-10), // Only send last 10 messages to avoid token limits
        settings
      );
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      type: 'bot',
      content: "Hi! I'm ZenoHelp, your personal assistant for Zenilience. I can help you with questions about our AI-powered mental wellness platform. How can I assist you today?",
      timestamp: new Date()
    }]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowSettings(false);
  };

  return (
    <>
      {/* Chat Window */}
      <div className={`fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 z-50 transition-all duration-300 ease-in-out ${
  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
}`}>
        {/* Mobile: Full screen on small devices, Card on larger screens */}
        <div className="
    bg-white rounded-2xl shadow-2xl border-stone-200 border
    w-full           /* auf Handys volle Breite */
    sm:w-80          /* bei ≥640px: 320px */
    md:w-[400px]     /* bei ≥768px: 400px */
    lg:w-[500px]     /* bei ≥1024px: 500px */
    h-[60vh]         /* 60% Viewport-Höhe */
    sm:h-[70vh]      /* ≥640px */
    md:h-[500px]     /* ≥768px: 500px */
    flex flex-col overflow-hidden
  ">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-600 to-stone-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/zenilience_z_logo_2-removebg-preview.png" 
                alt="Zenilience Logo" 
                className="w-8 h-8 rounded-full bg-white/20 p-1"
              />
              <div>
                <h3 className="text-white font-semibold text-sm">ZenoHelp</h3>
                <p className="text-stone-200 text-xs">Your Zenilience Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={clearChat}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              onClose={() => setShowSettings(false)}
            />
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-stone-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-stone-600 text-white'
                    : 'bg-white text-stone-800 border border-stone-200'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <img 
                        src="/zenilience_z_logo_2-removebg-preview.png" 
                        alt="ZenoHelp" 
                        className="w-4 h-4 mt-0.5 flex-shrink-0 rounded-full"
                      />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-stone-800 border border-stone-200 rounded-2xl px-3 sm:px-4 py-2 max-w-[85%] sm:max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/zenilience_z_logo_2-removebg-preview.png" 
                      alt="ZenoHelp" 
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
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
            <div className="flex items-end space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Zenilience..."
                className="flex-1 px-3 py-2 sm:py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm resize-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-stone-600 text-white p-2 sm:p-2.5 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Chat Toggle Button – nur wenn Chat geschlossen */}
        {!isOpen && (
          <div className="fixed bottom-4 right-4 z-40 p-2">
            <button
              onClick={toggleChat}
              className="
                relative
                bg-gradient-to-r from-stone-600 to-stone-700
                text-white p-3 sm:p-4
                rounded-full
                shadow-lg hover:shadow-xl
                transition-all duration-300
                transform hover:scale-110
              "
            >
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              {/* Puls hinter dem Icon */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-stone-500"></span>
            </button>
          </div>
        )}
    </>
  );
};

export default ChatBot;