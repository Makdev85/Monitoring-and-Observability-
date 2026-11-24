import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Info,
  Search,
  ShieldAlert,
} from 'lucide-react';
import {
  IncidentSeverity,
  IncidentStatus,
  LogLevel,
  ServiceStatus,
} from '../types/monitoring';

export const LogLevelBadge: React.FC<{ level: LogLevel }> = ({ level }) => {
  const styles: Record<LogLevel, string> = {
    INFO: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    WARNING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    ERROR: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    CRITICAL: 'bg-rose-600/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  };

  const icons: Record<LogLevel, React.ReactNode> = {
    INFO: <Info className="w-3 h-3 shrink-0" />,
    WARNING: <AlertTriangle className="w-3 h-3 shrink-0" />,
    ERROR: <AlertCircle className="w-3 h-3 shrink-0" />,
    CRITICAL: <Flame className="w-3 h-3 shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-medium rounded border whitespace-nowrap shrink-0 ${styles[level]}`}
    >
      {icons[level]}
      {level}
    </span>
  );
};

export const ServiceStatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const styles: Record<ServiceStatus, string> = {
    Healthy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    Warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    Degraded: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25',
  };

  const icons: Record<ServiceStatus, React.ReactNode> = {
    Healthy: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    Warning: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
    Degraded: <ShieldAlert className="w-3.5 h-3.5 shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border whitespace-nowrap shrink-0 ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export const IncidentSeverityBadge: React.FC<{ severity: IncidentSeverity }> = ({
  severity,
}) => {
  const styles: Record<IncidentSeverity, string> = {
    High: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    Low: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25',
  };

  const icons: Record<IncidentSeverity, React.ReactNode> = {
    High: <ShieldAlert className="w-3 h-3 shrink-0" />,
    Medium: <AlertTriangle className="w-3 h-3 shrink-0" />,
    Low: <Info className="w-3 h-3 shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border whitespace-nowrap shrink-0 ${styles[severity]}`}
    >
      {icons[severity]}
      {severity} Severity
    </span>
  );
};

export const IncidentStatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  const styles: Record<IncidentStatus, string> = {
    Open: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    Investigating: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    Resolved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  };

  const icons: Record<IncidentStatus, React.ReactNode> = {
    Open: <AlertCircle className="w-3 h-3 shrink-0" />,
    Investigating: <Search className="w-3 h-3 shrink-0" />,
    Resolved: <CheckCircle2 className="w-3 h-3 shrink-0" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border whitespace-nowrap shrink-0 ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};
