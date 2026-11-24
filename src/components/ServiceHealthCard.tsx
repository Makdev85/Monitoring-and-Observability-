import React from 'react';
import { ArrowRight, Server } from 'lucide-react';
import { ServiceInfo } from '../types/monitoring';
import { ServiceStatusBadge } from './StatusBadges';

interface ServiceHealthCardProps {
  service: ServiceInfo;
  onInvestigate: (service: ServiceInfo) => void;
}

export const ServiceHealthCard: React.FC<ServiceHealthCardProps> = ({
  service,
  onInvestigate,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100 truncate">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Port {service.port} · {service.containerImage.split('/')[1]}
              </p>
            </div>
          </div>
          <ServiceStatusBadge status={service.status} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Errors</p>
            <p
              className={`mt-0.5 text-sm font-semibold font-mono tabular-nums ${
                service.errorCount > 10
                  ? 'text-red-600 dark:text-red-400'
                  : service.errorCount > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {service.errorCount}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Uptime</p>
            <p className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {service.uptime}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Last activity</p>
            <p className="mt-0.5 text-xs font-mono tabular-nums text-slate-700 dark:text-slate-300 truncate">
              {service.lastActivity.split(' ')[1]}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {service.lastEvent}
        </span>
        <button
          type="button"
          onClick={() => onInvestigate(service)}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
        >
          Investigate
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
