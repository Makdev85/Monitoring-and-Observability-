import React from 'react';
import { Bot, Eye, Layers, Server } from 'lucide-react';
import { Incident } from '../types/monitoring';
import { IncidentSeverityBadge, IncidentStatusBadge } from './StatusBadges';

interface IncidentCardProps {
  incident: Incident;
  onOpenDetails: (incident: Incident) => void;
  onInvestigateWithAI: (incident: Incident) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onOpenDetails,
  onInvestigateWithAI,
}) => {
  return (
    <article className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {incident.id}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <IncidentSeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
          </div>
        </div>

        <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
          {incident.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {incident.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            {incident.service}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {incident.occurrences} occurrences
          </span>
          <span className="font-mono tabular-nums">
            Last seen {incident.lastSeen.split(' ')[1]}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpenDetails(incident)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          Open Details
        </button>

        <button
          type="button"
          onClick={() => onInvestigateWithAI(incident)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap"
        >
          <Bot className="w-3.5 h-3.5" />
          Investigate with AI
        </button>
      </div>
    </article>
  );
};
