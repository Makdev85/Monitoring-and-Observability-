import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  CheckCheck,
  Flame,
  X,
} from 'lucide-react';
import { NavPage, NotificationItem } from '../types/monitoring';

interface NotificationPanelProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (id: string, targetPage: NavPage) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  notifications,
  onClose,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <Flame className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-label="Notifications"
        className="fixed right-4 sm:right-6 top-[68px] z-50 w-[calc(100vw-2rem)] sm:w-96 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              ({unreadCount} unread)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800/80 max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No notifications in the current demo session.
            </div>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNotification(item.id, item.targetPage)}
                className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  !item.read ? 'bg-indigo-50/40 dark:bg-indigo-500/5' : ''
                }`}
              >
                <div className="mt-0.5">{getIcon(item.severity)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-xs sm:text-sm leading-snug ${
                        !item.read
                          ? 'font-semibold text-slate-900 dark:text-slate-100'
                          : 'font-medium text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.title}
                    </p>
                    {!item.read && (
                      <span
                        className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0"
                        title="Unread"
                      />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="mt-1.5 text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                    {item.timestamp}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};
