import { IPaymentStrategy, PaymentResult } from './payment-strategy.interface';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';
import { ValidationError, OperationError } from '../../core/error-handler/custom-errors';
import { RetryHandler } from '../../utils/retry-handler';

export class CryptocurrencyPaymentStrategy implements IPaymentStrategy {
  private readonly logger: Logger;
  private readonly retryHandler: RetryHandler;

  constructor() {
    this.logger = Logger.getInstance();
    this.retryHandler = new RetryHandler({ maxRetries: 5, baseDelayMs: 2000 });
  }

  public async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    this.logger.info(
      `Processing cryptocurrency payment: ${amount} ${currency}`,
      'CryptocurrencyPaymentStrategy'
    );

    const validation = Validator.validateNumericRange(amount, 'Payment amount', 0.000001);
    Validator.throwIfInvalid(validation, 'CryptocurrencyPaymentStrategy');

    return this.retryHandler.executeWithRetry(
      async () => {
        // Simulate blockchain confirmation delays
        if (Math.random() < 0.25) {
          throw new OperationError('Blockchain network congestion');
        }

        const transactionId = this.generateTransactionId();
        
        // Simulate longer processing time for blockchain
        await this.simulateProcessing(1500);

        this.logger.info(
          `Cryptocurrency payment successful: ${transactionId}`,
          'CryptocurrencyPaymentStrategy'
        );

        return {
          success: true,
          transactionId,
          message: 'Payment processed successfully via Cryptocurrency',
          timestamp: new Date()
        };
      },
      'CryptocurrencyPaymentStrategy.processPayment',
      (error) => error instanceof OperationError
    );
  }

  public validatePaymentDetails(details: Record<string, unknown>): boolean {
    const walletAddress = details.walletAddress as string;
    const cryptoType = details.cryptoType as string;

    if (!walletAddress || !cryptoType) {
      throw new ValidationError('Missing wallet address or cryptocurrency type');
    }

    if (walletAddress.length < 26 || walletAddress.length > 42) {
      throw new ValidationError('Invalid wallet address format');
    }

    const allowedCryptos = ['BTC', 'ETH', 'USDT', 'BNB'];
    const validation = Validator.validateChoice(cryptoType, allowedCryptos, 'Cryptocurrency type');
    Validator.throwIfInvalid(validation, 'CryptocurrencyPaymentStrategy');

    return true;
  }

  public getPaymentMethodName(): string {
    return 'Cryptocurrency';
  }

  private generateTransactionId(): string {
    return `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}