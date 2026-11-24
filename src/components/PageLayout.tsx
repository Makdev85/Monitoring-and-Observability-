import React from 'react';
import { Info } from 'lucide-react';
import {
  EnvironmentOption,
  NavPage,
  NotificationItem,
  TimeRange,
} from '../types/monitoring';
import { NotificationPanel } from './NotificationPanel';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface PageLayoutProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  environment: EnvironmentOption;
  onEnvironmentChange: (env: EnvironmentOption) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  notifications: NotificationItem[];
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (id: string, targetPage: NavPage) => void;
  sidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  mobileSidebarOpen: boolean;
  onOpenMobileSidebar: () => void;
  onCloseMobileSidebar: () => void;
  openIncidentsCount: number;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  activePage,
  onNavigate,
  environment,
  onEnvironmentChange,
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  notifications,
  notificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
  onMarkAllRead,
  onSelectNotification,
  sidebarCollapsed,
  onToggleSidebarCollapse,
  mobileSidebarOpen,
  onOpenMobileSidebar,
  onCloseMobileSidebar,
  openIncidentsCount,
  children,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebarCollapse}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={onCloseMobileSidebar}
        openIncidentsCount={openIncidentsCount}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          environment={environment}
          onEnvironmentChange={onEnvironmentChange}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          unreadCount={unreadCount}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={onToggleNotifications}
          onOpenMobileSidebar={onOpenMobileSidebar}
        />

        <NotificationPanel
          open={notificationsOpen}
          notifications={notifications}
          onClose={onCloseNotifications}
          onMarkAllRead={onMarkAllRead}
          onSelectNotification={onSelectNotification}
        />

        {/* Clear Prototype / Simulated Environment Notice */}
        <div className="px-4 sm:px-6 lg:px-8 py-2 bg-slate-100/80 dark:bg-[#0E1422] border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              Interactive Frontend Demo — Displaying simulated container logs and mock telemetry for{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">
                {environment}
              </strong>
              .
            </span>
          </div>
          <span className="font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
            Simulated Snapshot · 2026-11-24 19:02 UTC
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
