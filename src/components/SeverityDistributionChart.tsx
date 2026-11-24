import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LogLevel, SeverityDistributionItem } from '../types/monitoring';

interface SeverityDistributionChartProps {
  data: SeverityDistributionItem[];
  isDark: boolean;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  INFO: '#3B82F6',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  CRITICAL: '#E11D48',
};

export const SeverityDistributionChart: React.FC<SeverityDistributionChartProps> = ({
  data,
  isDark,
}) => {
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Log Severity Distribution
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Breakdown across INFO, WARNING, ERROR, and CRITICAL
        </p>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="level"
              stroke={tickColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={tickColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.04)' }}
              contentStyle={{
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#CBD5E1',
                borderRadius: '8px',
                fontSize: '12px',
                color: isDark ? '#F1F5F9' : '#0F172A',
              }}
              formatter={(value) => [Number(value).toLocaleString(), 'Log Entries']}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={42}>
              {data.map((entry) => (
                <Cell key={entry.level} fill={LEVEL_COLORS[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.map((item) => (
          <div key={item.level} className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: LEVEL_COLORS[item.level] }}
              />
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {item.level}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {item.count.toLocaleString()}
              <span className="ml-1 text-[11px] font-normal text-slate-400">
                ({item.percentage}%)
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
