import React from 'react';
import { AIChat } from '../components/AIChat';
import { ChatMessageItem, ServiceName } from '../types/monitoring';

interface AIAnalystPageProps {
  messages: ChatMessageItem[];
  onMessagesChange: React.Dispatch<React.SetStateAction<ChatMessageItem[]>>;
  pendingPrompt: string | null;
  onClearPendingPrompt: () => void;
  aiAnalysisEnabled: boolean;
  onInspectServiceLogs: (service: ServiceName) => void;
}

export const AIAnalystPage: React.FC<AIAnalystPageProps> = ({
  messages,
  onMessagesChange,
  pendingPrompt,
  onClearPendingPrompt,
  aiAnalysisEnabled,
  onInspectServiceLogs,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          AI Log Analyst
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Conversational troubleshooting assistant powered by local mock log correlation (simulated responses only).
        </p>
      </div>

      <AIChat
        messages={messages}
        onMessagesChange={onMessagesChange}
        pendingPrompt={pendingPrompt}
        onClearPendingPrompt={onClearPendingPrompt}
        aiAnalysisEnabled={aiAnalysisEnabled}
        onInspectServiceLogs={onInspectServiceLogs}
      />
    </div>
  );
};
