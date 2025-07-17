import React from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, Mic, MicOff } from 'lucide-react';
import { useStore } from '../store';
import type { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function Chat() {
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const chatMessages = useStore((state) => state.chatMessages);
  const addChatMessage = useStore((state) => state.addChatMessage);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasWelcomed = React.useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  React.useEffect(() => {
    if (chatMessages.length === 0 && !hasWelcomed.current) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: "Hello! I'm your AI medical assistant. I can help you with health questions, symptom analysis, and general medical guidance. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      addChatMessage(welcomeMessage);
      hasWelcomed.current = true;
    }
  }, [chatMessages.length, addChatMessage]);

  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Use BACKEND_URL for your own backend chat API calls if needed

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      // Call OpenRouter API (Llama 3 model)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct',
          messages: [{ role: 'user', content: input }]
        })
      });
      const data = await response.json();
      let botText = 'Sorry, I could not generate a response.';
      if (data.choices && data.choices[0]?.message?.content) {
        botText = data.choices[0].message.content;
      }
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      addChatMessage(botMessage);
    } catch (err) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error connecting to the chatbot API.',
        sender: 'bot',
        timestamp: new Date(),
      };
      addChatMessage(botMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    // @ts-ignore
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const quickQuestions = [
    "What are the symptoms of flu?",
    "How to manage stress?",
    "Healthy diet tips",
    "Exercise recommendations",
    "Sleep hygiene advice"
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="h-[calc(100vh-2rem)] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced Header */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              Medical AI Assistant
              <Sparkles className="w-5 h-5 ml-2 text-yellow-500" />
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isTyping ? 'AI is typing...' : 'Online • Ready to help'}
            </p>
          </div>
        </div>
      </div>
      </motion.div>

      {/* Messages Area */}
      <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatMessages.map((message) => (
            <motion.div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              variants={itemVariants}
              transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm break-words whitespace-pre-wrap max-w-full ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                  }`}
                  style={{
                    maxWidth: '600px',
                    fontSize: message.sender === 'bot' ? '1.05rem' : undefined,
                    lineHeight: message.sender === 'bot' ? '1.7' : undefined,
                    padding: message.sender === 'bot' ? '1.1rem 1.3rem' : undefined,
                  }}
                >
                  {message.sender === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }: { children?: ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }: { children?: ReactNode }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,
                        ol: ({ children }: { children?: ReactNode }) => <ol className="list-decimal pl-6 mb-2">{children}</ol>,
                        li: ({ children }: { children?: ReactNode }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
                        a: ({ href, children }: { href?: string; children?: ReactNode }) => <a href={href} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">{children}</a>,
                        code: ({ children }: { children?: ReactNode }) => <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                        pre: ({ children }: { children?: ReactNode }) => <pre className="bg-gray-200 dark:bg-gray-800 p-3 rounded mb-2 overflow-x-auto text-sm font-mono">{children}</pre>,
                        blockquote: ({ children }: { children?: ReactNode }) => <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300 mb-2">{children}</blockquote>,
                        br: () => <br />,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            </motion.div>
        ))}
        
        {isTyping && (
            <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
          <div className="flex justify-start animate-slide-up">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Enhanced Input Area */}
      <motion.form onSubmit={handleSend} className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl" variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question here..."
              className="input-enhanced pr-12 resize-none"
              disabled={isTyping}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isTyping || isListening}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
        </p>
      </motion.form>
      {/* Quick Questions (moved below input) */}
      {chatMessages.length <= 1 && (
        <motion.div variants={itemVariants} transition={{ type: 'spring', stiffness: 80, damping: 16 }}>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
    </div>
        </motion.div>
      )}
    </motion.div>
  );
}