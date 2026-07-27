'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Heart, Send, Mic, MicOff, Plus, Trash2, Download, Pin,
  MessageSquare, AlertTriangle, Phone, Clock, Search, ChevronRight,
  Volume2, Copy, ThumbsUp, ThumbsDown, Sparkles
} from 'lucide-react';
import Header from '@/components/layout/Header';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

const SUGGESTIONS = [
  'What are the symptoms of diabetes?',
  'How can I lower my blood pressure naturally?',
  'Explain my cholesterol test results',
  'Tips for better sleep quality',
  'What is BMI and how is it calculated?',
  'நீரிழிவு அறிகுறிகள் என்ன?',
  'How to manage stress effectively?',
  'What foods are good for heart health?',
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content: `**Hello! I'm CuraAI** 👋 — your intelligent health companion powered by Google Gemini.

I can help you with:
- 🩺 **Symptom analysis** and health guidance
- 📊 **Explaining medical reports** in simple language  
- 💊 **Medicine information** and interactions
- 🧘 **Mental wellness** tips and resources
- 🚨 **Emergency guidance** when needed

I support both **English** and **தமிழ்** — just type in your preferred language!

> ⚠️ *I provide educational information only. Always consult a licensed healthcare professional for medical advice.*

How can I help you today?`,
  timestamp: new Date(),
};

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
}

export default function AIAssistantPage() {
  const { t } = useLanguage();
  const [chats, setChats] = useState([{ id: 'chat-1', title: t('chatbot.newConversation', 'New Conversation'), messages: [INITIAL_MESSAGE], timestamp: new Date() }]);
  const [activeChatId, setActiveChatId] = useState('chat-1');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const newChat = () => {
    const id = `chat-${Date.now()}`;
    setChats(prev => [{ id, title: t('chatbot.newConversation', 'New Conversation'), messages: [INITIAL_MESSAGE], timestamp: new Date() }, ...prev]);
    setActiveChatId(id);
  };

  const deleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      setActiveChatId(remaining[0]?.id || '');
    }
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');
    setLoading(true);

    const userMsg = { id: `msg-${Date.now()}`, role: 'user', content, timestamp: new Date() };
    const apiMessages = [...messages, userMsg].map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content }));

    // Update chat title from first user message
    if (messages.length === 1) {
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title: content.slice(0, 40) + (content.length > 40 ? '...' : '') } : c));
    }

    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMsg] } : c));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: data.message || data.error || 'Sorry, I encountered an error.',
        timestamp: new Date(),
        isEmergency: data.isEmergency,
      };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c));
    } catch {
      toast.error(t('aiAssistant.connectionError', 'Failed to get response. Please check your connection.'));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error(t('aiAssistant.voiceNotSupported', 'Voice input not supported in your browser.'));
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const exportChat = () => {
    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'curaai-chat.txt'; a.click();
    toast.success('Chat exported!');
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col" style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-primary)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <button onClick={newChat} className="btn btn-primary btn-sm w-full">
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="input-base text-xs py-2 pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chats.filter(c => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
              <div
                key={chat.id}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer group transition-all ${activeChatId === chat.id ? 'bg-blue-500/10' : 'hover:bg-[var(--bg-tertiary)]'}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: activeChatId === chat.id ? '#3b82f6' : 'var(--text-tertiary)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: activeChatId === chat.id ? '#3b82f6' : 'var(--text-primary)' }}>
                    {chat.title}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{formatTime(chat.timestamp)}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button onClick={exportChat} className="btn btn-ghost btn-sm w-full">
              <Download className="w-4 h-4" /> Export Chat
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.4)]">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>CuraAI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>AI Health Assistant · Powered by Gemini</p>
                </div>
              </div>
            </div>
            <span className="badge badge-blue text-[10px]">
              <Sparkles className="w-3 h-3" /> Educational Only
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.role === 'ai' ? (
                      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white fill-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        U
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Emergency Banner */}
                    {msg.isEmergency && (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-full mb-2 p-3 rounded-xl flex items-center gap-3"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.4)' }}
                      >
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-red-400">Emergency Detected</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Call 112 immediately or go to the nearest ER</p>
                        </div>
                        <a href="tel:112" className="btn btn-danger btn-sm flex-shrink-0">
                          <Phone className="w-3 h-3" /> 112
                        </a>
                      </motion.div>
                    )}

                    {/* Message Bubble */}
                    <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai prose'}>
                      {msg.role === 'ai' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{formatTime(msg.timestamp)}</span>
                      {msg.role === 'ai' && (
                        <>
                          <button onClick={() => copyMessage(msg.content)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--bg-tertiary)] transition-colors">
                            <Copy className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                          </button>
                          <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[var(--bg-tertiary)] transition-colors">
                            <ThumbsUp className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="chat-ai flex items-center gap-1.5 py-3 px-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 typing-dot" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Suggestions (only at start) */}
          {messages.length === 1 && (
            <div className="px-6 pb-3 flex gap-2 flex-wrap">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="btn btn-secondary btn-sm text-left"
                  style={{ fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="px-6 py-2 text-center">
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              🛡️ CuraAI provides educational information only — not a substitute for professional medical advice. Emergency? Call 112.
            </p>
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-card)' }}>
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask me anything about your health... (Press Enter to send, Shift+Enter for new line)"
                  rows={1}
                  className="input-base resize-none py-3 pr-12"
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                />
              </div>
              <button
                onClick={recording ? () => { recognitionRef.current?.stop(); setRecording(false); } : startVoice}
                className={`btn btn-sm ${recording ? 'btn-danger' : 'btn-secondary'} flex-shrink-0 h-12 w-12`}
                aria-label="Voice input"
              >
                {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn btn-primary btn-sm flex-shrink-0 h-12 w-12"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
