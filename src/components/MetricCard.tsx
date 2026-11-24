import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  FileText,
  Flame,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { DashboardMetric } from '../types/monitoring';

interface MetricCardProps {
  metric: DashboardMetric;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, onClick }) => {
  const iconMap: Record<DashboardMetric['id'], React.ReactNode> = {
    'total-logs': <FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />,
    errors: <AlertCircle className="w-4 h-4 text-red-500" />,
    warnings: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    critical: <Flame className="w-4 h-4 text-rose-500" />,
  };

  const iconBgMap: Record<DashboardMetric['severity'], string> = {
    neutral: 'bg-slate-100 dark:bg-slate-800/80',
    error: 'bg-red-500/10',
    warning: 'bg-amber-500/10',
    critical: 'bg-rose-500/15',
  };

  const sparkColorMap: Record<DashboardMetric['severity'], string> = {
    neutral: '#6366F1',
    error: '#EF4444',
    warning: '#F59E0B',
    critical: '#E11D48',
  };

  const valueColorMap: Record<DashboardMetric['severity'], string> = {
    neutral: 'text-slate-900 dark:text-slate-50',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    critical: 'text-rose-600 dark:text-rose-400',
  };

  // Build normalized SVG polyline points for the sparkline
  const points = metric.sparkline;
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;
  const width = 96;
  const height = 28;
  const polylinePoints = points
    .map((val, idx) => {
      const x = (idx / Math.max(points.length - 1, 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 transition-colors ${
        onClick
          ? 'hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {metric.label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgMap[metric.severity]}`}>
          {iconMap[metric.id]}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${valueColorMap[metric.severity]}`}>
            {metric.value.toLocaleString()}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {metric.trendDirection === 'up' ? (
              <TrendingUp
                className={`w-3.5 h-3.5 shrink-0 ${
                  metric.trendIsBad
                    ? 'text-red-500'
                    : 'text-emerald-500'
                }`}
              />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
            )}
            <span
              className={`font-medium tabular-nums ${
                metric.trendIsBad
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {metric.trend}
            </span>
          </div>
        </div>

        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          className="shrink-0 overflow-visible"
        >
          <polyline
            fill="none"
            stroke={sparkColorMap[metric.severity]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        </svg>
      </div>
    </Wrapper>
  );
};
