export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

export interface AppConfig {
  portalUrl: string;
  gradePageUrl: string;
  username: string;
  password: string;
  xpath: string;
  botToken: string;
  chatId: string;
  intervalMinutes: number;
}

export interface MonitoringStats {
  lastChecked: Date | null;
  currentGrade: string | null;
  status: 'IDLE' | 'RUNNING' | 'ERROR';
  checksPerformed: number;
  responseTimeHistory: { time: string; latency: number }[];
}