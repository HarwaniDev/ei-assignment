import { Logger } from '../logger/logger';
import { ApplicationError } from './custom-errors';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private readonly logger: Logger;
  private readonly errorCallbacks: Map<string, (error: Error) => void>;

  private constructor() {
    this.logger = Logger.getInstance();
    this.errorCallbacks = new Map();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: Error, context?: string): void {
    const isOperational = error instanceof ApplicationError ? error.isOperational : false;

    this.logger.error(
      `Error in ${context || 'unknown context'}: ${error.message}`,
      context,
      {
        errorName: error.name,
        errorCode: error instanceof ApplicationError ? error.code : 'UNKNOWN',
        isOperational,
        stack: error.stack
      }
    );

    if (!isOperational) {
      this.logger.fatal(
        'Non-operational error detected. Application may be in unstable state.',
        context
      );
    }

    const callback = this.errorCallbacks.get(error.constructor.name);
    if (callback) {
      try {
        callback(error);
      } catch (callbackError) {
        this.logger.error(
          `Error in error callback: ${callbackError instanceof Error ? callbackError.message : 'Unknown error'}`,
          'ErrorHandler'
        );
      }
    }
  }

  public registerErrorCallback(errorType: string, callback: (error: Error) => void): void {
    this.errorCallbacks.set(errorType, callback);
  }

  public async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }
}