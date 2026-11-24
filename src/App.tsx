import { useEffect, useState } from 'react';
import { PageLayout } from './components/PageLayout';
import { ServiceDetails } from './components/ServiceDetails';
import { DEFAULT_SETTINGS, MOCK_LOGS } from './data/mockData';
import { AIAnalystPage } from './pages/AIAnalystPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { LogExplorerPage } from './pages/LogExplorerPage';
import { OverviewPage } from './pages/OverviewPage';
import { ServicesPage } from './pages/ServicesPage';
import { SettingsPage } from './pages/SettingsPage';
import { monitoringApi } from './services/monitoringApi';
import {
  AppSettings,
  ChatMessageItem,
  EnvironmentOption,
  Incident,
  IncidentStatus,
  LogLevel,
  NavPage,
  NotificationItem,
  ServiceInfo,
  ServiceName,
  TimeRange,
} from './types/monitoring';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [environment, setEnvironment] = useState<EnvironmentOption>('Docker Development');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  // Navigation & overlay state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Shared Log Explorer & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [logServiceFilter, setLogServiceFilter] = useState<ServiceName | 'ALL'>('ALL');
  const [logSeverityFilter, setLogSeverityFilter] = useState<LogLevel | 'ALL'>('ALL');

  // Interactive domain state backed by mock data
  const [incidents, setIncidents] = useState<Incident[]>(() =>
    monitoringApi.getIncidents()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    monitoringApi.getNotifications()
  );
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // AI Analyst conversational state
  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      id: 'ai-welcome',
      role: 'assistant',
      content:
        'Hello — I am the simulated LogSight AI Analyst. I can help you inspect container errors, correlate incidents across payment-service, web-service, and auth-service, and prioritize what to investigate first.\n\nAll responses are simulated locally from mock container logs.',
      timestamp: '19:02:45',
      referencedServices: ['payment-service', 'web-service'],
    },
  ]);
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | null>(null);

  // Sync Tailwind v4 `.dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const metrics = monitoringApi.getMetrics(timeRange, environment);
  const services = monitoringApi.getServices(timeRange);
  const errorTrends = monitoringApi.getErrorTrends(timeRange);
  const severityDistribution = monitoringApi.getSeverityDistribution(timeRange);
  const topErrorGroups = monitoringApi.getTopErrorGroups();
  const recentActivity = monitoringApi.getRecentActivity();

  const openIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;

  const handleSearchSubmit = (q: string) => {
    setSearchQuery(q);
    setActivePage('logs');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (id: string, targetPage: NavPage) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setNotificationsOpen(false);
    setActivePage(targetPage);
  };

  const handleInvestigateWithAI = (prompt: string) => {
    setSelectedService(null);
    setPendingAIPrompt(prompt);
    setActivePage('ai-analyst');
  };

  const handleIncidentStatusChange = (incidentId: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status } : inc))
    );
  };

  const handleNavigateLogsWithFilter = (opts: {
    level?: LogLevel | 'ALL';
    service?: ServiceName | 'ALL';
    search?: string;
  }) => {
    if (opts.level !== undefined) setLogSeverityFilter(opts.level);
    if (opts.service !== undefined) setLogServiceFilter(opts.service);
    if (opts.search !== undefined) setSearchQuery(opts.search);
    setSelectedService(null);
    setActivePage('logs');
  };

  return (
    <PageLayout
      activePage={activePage}
      onNavigate={setActivePage}
      environment={environment}
      onEnvironmentChange={setEnvironment}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      notifications={notifications}
      notificationsOpen={notificationsOpen}
      onToggleNotifications={() => setNotificationsOpen((prev) => !prev)}
      onCloseNotifications={() => setNotificationsOpen(false)}
      onMarkAllRead={handleMarkAllNotificationsRead}
      onSelectNotification={handleSelectNotification}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebarCollapse={() => setSidebarCollapsed((prev) => !prev)}
      mobileSidebarOpen={mobileSidebarOpen}
      onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
      openIncidentsCount={openIncidentsCount}
    >
      {activePage === 'overview' && (
        <OverviewPage
          metrics={metrics}
          services={services}
          errorTrends={errorTrends}
          severityDistribution={severityDistribution}
          topErrorGroups={topErrorGroups}
          recentActivity={recentActivity}
          timeRange={timeRange}
          isDark={settings.darkMode}
          aiAnalysisEnabled={settings.aiAnalysisEnabled}
          onInvestigateWithAI={handleInvestigateWithAI}
          onInspectService={(svc) => setSelectedService(svc)}
          onNavigateLogsWithFilter={(opts) => handleNavigateLogsWithFilter(opts)}
          onOpenIncidents={() => setActivePage('incidents')}
        />
      )}

      {activePage === 'logs' && (
        <LogExplorerPage
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          serviceFilter={logServiceFilter}
          onServiceFilterChange={setLogServiceFilter}
          severityFilter={logSeverityFilter}
          onSeverityFilterChange={setLogSeverityFilter}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      )}

      {activePage === 'incidents' && (
        <IncidentsPage
          incidents={incidents}
          logs={MOCK_LOGS}
          onStatusChange={handleIncidentStatusChange}
          onInvestigateWithAI={(inc) => handleInvestigateWithAI(inc.aiPrompt)}
        />
      )}

      {activePage === 'services' && (
        <ServicesPage
          services={services}
          isDark={settings.darkMode}
          onSelectService={(svc) => setSelectedService(svc)}
        />
      )}

      {activePage === 'ai-analyst' && (
        <AIAnalystPage
          messages={chatMessages}
          onMessagesChange={setChatMessages}
          pendingPrompt={pendingAIPrompt}
          onClearPendingPrompt={() => setPendingAIPrompt(null)}
          aiAnalysisEnabled={settings.aiAnalysisEnabled}
          onInspectServiceLogs={(svc) =>
            handleNavigateLogsWithFilter({ service: svc, level: 'ALL', search: '' })
          }
        />
      )}

      {activePage === 'settings' && (
        <SettingsPage settings={settings} onUpdateSettings={setSettings} />
      )}

      {/* Service Details Slide-Over Panel */}
      <ServiceDetails
        service={selectedService}
        logs={MOCK_LOGS}
        isDark={settings.darkMode}
        onClose={() => setSelectedService(null)}
        onInvestigateWithAI={(svc) =>
          handleInvestigateWithAI(
            svc.name === 'payment-service'
              ? 'Why is payment-service failing?'
              : svc.name === 'web-service'
                ? 'Why are there HTTP 500 errors?'
                : 'Is auth-service experiencing any active issues right now?'
          )
        }
        onViewLogsForService={(svc) =>
          handleNavigateLogsWithFilter({ service: svc.name, level: 'ALL', search: '' })
        }
      />
    </PageLayout>
  );
}
