import React, { useEffect } from 'react';
import { Bot, Cpu, HardDrive, Network, X } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LogEntry, ServiceInfo } from '../types/monitoring';
import { LogTable } from './LogTable';
import { ServiceStatusBadge } from './StatusBadges';

interface ServiceDetailsProps {
  service: ServiceInfo | null;
  logs: LogEntry[];
  isDark: boolean;
  onClose: () => void;
  onInvestigateWithAI: (service: ServiceInfo) => void;
  onViewLogsForService: (service: ServiceInfo) => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  logs,
  isDark,
  onClose,
  onInvestigateWithAI,
  onViewLogsForService,
}) => {
  useEffect(() => {
    if (!service) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [service, onClose]);

  if (!service) return null;

  const serviceLogs = logs.filter((l) => l.service === service.name).slice(0, 6);
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-detail-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2
                id="service-detail-title"
                className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 truncate"
              >
                {service.name}
              </h2>
              <ServiceStatusBadge status={service.status} />
            </div>
            <p className="mt-1 text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
              {service.containerImage} · Container {service.containerId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {service.description}
          </p>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Error Rate</p>
              <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {service.errorRate}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Log Volume</p>
              <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {service.logVolume.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p>
              <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {service.uptime}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Latency</p>
              <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {service.avgLatency}
              </p>
            </div>
          </div>

          {/* Container resource utilization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">CPU Usage</p>
                <p className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {service.cpuUsage}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">Memory</p>
                <p className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  {service.memoryUsage}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <Network className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">Exposed Port</p>
                <p className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  :{service.port}
                </p>
              </div>
            </div>
          </div>

          {/* Error trend chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Recent Error Trend
            </h3>
            <div className="h-44 w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={service.errorTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" stroke={tickColor} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={tickColor} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#CBD5E1',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    name="Errors"
                    stroke={service.status === 'Healthy' ? '#10B981' : '#EF4444'}
                    fill={service.status === 'Healthy' ? '#10B981' : '#EF4444'}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Logs */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Latest Container Logs
              </h3>
              <button
                type="button"
                onClick={() => onViewLogsForService(service)}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open in Log Explorer
              </button>
            </div>
            <LogTable logs={serviceLogs} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E131F] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onInvestigateWithAI(service)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask AI Analyst about {service.name}
          </button>
        </div>
      </div>
    </div>
  );
};
