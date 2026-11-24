import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal } from 'lucide-react';
import { LogEntry } from '../types/monitoring';
import { LogLevelBadge } from './StatusBadges';

interface LogTableProps {
  logs: LogEntry[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const LogTable: React.FC<LogTableProps> = ({
  logs,
  isLoading = false,
  emptyMessage = 'No log entries match your current filters.',
  onResetFilters,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-9 rounded-md bg-slate-100 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-10 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 text-center">
        <Terminal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {emptyMessage}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Adjust the search query, service filter, severity level, or time range.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0E131F]">
              <th className="py-2.5 pl-4 pr-2 w-8" aria-label="Expand row" />
              <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Timestamp
              </th>
              <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Service
              </th>
              <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Level
              </th>
              <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs sm:text-[13px]">
            {logs.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-2.5 pl-4 pr-2 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {log.service}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <LogLevelBadge level={log.level} />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-200 break-words">
                      {log.message}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50/70 dark:bg-[#0B0F17]/70">
                      <td colSpan={5} className="px-10 py-3">
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                          <span>
                            container_id:{' '}
                            <strong className="text-slate-900 dark:text-slate-200">
                              {log.containerId}
                            </strong>
                          </span>
                          <span>
                            trace_id:{' '}
                            <strong className="text-slate-900 dark:text-slate-200">
                              {log.traceId}
                            </strong>
                          </span>
                          <span>
                            host:{' '}
                            <strong className="text-slate-900 dark:text-slate-200">
                              {log.host}
                            </strong>
                          </span>
                        </div>
                        {log.metadata && (
                          <pre className="mt-2 p-2.5 rounded-lg bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
