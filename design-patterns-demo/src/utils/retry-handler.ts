import { IRetryConfig } from '../types/common.types';
import { Logger } from '../core/logger/logger';
import { TransientError } from '../core/error-handler/custom-errors';

export class RetryHandler {
  private static readonly DEFAULT_CONFIG: IRetryConfig = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2
  };

  private readonly logger: Logger;
  private readonly config: IRetryConfig;

  constructor(config?: Partial<IRetryConfig>) {
    this.logger = Logger.getInstance();
    this.config = { ...RetryHandler.DEFAULT_CONFIG, ...config };
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    isTransientError: (error: Error) => boolean = () => true
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = this.calculateDelay(attempt);
          this.logger.info(
            `Retrying operation (attempt ${attempt}/${this.config.maxRetries}) after ${delay}ms`,
            context
          );
          await this.sleep(delay);
        }

        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (!isTransientError(lastError)) {
          this.logger.warn(
            `Non-transient error encountered, aborting retry: ${lastError.message}`,
            context
          );
          throw lastError;
        }

        this.logger.warn(
          `Transient error on attempt ${attempt + 1}: ${lastError.message}`,
          context
        );

        if (attempt === this.config.maxRetries) {
          throw new TransientError(
            `Operation failed after ${this.config.maxRetries} retries`,
            {
              lastError: lastError.message,
              context
            }
          );
        }
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.config.baseDelayMs * Math.pow(this.config.backoffMultiplier, attempt - 1);
    const jitter = Math.random() * 0.1 * delay; // Add 0-10% jitter
    return Math.min(delay + jitter, this.config.maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}