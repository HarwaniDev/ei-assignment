import * as fs from 'fs';
import * as path from 'path';
import { LogLevel, ILogEntry } from '../../types/common.types';

export class Logger {
  private static instance: Logger;
  private readonly logFilePath: string;
  private readonly logLevel: LogLevel;
  private readonly maxLogFileSize: number = 10 * 1024 * 1024; // 10MB
  private writeStream: fs.WriteStream | null = null;

  private constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
    const logsDir = path.join(process.cwd(), 'logs');
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logFilePath = path.join(logsDir, `app-${this.getDateString()}.log`);
    this.initializeWriteStream();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private initializeWriteStream(): void {
    try {
      this.writeStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
      this.writeStream.on('error', (error) => {
        console.error('Error writing to log file:', error);
      });
    } catch (error) {
      console.error('Failed to initialize log stream:', error);
    }
  }

  private getDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatLogEntry(entry: ILogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    const metadata = entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : '';
    return `${timestamp} [${entry.level}] ${context} ${entry.message}${metadata}`;
  }

  private writeLog(entry: ILogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const formatted = this.formatLogEntry(entry);
    
    // Console output with color coding
    const consoleOutput = this.getColoredOutput(entry.level, formatted);
    console.log(consoleOutput);

    // File output
    if (this.writeStream) {
      try {
        this.writeStream.write(formatted + '\n');
        this.checkLogFileSize();
      } catch (error) {
        console.error('Failed to write to log file:', error);
      }
    }
  }

  private getColoredOutput(level: LogLevel, message: string): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m',  // Cyan
      [LogLevel.INFO]: '\x1b[32m',   // Green
      [LogLevel.WARN]: '\x1b[33m',   // Yellow
      [LogLevel.ERROR]: '\x1b[31m',  // Red
      [LogLevel.FATAL]: '\x1b[35m'   // Magenta
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${message}${reset}`;
  }

  private checkLogFileSize(): void {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const stats = fs.statSync(this.logFilePath);
        if (stats.size >= this.maxLogFileSize) {
          this.rotateLogFile();
        }
      }
    } catch (error) {
      console.error('Error checking log file size:', error);
    }
  }

  private rotateLogFile(): void {
    try {
      if (this.writeStream) {
        this.writeStream.end();
      }
      
      const timestamp = new Date().getTime();
      const rotatedPath = this.logFilePath.replace('.log', `-${timestamp}.log`);
      fs.renameSync(this.logFilePath, rotatedPath);
      
      this.initializeWriteStream();
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }

  public debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({ timestamp: new Date(), level: LogLevel.DEBUG, message, context, metadata });
  }

  public info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({ timestamp: new Date(), level: LogLevel.INFO, message, context, metadata });
  }

  public warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({ timestamp: new Date(), level: LogLevel.WARN, message, context, metadata });
  }

  public error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({ timestamp: new Date(), level: LogLevel.ERROR, message, context, metadata });
  }

  public fatal(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({ timestamp: new Date(), level: LogLevel.FATAL, message, context, metadata });
  }

  public close(): void {
    if (this.writeStream) {
      this.writeStream.end();
      this.writeStream = null;
    }
  }
}