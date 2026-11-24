import React from 'react';
import { ArrowUpRight, Server } from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { ServiceStatusBadge } from '../components/StatusBadges';
import { ServiceInfo } from '../types/monitoring';

interface ServicesPageProps {
  services: ServiceInfo[];
  isDark: boolean;
  onSelectService: (service: ServiceInfo) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  isDark,
  onSelectService,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Monitored Services
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Container-level health, log volume, error rates, and simulated latency telemetry. Click a service to open its detail drawer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {services.map((service) => {
          const strokeColor =
            service.status === 'Healthy'
              ? '#10B981'
              : service.status === 'Warning'
                ? '#F59E0B'
                : '#EF4444';

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectService(service);
                }
              }}
              className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Identity & Description */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Server className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                          {service.name}
                        </h2>
                        <ServiceStatusBadge status={service.status} />
                      </div>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                        {service.containerImage}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-slate-800/80 lg:px-6">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Log Volume
                    </p>
                    <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {service.logVolume.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Error Rate
                    </p>
                    <p
                      className={`mt-1 text-base font-bold font-mono tabular-nums ${
                        service.status === 'Degraded'
                          ? 'text-red-600 dark:text-red-400'
                          : service.status === 'Warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {service.errorRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Uptime
                    </p>
                    <p className="mt-1 text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {service.uptime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Last Event
                    </p>
                    <p className="mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 line-clamp-2">
                      {service.lastEvent}
                    </p>
                  </div>
                </div>

                {/* Mini Error Trend & Action */}
                <div className="lg:col-span-3 flex items-center justify-between gap-4">
                  <div className="flex-1 h-16 min-w-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={service.errorTrend}>
                        <XAxis dataKey="time" hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                            borderColor: isDark ? '#334155' : '#CBD5E1',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="errors"
                          name="Errors"
                          stroke={strokeColor}
                          fill={strokeColor}
                          fillOpacity={0.18}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap shrink-0">
                    Inspect
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
