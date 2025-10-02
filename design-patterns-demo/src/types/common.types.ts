export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
  }
  
  export interface ILogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, unknown>;
  }
  
  export interface IValidationResult {
    isValid: boolean;
    errors: string[];
  }
  
  export interface IRetryConfig {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  }
  
  export enum ApplicationState {
    INITIALIZING = 'INITIALIZING',
    RUNNING = 'RUNNING',
    SHUTTING_DOWN = 'SHUTTING_DOWN',
    TERMINATED = 'TERMINATED'
  }
  
  export interface IMenuItem {
    id: string;
    label: string;
    action: () => Promise<void>;
    isEnabled: () => boolean;
  }