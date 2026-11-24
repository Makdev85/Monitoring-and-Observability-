import React, { useState } from 'react';
import { Download, RefreshCw, Search, X } from 'lucide-react';
import { LogTable } from '../components/LogTable';
import { monitoringApi } from '../services/monitoringApi';
import { LogLevel, ServiceName, TimeRange } from '../types/monitoring';

interface LogExplorerPageProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  serviceFilter: ServiceName | 'ALL';
  onServiceFilterChange: (svc: ServiceName | 'ALL') => void;
  severityFilter: LogLevel | 'ALL';
  onSeverityFilterChange: (lvl: LogLevel | 'ALL') => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const LogExplorerPage: React.FC<LogExplorerPageProps> = ({
  searchQuery,
  onSearchChange,
  serviceFilter,
  onServiceFilterChange,
  severityFilter,
  onSeverityFilterChange,
  timeRange,
  onTimeRangeChange,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredLogs = monitoringApi.getLogs({
    search: searchQuery,
    service: serviceFilter,
    level: severityFilter,
    timeRange,
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 350);
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Service', 'Level', 'Message', 'ContainerID', 'TraceID'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.service,
      l.level,
      `"${l.message.replace(/"/g, '""')}"`,
      l.containerId,
      l.traceId,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logsight-demo-logs-${timeRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${filteredLogs.length} simulated log entries as CSV.`);
    window.setTimeout(() => setExportNotice(null), 3500);
  };

  const handleResetFilters = () => {
    onSearchChange('');
    onServiceFilterChange('ALL');
    onSeverityFilterChange('ALL');
    onTimeRangeChange('24h');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Log Explorer
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Filter, inspect, and export simulated Docker container logs. Click any row to expand trace metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <span>{exportNotice}</span>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            aria-label="Dismiss export notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by log message, service, or trace ID..."
            aria-label="Filter log messages"
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Service Filter */}
        <div className="md:col-span-3">
          <select
            aria-label="Filter by service"
            value={serviceFilter}
            onChange={(e) => onServiceFilterChange(e.target.value as ServiceName | 'ALL')}
            className="w-full h-9 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Services</option>
            <option value="payment-service">payment-service</option>
            <option value="web-service">web-service</option>
            <option value="auth-service">auth-service</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="md:col-span-2">
          <select
            aria-label="Filter by severity"
            value={severityFilter}
            onChange={(e) => onSeverityFilterChange(e.target.value as LogLevel | 'ALL')}
            className="w-full h-9 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="ERROR">ERROR</option>
            <option value="WARNING">WARNING</option>
            <option value="INFO">INFO</option>
          </select>
        </div>

        {/* Time Range Filter */}
        <div className="md:col-span-2">
          <select
            aria-label="Filter by time range"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
            className="w-full h-9 px-3 text-sm rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono tabular-nums">
          Showing {filteredLogs.length} simulated log{' '}
          {filteredLogs.length === 1 ? 'entry' : 'entries'}
        </span>
        {(searchQuery || serviceFilter !== 'ALL' || severityFilter !== 'ALL') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      <LogTable
        logs={filteredLogs}
        isLoading={isRefreshing}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
