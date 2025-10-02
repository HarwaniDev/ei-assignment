import { IPaymentStrategy, PaymentResult } from './payment-strategy.interface';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';
import { ValidationError, OperationError } from '../../core/error-handler/custom-errors';
import { RetryHandler } from '../../utils/retry-handler';

export class PayPalPaymentStrategy implements IPaymentStrategy {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 3 });
  }

  public async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    this.logger.info(
      `Processing PayPal payment: ${amount} ${currency}`,
      'PayPalPaymentStrategy'
    );

    const validation = Validator.validateNumericRange(amount, 'Payment amount', 0.01);
    Validator.throwIfInvalid(validation, 'PayPalPaymentStrategy');

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate API call with potential transient failures
        if (Math.random() < 0.15) {
          throw new OperationError('PayPal API temporarily unavailable');
        }

        const transactionId = this.generateTransactionId();
        
        // Simulate processing time
        await this.simulateProcessing(700);

        this.logger.info(
          `PayPal payment successful: ${transactionId}`,
          'PayPalPaymentStrategy'
        );

        return {
          success: true,
          transactionId,
          message: 'Payment processed successfully via PayPal',
          timestamp: new Date()
        };
      },
      'PayPalPaymentStrategy.processPayment',
      (error) => error instanceof OperationError
    );
  }

  public validatePaymentDetails(details: Record<string, unknown>): boolean {
    const email = details.email as string;

    if (!email) {
      throw new ValidationError('PayPal email is required');
    }

    const validation = Validator.validateEmail(email);
    Validator.throwIfInvalid(validation, 'PayPalPaymentStrategy');

    return true;
  }

  public getPaymentMethodName(): string {
    return 'PayPal';
  }

  private generateTransactionId(): string {
    return `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}