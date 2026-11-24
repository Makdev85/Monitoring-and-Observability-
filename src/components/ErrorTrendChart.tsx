import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ErrorTrendPoint, TimeRange } from '../types/monitoring';

interface ErrorTrendChartProps {
  data: ErrorTrendPoint[];
  timeRange: TimeRange;
  isDark: boolean;
}

export const ErrorTrendChart: React.FC<ErrorTrendChartProps> = ({
  data,
  timeRange,
  isDark,
}) => {
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  const rangeLabel =
    timeRange === '15m'
      ? 'Last 15 minutes'
      : timeRange === '1h'
        ? 'Last 1 hour'
        : 'Last 24 hours';

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Error Trends
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulated error and warning log volume · {rangeLabel}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-red-500 inline-block" />
            Errors
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block" />
            Warnings
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-400 inline-block" />
            Critical
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="time"
              stroke={tickColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke={tickColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#CBD5E1',
                borderRadius: '8px',
                fontSize: '12px',
                color: isDark ? '#F1F5F9' : '#0F172A',
              }}
              labelStyle={{
                fontWeight: 600,
                marginBottom: '4px',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <Line
              type="monotone"
              dataKey="errors"
              name="Errors"
              stroke="#EF4444"
              strokeWidth={2.2}
              dot={{ r: 3, fill: '#EF4444' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="warnings"
              name="Warnings"
              stroke="#F59E0B"
              strokeWidth={1.8}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="critical"
              name="Critical"
              stroke="#FB7185"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: '#FB7185' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
