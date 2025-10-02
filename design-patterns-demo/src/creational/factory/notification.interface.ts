export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
  }
  
  export interface INotificationMetadata {
    recipient: string;
    subject?: string;
    priority: NotificationPriority;
    timestamp: Date;
    retryCount?: number;
  }
  
  export interface INotification {
    send(message: string, metadata: INotificationMetadata): Promise<boolean>;
    getNotificationType(): string;
    validateMetadata(metadata: INotificationMetadata): boolean;
  }
  
  export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    SLACK = 'SLACK'
  }