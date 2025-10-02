import { INotification, NotificationType } from './notification.interface';
import { EmailNotification } from './email-notification';
import { SmsNotification } from './sms-notification';
import { PushNotification } from './push-notification';
import { Logger } from '../../core/logger/logger';
import { ConfigurationError } from '../../core/error-handler/custom-errors';

export class NotificationFactory {
  private static instance: NotificationFactory;
  private readonly logger: Logger;
  private readonly notificationCache: Map<NotificationType, INotification>;

  private constructor() {
    this.logger = Logger.getInstance();
    this.notificationCache = new Map();
  }

  public static getInstance(): NotificationFactory {
    if (!NotificationFactory.instance) {
      NotificationFactory.instance = new NotificationFactory();
    }
    return NotificationFactory.instance;
  }

  public createNotification(type: NotificationType): INotification {
    this.logger.debug(
      `Creating notification of type: ${type}`,
      'NotificationFactory'
    );

    // Use cached instance if available (Flyweight pattern)
    if (this.notificationCache.has(type)) {
      this.logger.debug(
        `Returning cached notification instance for ${type}`,
        'NotificationFactory'
      );
      return this.notificationCache.get(type)!;
    }

    let notification: INotification;

    switch (type) {
      case NotificationType.EMAIL:
        notification = new EmailNotification();
        break;

      case NotificationType.SMS:
        notification = new SmsNotification();
        break;

      case NotificationType.PUSH:
        notification = new PushNotification();
        break;

      default:
        throw new ConfigurationError(
          `Unsupported notification type: ${type}`,
          { requestedType: type }
        );
    }

    this.notificationCache.set(type, notification);
    this.logger.info(
      `New notification instance created: ${type}`,
      'NotificationFactory'
    );

    return notification;
  }

  public getSupportedTypes(): NotificationType[] {
    return Object.values(NotificationType);
  }

  public clearCache(): void {
    this.notificationCache.clear();
    this.logger.info('Notification cache cleared', 'NotificationFactory');
  }
}