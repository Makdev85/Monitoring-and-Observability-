import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Layers,
  Menu,
  Search,
} from 'lucide-react';
import { EnvironmentOption, TimeRange } from '../types/monitoring';

interface TopbarProps {
  environment: EnvironmentOption;
  onEnvironmentChange: (env: EnvironmentOption) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  unreadCount: number;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onOpenMobileSidebar: () => void;
}

const TIME_RANGES: Array<{ value: TimeRange; label: string }> = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last 1 hour' },
  { value: '24h', label: 'Last 24 hours' },
];

const ENVIRONMENTS: EnvironmentOption[] = [
  'Docker Development',
  'Docker Staging (Demo)',
  'Local Compose Cluster',
];

export const Topbar: React.FC<TopbarProps> = ({
  environment,
  onEnvironmentChange,
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  unreadCount,
  notificationsOpen,
  onToggleNotifications,
  onOpenMobileSidebar,
}) => {
  const [avatarError, setAvatarError] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800/90 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu trigger + Environment & Time controls */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Environment selector */}
        <div className="relative flex items-center">
          <Layers className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            aria-label="Select environment"
            value={environment}
            onChange={(e) => onEnvironmentChange(e.target.value as EnvironmentOption)}
            className="h-9 pl-9 pr-7 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 dark:bg-[#161E2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer whitespace-nowrap"
          >
            {ENVIRONMENTS.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
        </div>

        {/* Time range selector */}
        <div className="relative hidden sm:flex items-center">
          <Clock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            aria-label="Select time range"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
            className="h-9 pl-9 pr-7 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 dark:bg-[#161E2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer whitespace-nowrap"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Search + Notification Bell + User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <form onSubmit={handleFormSubmit} className="relative hidden md:block w-60 xl:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search logs, services, traces..."
            aria-label="Search logs"
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-slate-100 dark:bg-[#161E2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        {/* Mobile compact time range selector */}
        <select
          aria-label="Select time range compact"
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          className="sm:hidden h-9 px-2.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-[#161E2E] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="24h">24h</option>
        </select>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onToggleNotifications}
          aria-label={`Notifications (${unreadCount} unread)`}
          aria-expanded={notificationsOpen}
          className={`relative h-9 w-9 rounded-lg border flex items-center justify-center transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            notificationsOpen
              ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-300'
              : 'bg-slate-100 dark:bg-[#161E2E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-mono font-semibold tabular-nums flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1 shrink-0">
          {!avatarError ? (
            <img
              src="/src/assets/images/avatar_devops_engineer_1795527350941.jpg"
              alt="DevOps Engineer profile"
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
              SR
            </div>
          )}
          <div className="hidden xl:block leading-tight">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              SRE On-Call
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Demo Workspace
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
