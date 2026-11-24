import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { ErrorTrendChart } from '../components/ErrorTrendChart';
import { MetricCard } from '../components/MetricCard';
import { ServiceHealthCard } from '../components/ServiceHealthCard';
import { SeverityDistributionChart } from '../components/SeverityDistributionChart';
import { IncidentSeverityBadge, LogLevelBadge } from '../components/StatusBadges';
import { AI_INCIDENT_SUMMARY } from '../data/mockData';
import {
  ActivityEvent,
  DashboardMetric,
  ErrorGroup,
  ErrorTrendPoint,
  LogLevel,
  ServiceInfo,
  SeverityDistributionItem,
  TimeRange,
} from '../types/monitoring';

interface OverviewPageProps {
  metrics: DashboardMetric[];
  services: ServiceInfo[];
  errorTrends: ErrorTrendPoint[];
  severityDistribution: SeverityDistributionItem[];
  topErrorGroups: ErrorGroup[];
  recentActivity: ActivityEvent[];
  timeRange: TimeRange;
  isDark: boolean;
  aiAnalysisEnabled: boolean;
  onInvestigateWithAI: (prompt: string) => void;
  onInspectService: (service: ServiceInfo) => void;
  onNavigateLogsWithFilter: (opts: { level?: LogLevel | 'ALL'; search?: string }) => void;
  onOpenIncidents: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  metrics,
  services,
  errorTrends,
  severityDistribution,
  topErrorGroups,
  recentActivity,
  timeRange,
  isDark,
  aiAnalysisEnabled,
  onInvestigateWithAI,
  onInspectService,
  onNavigateLogsWithFilter,
  onOpenIncidents,
}) => {
  const getActivityIcon = (level: ActivityEvent['level']) => {
    switch (level) {
      case 'CRITICAL':
        return <Flame className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'HEALTHY':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'AI':
        return <Bot className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Observability Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time simulated container health, log volume, and incident triage across monitored services.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateLogsWithFilter({ level: 'ALL', search: '' })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          Explore Raw Logs
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric Cards */}
      <section aria-label="Key telemetry metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const levelMap: Record<DashboardMetric['id'], LogLevel | 'ALL'> = {
            'total-logs': 'ALL',
            errors: 'ERROR',
            warnings: 'WARNING',
            critical: 'CRITICAL',
          };
          return (
            <MetricCard
              key={metric.id}
              metric={metric}
              onClick={() => onNavigateLogsWithFilter({ level: levelMap[metric.id], search: '' })}
            />
          );
        })}
      </section>

      {/* AI Incident Summary */}
      {aiAnalysisEnabled && (
        <section
          aria-label="AI Incident Summary"
          className="p-5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200 dark:border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  AI Incident Summary
                </h2>
                <IncidentSeverityBadge severity={AI_INCIDENT_SUMMARY.severity} />
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  Generated {AI_INCIDENT_SUMMARY.generatedAt.split(' ')[1]}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-4xl">
                {AI_INCIDENT_SUMMARY.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenIncidents}
              className="px-3.5 py-2 rounded-lg text-xs font-medium border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              View Incidents
            </button>
            <button
              type="button"
              onClick={() => onInvestigateWithAI(AI_INCIDENT_SUMMARY.recommendedPrompt)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors whitespace-nowrap"
            >
              <Bot className="w-3.5 h-3.5" />
              Investigate with AI
            </button>
          </div>
        </section>
      )}

      {/* Service Health */}
      <section aria-label="Monitored service health">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Service Health
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            3 monitored containers
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((svc) => (
            <ServiceHealthCard
              key={svc.id}
              service={svc}
              onInvestigate={onInspectService}
            />
          ))}
        </div>
      </section>

      {/* Charts */}
      <section aria-label="Error trends and severity distribution" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ErrorTrendChart data={errorTrends} timeRange={timeRange} isDark={isDark} />
        </div>
        <div className="lg:col-span-5">
          <SeverityDistributionChart data={severityDistribution} isDark={isDark} />
        </div>
      </section>

      {/* Top Error Groups & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Error Groups */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Top Error Groups
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most frequently occurring signatures across containers
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {topErrorGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() =>
                  onNavigateLogsWithFilter({
                    search: group.message.split(' ').slice(0, 2).join(' '),
                    level: 'ALL',
                  })
                }
                className="w-full py-3 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {group.message}
                    </span>
                    <LogLevelBadge level={group.level} />
                  </div>
                  <p className="mt-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {group.service} · Last seen {group.lastSeen.split(' ')[1]}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                    {group.occurrences}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    occurrences
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Timeline of simulated operational events
            </p>
          </div>

          <ol className="space-y-4">
            {recentActivity.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800/80">
                  {getActivityIcon(event.level)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {event.title}
                    </p>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 shrink-0">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {event.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
};
