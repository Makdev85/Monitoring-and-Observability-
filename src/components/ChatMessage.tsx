import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessageItem, ServiceName } from '../types/monitoring';

interface ChatMessageProps {
  message: ChatMessageItem;
  onInspectService?: (service: ServiceName) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onInspectService,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
          isUser
            ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            : 'bg-indigo-600 border-indigo-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">
            {isUser ? 'You' : 'LogSight AI Analyst'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{message.timestamp}</span>
        </div>

        <div
          className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 dark:bg-[#161E2E] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.referencedServices && message.referencedServices.length > 0 && onInspectService && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              View logs:
            </span>
            {message.referencedServices.map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => onInspectService(svc)}
                className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {svc}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
