import { INotification, INotificationMetadata } from './notification.interface';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';
import { RetryHandler } from '../../utils/retry-handler';
import { OperationError } from '../../core/error-handler/custom-errors';

export class EmailNotification implements INotification {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 3 });
  }

  public async send(message: string, metadata: INotificationMetadata): Promise<boolean> {
    this.logger.info(
      `Sending email notification to ${metadata.recipient}`,
      'EmailNotification',
      { priority: metadata.priority }
    );

    if (!this.validateMetadata(metadata)) {
      return false;
    }

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate email sending with potential failures
        if (Math.random() < 0.15) {
          throw new OperationError('SMTP server timeout');
        }

        await this.simulateEmailSending(message, metadata);

        this.logger.info(
          `Email sent successfully to ${metadata.recipient}`,
          'EmailNotification'
        );

        return true;
      },
      'EmailNotification.send',
      (error) => error instanceof OperationError
    ).then(result => result ?? false);
  }

  public validateMetadata(metadata: INotificationMetadata): boolean {
    const emailValidation = Validator.validateEmail(metadata.recipient);
    
    if (!emailValidation.isValid) {
      this.logger.error(
        `Invalid email metadata: ${emailValidation.errors.join(', ')}`,
        'EmailNotification'
      );
      return false;
    }

    if (!metadata.subject || metadata.subject.trim().length === 0) {
      this.logger.error('Email subject is required', 'EmailNotification');
      return false;
    }

    return true;
  }

  public getNotificationType(): string {
    return 'Email';
  }

  private async simulateEmailSending(
    message: string,
    metadata: INotificationMetadata
  ): Promise<void> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    this.logger.debug(
      'Email details',
      'EmailNotification',
      {
        to: metadata.recipient,
        subject: metadata.subject,
        messageLength: message.length,
        priority: metadata.priority
      }
    );
  }
}