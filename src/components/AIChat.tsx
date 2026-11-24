import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, Trash2 } from 'lucide-react';
import { SUGGESTED_AI_QUESTIONS } from '../data/mockData';
import { generateSimulatedAIResponse } from '../services/aiSimulator';
import { ChatMessageItem, ServiceName } from '../types/monitoring';
import { ChatMessage } from './ChatMessage';

interface AIChatProps {
  messages: ChatMessageItem[];
  onMessagesChange: React.Dispatch<React.SetStateAction<ChatMessageItem[]>>;
  pendingPrompt: string | null;
  onClearPendingPrompt: () => void;
  aiAnalysisEnabled: boolean;
  onInspectServiceLogs: (service: ServiceName) => void;
}

function formatNowTime(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export const AIChat: React.FC<AIChatProps> = ({
  messages,
  onMessagesChange,
  pendingPrompt,
  onClearPendingPrompt,
  aiAnalysisEnabled,
  onInspectServiceLogs,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const sendQuestion = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: formatNowTime(),
    };

    onMessagesChange((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    timerRef.current = window.setTimeout(() => {
      const simulated = aiAnalysisEnabled
        ? generateSimulatedAIResponse(trimmed)
        : {
            content:
              'Simulated AI analysis is currently paused in Settings. Enable "AI Log Analysis" in Settings to resume simulated troubleshooting.',
            referencedServices: [] as ServiceName[],
          };

      const aiMsg: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: simulated.content,
        timestamp: formatNowTime(),
        referencedServices: simulated.referencedServices,
      };

      onMessagesChange((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 550);
  };

  // Auto-send pre-filled prompt when navigated from Overview / Incidents / Services
  useEffect(() => {
    if (pendingPrompt) {
      const promptToRun = pendingPrompt;
      onClearPendingPrompt();
      sendQuestion(promptToRun);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(input);
  };

  const handleClearChat = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setIsTyping(false);
    onMessagesChange([
      {
        id: 'ai-welcome-reset',
        role: 'assistant',
        content:
          'Chat cleared. Ask me about simulated container health, critical errors, payment-service timeouts, or HTTP 500 responses.',
        timestamp: formatNowTime(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[540px] rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              LogSight AI Analyst
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulated troubleshooting assistant grounded in mock Docker container logs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear chat
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onInspectService={onInspectServiceLogs}
          />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#161E2E] border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
                Analyzing simulated logs
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.1s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions + Composer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E131F] space-y-3">
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
            Suggested troubleshooting questions (click to send):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_AI_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                disabled={isTyping}
                onClick={() => sendQuestion(question)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about container errors, timeouts, incidents, or triage priority..."
            aria-label="Ask AI Log Analyst"
            className="flex-1 h-10 px-3.5 text-sm rounded-lg bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
