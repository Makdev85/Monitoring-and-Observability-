import { MOCK_INCIDENTS, MOCK_LOGS, MOCK_SERVICES } from '../data/mockData';
import { ServiceName } from '../types/monitoring';

export interface SimulatedAIResponse {
  content: string;
  referencedServices: ServiceName[];
}

/**
 * Frontend-only AI Log Analyst Simulator
 * --------------------------------------------------------------------------
 * Evaluates user queries against the local simulated logs, services, and
 * incidents using deterministic keyword & intent matching.
 * Does NOT call any external AI API or backend service.
 */
export function generateSimulatedAIResponse(query: string): SimulatedAIResponse {
  const q = query.toLowerCase().trim();

  // 1. What is happening in our containers right now?
  if (
    q.includes('happening') ||
    q.includes('right now') ||
    q.includes('overview') ||
    q.includes('status')
  ) {
    return {
      referencedServices: ['payment-service', 'web-service', 'auth-service'],
      content: [
        'There are currently two services experiencing issues in the simulated Docker Development environment:',
        '',
        '• payment-service (Degraded): Repeated gateway timeout and connection-refused errors.',
        '• web-service (Warning): Multiple HTTP 500 responses and slow response warnings (up to 4.8s).',
        '• auth-service (Healthy): Appears healthy in the simulated monitoring data (99.98% uptime).',
        '',
        'The payment-service should be investigated first.',
      ].join('\n'),
    };
  }

  // 2. Critical errors
  if (q.includes('critical')) {
    const criticalLogs = MOCK_LOGS.filter((l) => l.level === 'CRITICAL');
    return {
      referencedServices: ['payment-service'],
      content: [
        `I found ${criticalLogs.length} simulated critical events in the current monitoring window:`,
        '',
        ...criticalLogs.map(
          (l) => `• [${l.timestamp}] ${l.service}: ${l.message} (trace: ${l.traceId})`
        ),
        '',
        'The most significant is a connection-refused error from payment-service (`ECONNREFUSED` against 172.24.0.14:8443), which indicates the connection attempt to the gateway was rejected. The logs alone cannot determine the exact root cause.',
      ].join('\n'),
    };
  }

  // 3. Why is payment-service failing?
  if (q.includes('payment') || q.includes('gateway') || q.includes('timeout')) {
    return {
      referencedServices: ['payment-service'],
      content: [
        'The payment-service has reported repeated connection timeout errors followed by connection-refused messages.',
        '',
        'Possible causes include:',
        '1. Payment gateway unavailability.',
        '2. Network connectivity issues between Docker containers.',
        '3. Incorrect gateway endpoint configuration.',
        '4. An upstream service outage or database pool saturation.',
        '',
        'Recommended investigation:',
        '- Check gateway availability and health endpoints.',
        '- Verify endpoint configuration in container environment variables.',
        '- Test connectivity from the payment-service container.',
        '- Review upstream gateway status and connection pool metrics.',
        '',
        'Note: These are possible causes based on the simulated logs, not confirmed root causes.',
      ].join('\n'),
    };
  }

  // 4. HTTP 500 errors / web-service
  if (q.includes('500') || q.includes('web-service') || q.includes('web service') || q.includes('slow')) {
    return {
      referencedServices: ['web-service', 'payment-service'],
      content: [
        'The web-service is reporting repeated HTTP 500 responses (7 occurrences) and slow response time warnings (up to 4.8 seconds).',
        '',
        'Possible investigation areas:',
        '- Application exceptions on POST /api/checkout/confirm.',
        '- Dependency failures (notably downstream calls to payment-service).',
        '- Backend service availability and thread pool saturation.',
        '- Resource usage (CPU is currently at 58.4% in simulated telemetry).',
        '- Recent code or configuration changes.',
        '',
        'The mock logs indicate a strong correlation with payment-service timeouts, though they do not establish a confirmed root cause.',
      ].join('\n'),
    };
  }

  // 5. Show me the errors from the last 10 minutes
  if (q.includes('10 minutes') || q.includes('last 10') || q.includes('recent errors')) {
    const recentErrors = MOCK_LOGS.filter(
      (l) => l.relativeMinutesAgo <= 10 && (l.level === 'ERROR' || l.level === 'CRITICAL')
    );
    return {
      referencedServices: ['payment-service', 'web-service'],
      content: [
        `Found ${recentErrors.length} ERROR and CRITICAL entries within the last 10 minutes of simulated logs:`,
        '',
        ...recentErrors.map(
          (l) => `• ${l.timestamp} | ${l.service} | ${l.level} | ${l.message}`
        ),
        '',
        'Most recent errors are concentrated around checkout payment dispatch and downstream HTTP 500 responses.',
      ].join('\n'),
    };
  }

  // 6. Which service has the highest error rate?
  if (q.includes('highest') || q.includes('error rate') && !q.includes('increase')) {
    const sorted = [...MOCK_SERVICES].sort(
      (a, b) => parseFloat(b.errorRate) - parseFloat(a.errorRate)
    );
    return {
      referencedServices: [sorted[0].name, sorted[1].name],
      content: [
        'Error rate breakdown across monitored containers (simulated 1-hour window):',
        '',
        ...sorted.map(
          (s, idx) =>
            `${idx + 1}. ${s.name} — ${s.errorRate} error rate (${s.errorCount} errors across ${s.logVolume} logs) · Status: ${s.status}`
        ),
        '',
        `${sorted[0].name} currently has the highest error rate at ${sorted[0].errorRate}, more than double ${sorted[1].name}.`,
      ].join('\n'),
    };
  }

  // 7. Did the error rate increase recently?
  if (q.includes('increase') || q.includes('trend') || q.includes('spike')) {
    return {
      referencedServices: ['payment-service', 'web-service'],
      content: [
        'Yes. In the simulated 1-hour telemetry window, log errors increased by +28.5% compared to the previous hour (37 errors total, with 14 errors occurring in just the last 15 minutes).',
        '',
        'Timeline pattern:',
        '• 18:05–18:35: Baseline 2–4 errors per 10-minute interval.',
        '• 18:45–19:02: Sharp upward climb to 11 errors per interval, coinciding with 2 CRITICAL connection-refused events in payment-service.',
      ].join('\n'),
    };
  }

  // 8. Summarize the current incidents
  if (q.includes('summarize') || q.includes('incidents') || q.includes('incident')) {
    return {
      referencedServices: ['payment-service', 'web-service', 'auth-service'],
      content: [
        'Summary of current simulated incidents:',
        '',
        ...MOCK_INCIDENTS.map(
          (inc) =>
            `• [${inc.severity} · ${inc.status}] ${inc.title} (${inc.service}) — ${inc.occurrences} occurrences. ${inc.description}`
        ),
        '',
        'Overall priority remains INC-2401 (Payment gateway timeout) due to active CRITICAL connection rejections.',
      ].join('\n'),
    };
  }

  // 9. What should I investigate first?
  if (q.includes('first') || q.includes('priority') || q.includes('start')) {
    return {
      referencedServices: ['payment-service', 'web-service'],
      content: [
        'Recommended triage order based on simulated severity and downstream impact:',
        '',
        '1. Prioritize payment-service (High Severity / Degraded): It has 2 CRITICAL connection-refused events and 12 database/gateway timeout occurrences. Since web-service checkout routes depend on payment-service, resolving this may also alleviate the HTTP 500 errors.',
        '2. Inspect web-service (Medium Severity / Warning): Verify whether the 4.8s slow responses and HTTP 500 errors clear once payment-service recovers, or if thread pool exhaustion is also present.',
        '3. No immediate action needed on auth-service (Healthy): Operating at 99.98% uptime.',
      ].join('\n'),
    };
  }

  // 10. Auth service check
  if (q.includes('auth')) {
    return {
      referencedServices: ['auth-service'],
      content: [
        'auth-service is currently Healthy in the simulated monitoring data.',
        '',
        '• Uptime: 99.98%',
        '• Average Latency: 42 ms',
        '• Recent logs: Successful user authentication and RS256 session token generation.',
        '• Historical incident INC-2398 (transient authentication warnings) is marked Resolved with 0 active occurrences.',
      ].join('\n'),
    };
  }

  // Default intelligent fallback referencing live mock state
  return {
    referencedServices: ['payment-service', 'web-service'],
    content: [
      `I analyzed the current simulated Docker Development logs for "${query.trim()}".`,
      '',
      'Key observations from the active 1-hour dataset (1,284 total logs):',
      '• payment-service (Degraded): 22 errors and 2 CRITICAL connection-refused events against the upstream payment gateway.',
      '• web-service (Warning): 12 errors (HTTP 500) and slow response warnings up to 4.8s.',
      '• auth-service (Healthy): Operating normally at 99.98% uptime.',
      '',
      'Try asking specifically about "payment-service", "critical errors", "HTTP 500 errors", or "what to investigate first" for a focused troubleshooting breakdown.',
    ].join('\n'),
  };
}
