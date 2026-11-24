import React, { useEffect } from 'react';
import { Bot, Clock, Server, X } from 'lucide-react';
import { Incident, IncidentStatus, LogEntry } from '../types/monitoring';
import { LogTable } from './LogTable';
import { IncidentSeverityBadge, IncidentStatusBadge } from './StatusBadges';

interface IncidentDetailsModalProps {
  incident: Incident | null;
  logs: LogEntry[];
  onClose: () => void;
  onStatusChange: (incidentId: string, status: IncidentStatus) => void;
  onInvestigateWithAI: (incident: Incident) => void;
}

export const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({
  incident,
  logs,
  onClose,
  onStatusChange,
  onInvestigateWithAI,
}) => {
  useEffect(() => {
    if (!incident) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [incident, onClose]);

  if (!incident) return null;

  const associatedLogs = logs.filter(
    (log) =>
      incident.relatedLogIds.includes(log.id) || log.service === incident.service
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incident-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {incident.id}
              </span>
              <IncidentSeverityBadge severity={incident.severity} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <h2
              id="incident-modal-title"
              className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              {incident.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close incident details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Affected Service</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-mono font-medium text-slate-900 dark:text-slate-100">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                {incident.service}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Occurrences</p>
              <p className="mt-1 text-sm font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {incident.occurrences}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">First / Last Seen</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {incident.detectedAt.split(' ')[1]} — {incident.lastSeen.split(' ')[1]}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Description
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {incident.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Simulated Impact
              </h3>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {incident.impact}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Associated Mock Logs ({associatedLogs.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click a row to inspect container metadata
              </span>
            </div>
            <LogTable logs={associatedLogs} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E131F] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="incident-status-select"
              className="text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Update status:
            </label>
            <select
              id="incident-status-select"
              value={incident.status}
              onChange={(e) =>
                onStatusChange(incident.id, e.target.value as IncidentStatus)
              }
              className="h-8 px-2.5 text-xs font-medium rounded-lg bg-white dark:bg-[#161E2E] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onInvestigateWithAI(incident)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              Investigate with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
