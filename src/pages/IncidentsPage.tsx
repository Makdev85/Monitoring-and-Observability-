import React, { useState } from 'react';
import { IncidentCard } from '../components/IncidentCard';
import { IncidentDetailsModal } from '../components/IncidentDetailsModal';
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  LogEntry,
} from '../types/monitoring';

interface IncidentsPageProps {
  incidents: Incident[];
  logs: LogEntry[];
  onStatusChange: (incidentId: string, status: IncidentStatus) => void;
  onInvestigateWithAI: (incident: Incident) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({
  incidents,
  logs,
  onStatusChange,
  onInvestigateWithAI,
}) => {
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    return true;
  });

  const selectedIncident =
    incidents.find((inc) => inc.id === selectedIncidentId) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Incidents
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track detected container anomalies, inspect correlated logs, and escalate to LogSight AI.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="incident-severity-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Severity:
            </label>
            <select
              id="incident-severity-filter"
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value as IncidentSeverity | 'ALL')
              }
              className="h-9 px-3 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="incident-status-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Status:
            </label>
            <select
              id="incident-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as IncidentStatus | 'ALL')
              }
              className="h-9 px-3 text-xs sm:text-sm rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="p-10 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            No incidents match the selected severity and status filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSeverityFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="mt-3 px-3.5 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onOpenDetails={(inc) => setSelectedIncidentId(inc.id)}
              onInvestigateWithAI={onInvestigateWithAI}
            />
          ))}
        </div>
      )}

      <IncidentDetailsModal
        incident={selectedIncident}
        logs={logs}
        onClose={() => setSelectedIncidentId(null)}
        onStatusChange={onStatusChange}
        onInvestigateWithAI={(inc) => {
          setSelectedIncidentId(null);
          onInvestigateWithAI(inc);
        }}
      />
    </div>
  );
};
