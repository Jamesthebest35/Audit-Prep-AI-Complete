/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and environment-aware logging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private isDebugEnabled: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development';
    this.isDebugEnabled = import.meta.env.VITE_ENABLE_DEBUG === 'true' || this.isDevelopment;
  }

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === LogLevel.DEBUG && !this.isDebugEnabled) {
      return false;
    }
    return true;
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, data, error);
    const formattedMessage = this.formatLog(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, error || data);
        if (error?.stack) {
          console.error(error.stack);
        }
        break;
    }

    // In production, you might want to send errors to a service
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      this.sendToErrorService(entry);
    }
  }

  private sendToErrorService(entry: LogEntry): void {
    // TODO: Implement error reporting service integration
    // Example: Sentry, LogRocket, DataDog, etc.
    // For now, we just store it in sessionStorage for debugging
    try {
      const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
      errors.push(entry);
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift();
      }
      sessionStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      // Fail silently if storage is full or unavailable
    }
  }

  /**
   * Log debug messages (only in development or when debug is enabled)
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorObj = error instanceof Error ? error : undefined;
    const errorData = error instanceof Error ? data : error;
    this.log(LogLevel.ERROR, message, errorData, errorObj);
  }

  /**
   * Get all stored errors (useful for debugging)
   */
  getStoredErrors(): LogEntry[] {
    try {
      return JSON.parse(sessionStorage.getItem('app_errors') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear all stored errors
   */
  clearStoredErrors(): void {
    sessionStorage.removeItem('app_errors');
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenient imports
export default logger;
