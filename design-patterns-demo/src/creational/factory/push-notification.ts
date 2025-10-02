import { INotification, INotificationMetadata } from './notification.interface';
import { Logger } from '../../core/logger/logger';
import { RetryHandler } from '../../utils/retry-handler';
import { OperationError } from '../../core/error-handler/custom-errors';

export class PushNotification implements INotification {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 2 });
  }

  public async send(message: string, metadata: INotificationMetadata): Promise<boolean> {
    this.logger.info(
      `Sending push notification to device ${metadata.recipient}`,
      'PushNotification',
      { priority: metadata.priority }
    );

    if (!this.validateMetadata(metadata)) {
      return false;
    }

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate push notification service
        if (Math.random() < 0.1) {
          throw new OperationError('Push service temporarily unavailable');
        }

        await this.simulatePushSending(message, metadata);

        this.logger.info(
          `Push notification sent successfully to ${metadata.recipient}`,
          'PushNotification'
        );

        return true;
      },
      'PushNotification.send',
      (error) => error instanceof OperationError
    ).then(result => result ?? false);
  }

  public validateMetadata(metadata: INotificationMetadata): boolean {
    // Device token format validation (simplified)
    if (metadata.recipient.length < 32) {
      this.logger.error(
        'Invalid device token format',
        'PushNotification'
      );
      return false;
    }

    return true;
  }

  public getNotificationType(): string {
    return 'Push';
  }

  private async simulatePushSending(
    message: string,
    metadata: INotificationMetadata
  ): Promise<void> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300));

    this.logger.debug(
      'Push notification details',
      'PushNotification',
      {
        deviceToken: metadata.recipient.substring(0, 10) + '...',
        messageLength: message.length,
        priority: metadata.priority
      }
    );
  }
}