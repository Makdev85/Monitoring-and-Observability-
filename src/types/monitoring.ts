export type NavPage =
  | 'overview'
  | 'logs'
  | 'incidents'
  | 'services'
  | 'ai-analyst'
  | 'settings';

export type EnvironmentOption =
  | 'Docker Development'
  | 'Docker Staging (Demo)'
  | 'Local Compose Cluster';

export type TimeRange = '15m' | '1h' | '24h';

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type ServiceName = 'payment-service' | 'web-service' | 'auth-service';

export type ServiceStatus = 'Healthy' | 'Warning' | 'Degraded';

export type IncidentSeverity = 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved';

export interface LogEntry {
  id: string;
  timestamp: string;
  relativeMinutesAgo: number;
  service: ServiceName;
  level: LogLevel;
  message: string;
  containerId: string;
  traceId: string;
  host: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ServiceTrendPoint {
  time: string;
  errors: number;
  requests: number;
}

export interface ServiceInfo {
  id: ServiceName;
  name: ServiceName;
  displayName: string;
  status: ServiceStatus;
  errorCount: number;
  warningCount: number;
  logVolume: number;
  errorRate: string;
  uptime: string;
  lastActivity: string;
  lastEvent: string;
  containerImage: string;
  containerId: string;
  port: number;
  cpuUsage: string;
  memoryUsage: string;
  avgLatency: string;
  description: string;
  errorTrend: ServiceTrendPoint[];
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  service: ServiceName;
  occurrences: number;
  status: IncidentStatus;
  detectedAt: string;
  lastSeen: string;
  description: string;
  impact: string;
  aiPrompt: string;
  relatedLogIds: string[];
}

export interface DashboardMetric {
  id: 'total-logs' | 'errors' | 'warnings' | 'critical';
  label: string;
  value: number;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendIsBad?: boolean;
  severity: 'neutral' | 'error' | 'warning' | 'critical';
  sparkline: number[];
}

export interface ErrorTrendPoint {
  time: string;
  errors: number;
  warnings: number;
  critical: number;
}

export interface SeverityDistributionItem {
  level: LogLevel;
  count: number;
  percentage: number;
}

export interface ErrorGroup {
  id: string;
  message: string;
  service: ServiceName;
  occurrences: number;
  level: LogLevel;
  lastSeen: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  level: 'CRITICAL' | 'ERROR' | 'WARNING' | 'HEALTHY' | 'AI';
  service?: ServiceName;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'error' | 'warning' | 'ai';
  read: boolean;
  targetPage: NavPage;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referencedServices?: ServiceName[];
}

export interface AppSettings {
  monitoringIntervalSeconds: 15 | 30 | 60 | 300;
  errorThreshold: number;
  criticalThreshold: number;
  notifyOnCritical: boolean;
  notifyOnErrorSpike: boolean;
  notifyOnSlowResponse: boolean;
  notifyOnAiSummary: boolean;
  aiAnalysisEnabled: boolean;
  darkMode: boolean;
}

/**
 * Future-compatible adapter contract for replacing mockData with real backends
 * (Grafana Loki HTTP API, Python log analysis service, AI agent API, Incident API).
 */
export interface MonitoringDataAdapter {
  getMetrics(timeRange: TimeRange, env: EnvironmentOption): DashboardMetric[];
  getServices(timeRange: TimeRange): ServiceInfo[];
  getLogs(filters?: {
    search?: string;
    service?: ServiceName | 'ALL';
    level?: LogLevel | 'ALL';
    timeRange?: TimeRange;
  }): LogEntry[];
  getIncidents(): Incident[];
  getErrorTrends(timeRange: TimeRange): ErrorTrendPoint[];
  getSeverityDistribution(timeRange: TimeRange): SeverityDistributionItem[];
  getTopErrorGroups(): ErrorGroup[];
  getRecentActivity(): ActivityEvent[];
  getNotifications(): NotificationItem[];
}
