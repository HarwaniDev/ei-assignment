import { IPaymentStrategy, PaymentResult } from './payment-strategy.interface';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';
import { ValidationError, OperationError } from '../../core/error-handler/custom-errors';
import { RetryHandler } from '../../utils/retry-handler';

export class CreditCardPaymentStrategy implements IPaymentStrategy {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 2 });
  }

  public async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    this.logger.info(
      `Processing credit card payment: ${amount} ${currency}`,
      'CreditCardPaymentStrategy'
    );

    const validation = Validator.validateNumericRange(amount, 'Payment amount', 0.01);
    Validator.throwIfInvalid(validation, 'CreditCardPaymentStrategy');

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate payment processing with potential transient failures
        if (Math.random() < 0.2) {
          throw new OperationError('Payment gateway timeout');
        }

        const transactionId = this.generateTransactionId();
        
        // Simulate processing time
        await this.simulateProcessing(500);

        this.logger.info(
          `Credit card payment successful: ${transactionId}`,
          'CreditCardPaymentStrategy'
        );

        return {
          success: true,
          transactionId,
          message: 'Payment processed successfully via Credit Card',
          timestamp: new Date()
        };
      },
      'CreditCardPaymentStrategy.processPayment',
      (error) => error instanceof OperationError
    );
  }

  public validatePaymentDetails(details: Record<string, unknown>): boolean {
    const cardNumber = details.cardNumber as string;
    const cvv = details.cvv as string;
    const expiryDate = details.expiryDate as string;

    if (!cardNumber || !cvv || !expiryDate) {
      throw new ValidationError('Missing required credit card details');
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      throw new ValidationError('Invalid card number format');
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      throw new ValidationError('Invalid CVV format');
    }

    return true;
  }

  public getPaymentMethodName(): string {
    return 'Credit Card';
  }

  private generateTransactionId(): string {
    return `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}