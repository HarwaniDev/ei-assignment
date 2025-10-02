import { IPaymentStrategy, PaymentResult } from './payment-strategy.interface';
import { Logger } from '../../core/logger/logger';
import { ErrorHandler } from '../../core/error-handler/error-handler';

export class PaymentProcessor {
  private strategy: IPaymentStrategy | null = null;
  private readonly logger: Logger;
  private readonly errorHandler: ErrorHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
  }

  public setStrategy(strategy: IPaymentStrategy): void {
    this.logger.info(
      `Payment strategy changed to: ${strategy.getPaymentMethodName()}`,
      'PaymentProcessor'
    );
    this.strategy = strategy;
  }

  public async executePayment(
    amount: number,
    currency: string,
    paymentDetails: Record<string, unknown>
  ): Promise<PaymentResult | null> {
    if (!this.strategy) {
      this.logger.error('No payment strategy set', 'PaymentProcessor');
      return null;
    }

    try {
      this.logger.info(
        `Validating payment details for ${this.strategy.getPaymentMethodName()}`,
        'PaymentProcessor'
      );
      
      this.strategy.validatePaymentDetails(paymentDetails);

      const result = await this.strategy.processPayment(amount, currency);
      
      this.logger.info(
        `Payment completed: ${result.transactionId}`,
        'PaymentProcessor',
        { amount, currency, method: this.strategy.getPaymentMethodName() }
      );

      return result;
    } catch (error) {
      this.errorHandler.handleError(error as Error, 'PaymentProcessor');
      return null;
    }
  }

  public getCurrentStrategyName(): string {
    return this.strategy?.getPaymentMethodName() || 'None';
  }
}