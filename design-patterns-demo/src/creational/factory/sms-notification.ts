import { INotification, INotificationMetadata } from './notification.interface';
import { Logger } from '../../core/logger/logger';
import { RetryHandler } from '../../utils/retry-handler';
import { OperationError } from '../../core/error-handler/custom-errors';

export class SmsNotification implements INotification {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;
  private readonly maxSmsLength: number = 160;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 4, baseDelayMs: 500 });
  }

  public async send(message: string, metadata: INotificationMetadata): Promise<boolean> {
    this.logger.info(
      `Sending SMS notification to ${metadata.recipient}`,
      'SmsNotification',
      { priority: metadata.priority }
    );

    if (!this.validateMetadata(metadata)) {
      return false;
    }

    // Truncate message if too long
    const truncatedMessage = message.length > this.maxSmsLength
      ? message.substring(0, this.maxSmsLength - 3) + '...'
      : message;

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate SMS gateway with potential failures
        if (Math.random() < 0.2) {
          throw new OperationError('SMS gateway unavailable');
        }

        await this.simulateSmsSending(truncatedMessage, metadata);

        this.logger.info(
          `SMS sent successfully to ${metadata.recipient}`,
          'SmsNotification'
        );

        return true;
      },
      'SmsNotification.send',
      (error) => error instanceof OperationError
    ).then(result => result ?? false);
  }

  public validateMetadata(metadata: INotificationMetadata): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!phoneRegex.test(metadata.recipient)) {
      this.logger.error(
        `Invalid phone number format: ${metadata.recipient}`,
        'SmsNotification'
      );
      return false;
    }

    return true;
  }

  public getNotificationType(): string {
    return 'SMS';
  }

  private async simulateSmsSending(
    message: string,
    metadata: INotificationMetadata
  ): Promise<void> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    this.logger.debug(
      'SMS details',
      'SmsNotification',
      {
        to: metadata.recipient,
        messageLength: message.length,
        priority: metadata.priority
      }
    );
  }
}