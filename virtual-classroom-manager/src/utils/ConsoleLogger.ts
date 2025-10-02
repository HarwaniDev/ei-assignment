import { ILogger, LogLevel } from './ILogger';

export class ConsoleLogger implements ILogger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage(LogLevel.INFO, message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }

  error(message: string, error?: Error): void {
    const errorMessage = error ? `${message} - ${error.message}` : message;
    console.error(this.formatMessage(LogLevel.ERROR, errorMessage));
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  debug(message: string): void {
    console.debug(this.formatMessage(LogLevel.DEBUG, message));
  }
}
