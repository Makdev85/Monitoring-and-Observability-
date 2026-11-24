import React, { useState } from 'react';
import { Check, Moon, RotateCcw, Sun } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../data/mockData';
import { AppSettings } from '../types/monitoring';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (next: AppSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);

  const updateField = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({ ...settings, [key]: value });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleReset = () => {
    onUpdateSettings(DEFAULT_SETTINGS);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Frontend demo preferences for thresholds, notifications, AI analyst behavior, and appearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              Applied locally
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset defaults
          </button>
        </div>
      </div>

      {/* Appearance & AI */}
      <section className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 space-y-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Workspace & AI Analyst
        </h2>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Color Theme
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between dark observability mode and light mode.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => updateField('darkMode', true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                settings.darkMode
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
            <button
              type="button"
              onClick={() => updateField('darkMode', false)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !settings.darkMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Simulated AI Analysis
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Show AI Incident Summary on Overview and enable simulated AI Analyst chat responses.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.aiAnalysisEnabled}
            onClick={() => updateField('aiAnalysisEnabled', !settings.aiAnalysisEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              settings.aiAnalysisEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                settings.aiAnalysisEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Monitoring Thresholds (Mock) */}
      <section className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Monitoring & Alert Thresholds (Simulated)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Changes update local demo state only and do not trigger external polling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <label
              htmlFor="monitoring-interval"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Polling Interval
            </label>
            <select
              id="monitoring-interval"
              value={settings.monitoringIntervalSeconds}
              onChange={(e) =>
                updateField(
                  'monitoringIntervalSeconds',
                  Number(e.target.value) as AppSettings['monitoringIntervalSeconds']
                )
              }
              className="w-full h-9 px-3 text-sm font-mono rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="error-threshold"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Error Threshold / hr
            </label>
            <input
              id="error-threshold"
              type="number"
              min={1}
              max={500}
              value={settings.errorThreshold}
              onChange={(e) =>
                updateField('errorThreshold', Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full h-9 px-3 text-sm font-mono tabular-nums rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="critical-threshold"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Critical Threshold / hr
            </label>
            <input
              id="critical-threshold"
              type="number"
              min={1}
              max={100}
              value={settings.criticalThreshold}
              onChange={(e) =>
                updateField('criticalThreshold', Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full h-9 px-3 text-sm font-mono tabular-nums rounded-lg bg-slate-50 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/90 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Notification Preferences
        </h2>

        {(
          [
            {
              key: 'notifyOnCritical',
              label: 'Critical gateway or container failures',
              desc: 'Immediate alert when CRITICAL log events are detected.',
            },
            {
              key: 'notifyOnErrorSpike',
              label: 'HTTP 500 and error rate spikes',
              desc: 'Notify when error count exceeds configured threshold.',
            },
            {
              key: 'notifyOnSlowResponse',
              label: 'Slow response latency warnings',
              desc: 'Alert when container response times exceed 2.0 seconds.',
            },
            {
              key: 'notifyOnAiSummary',
              label: 'AI incident summary updates',
              desc: 'Notify when a new simulated triage summary is prepared.',
            },
          ] as const
        ).map((pref) => {
          const checked = settings[pref.key];
          return (
            <div
              key={pref.key}
              className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {pref.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pref.desc}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => updateField(pref.key, !checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
};
