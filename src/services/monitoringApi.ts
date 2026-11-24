import {
  MOCK_ERROR_TRENDS_BY_RANGE,
  MOCK_INCIDENTS,
  MOCK_LOGS,
  MOCK_METRICS_BY_RANGE,
  MOCK_NOTIFICATIONS,
  MOCK_RECENT_ACTIVITY,
  MOCK_SERVICES,
  MOCK_SEVERITY_DISTRIBUTION_BY_RANGE,
  MOCK_TOP_ERROR_GROUPS,
} from '../data/mockData';
import {
  ActivityEvent,
  DashboardMetric,
  EnvironmentOption,
  ErrorGroup,
  ErrorTrendPoint,
  Incident,
  LogEntry,
  LogLevel,
  MonitoringDataAdapter,
  NotificationItem,
  ServiceInfo,
  ServiceName,
  SeverityDistributionItem,
  TimeRange,
} from '../types/monitoring';

/**
 * Future Backend Integration Layer
 * --------------------------------------------------------------------------
 * This service currently returns local simulated monitoring data from mockData.ts.
 * When connecting a live backend, replace individual methods with:
 *  - Grafana Loki HTTP API: GET /loki/api/v1/query_range
 *  - Python Log Analysis Service: GET /api/v1/analysis/error-groups
 *  - Incident API: GET /api/v1/incidents
 *  - Monitoring Metrics API: GET /api/v1/metrics/overview
 */
class MockMonitoringAdapter implements MonitoringDataAdapter {
  getMetrics(timeRange: TimeRange, _env: EnvironmentOption): DashboardMetric[] {
    return MOCK_METRICS_BY_RANGE[timeRange];
  }

  getServices(_timeRange: TimeRange): ServiceInfo[] {
    return MOCK_SERVICES;
  }

  getLogs(filters?: {
    search?: string;
    service?: ServiceName | 'ALL';
    level?: LogLevel | 'ALL';
    timeRange?: TimeRange;
  }): LogEntry[] {
    const searchLower = filters?.search?.trim().toLowerCase() || '';
    const maxMinutes =
      filters?.timeRange === '15m'
        ? 15
        : filters?.timeRange === '1h'
          ? 60
          : 1440;

    return MOCK_LOGS.filter((log) => {
      if (filters?.timeRange && log.relativeMinutesAgo > maxMinutes) {
        return false;
      }
      if (filters?.service && filters.service !== 'ALL' && log.service !== filters.service) {
        return false;
      }
      if (filters?.level && filters.level !== 'ALL' && log.level !== filters.level) {
        return false;
      }
      if (searchLower) {
        const matchesMessage = log.message.toLowerCase().includes(searchLower);
        const matchesService = log.service.toLowerCase().includes(searchLower);
        const matchesTrace = log.traceId.toLowerCase().includes(searchLower);
        return matchesMessage || matchesService || matchesTrace;
      }
      return true;
    });
  }

  getIncidents(): Incident[] {
    return MOCK_INCIDENTS;
  }

  getErrorTrends(timeRange: TimeRange): ErrorTrendPoint[] {
    return MOCK_ERROR_TRENDS_BY_RANGE[timeRange];
  }

  getSeverityDistribution(timeRange: TimeRange): SeverityDistributionItem[] {
    return MOCK_SEVERITY_DISTRIBUTION_BY_RANGE[timeRange];
  }

  getTopErrorGroups(): ErrorGroup[] {
    return MOCK_TOP_ERROR_GROUPS;
  }

  getRecentActivity(): ActivityEvent[] {
    return MOCK_RECENT_ACTIVITY;
  }

  getNotifications(): NotificationItem[] {
    return MOCK_NOTIFICATIONS;
  }
}

export const monitoringApi: MonitoringDataAdapter = new MockMonitoringAdapter();
