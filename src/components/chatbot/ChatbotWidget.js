'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, X, Send, AlertTriangle, Phone, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

const WELCOME = {
  id: 'w',
  role: 'ai',
  content: "Hi! I'm **CuraAI** 👋 — your AI health assistant.\n\nAsk me anything about your health, or [open the full chat](/ai-assistant) for more features.",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;
    setInput('');
    setLoading(true);

    const userMsg = { id: `u${Date.now()}`, role: 'user', content };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMsgs.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: `a${Date.now()}`, role: 'ai', content: data.message, isEmergency: data.isEmergency }]);
    } catch {
      setMessages(prev => [...prev, { id: `e${Date.now()}`, role: 'ai', content: 'Sorry, I had an issue connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const hasEmergency = messages.some(m => m.isEmergency);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.5)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.7)] transition-shadow"
            aria-label="Open CuraAI chat"
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <MessageSquare className="w-6 h-6 text-white" />
            </motion.div>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'rgba(59,130,246,0.4)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              maxHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0e7490)', borderColor: 'transparent' }}>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">CuraAI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-blue-100">AI Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/ai-assistant" className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" title="Full chat">
                  <Minimize2 className="w-3.5 h-3.5 text-white" />
                </Link>
                <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Emergency Banner */}
            {hasEmergency && (
              <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs font-medium text-red-400 flex-1">Emergency detected — Call 112</p>
                <a href="tel:112" className="btn btn-danger btn-sm py-1 px-2 text-xs">
                  <Phone className="w-3 h-3" /> 112
                </a>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 'chat-user text-sm' : 'chat-ai prose text-sm'} style={{ maxWidth: '85%' }}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                  <div className="chat-ai flex items-center gap-1 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] px-4 py-1.5" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-primary)' }}>
              Educational info only — not medical advice
            </p>

            {/* Input */}
            <div className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--border-primary)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about your health..."
                className="input-base text-sm py-2.5 flex-1"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="btn btn-primary btn-sm flex-shrink-0 w-10 h-10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
