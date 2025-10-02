import { IModernPaymentGateway, PaymentResponse, AccountInfo } from './modern-payment.interface';
import { ILegacyPaymentSystem } from './legacy-payment.interface';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';
import { OperationError } from '../../core/error-handler/custom-errors';

export class PaymentAdapter implements IModernPaymentGateway {
  private readonly legacySystem: ILegacyPaymentSystem;
  private readonly logger: Logger;
  private readonly supportedCurrencies = ['USD', 'EUR', 'GBP'];

  constructor(legacySystem: ILegacyPaymentSystem) {
    this.legacySystem = legacySystem;
    this.logger = Logger.getInstance();
    
    this.logger.info(
      `Payment adapter initialized with legacy system version: ${legacySystem.getSystemVersion()}`,
      'PaymentAdapter'
    );
  }

  public async processPayment(
    accountId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResponse> {
    this.logger.info(
      `Adapting modern payment request to legacy system`,
      'PaymentAdapter',
      { accountId, amount, currency }
    );

    // Validate inputs
    const amountValidation = Validator.validateNumericRange(amount, 'Payment amount', 0.01);
    const currencyValidation = Validator.validateChoice(
      currency,
      this.supportedCurrencies,
      'Currency'
    );

    const combined = Validator.combineValidationResults(amountValidation, currencyValidation);
    Validator.throwIfInvalid(combined, 'PaymentAdapter.processPayment');

    // Convert modern format (dollars) to legacy format (cents)
    const amountInCents = Math.round(amount * 100);

    // Call legacy system
    const legacyResponse = this.legacySystem.makePayment(accountId, amountInCents);

    // Parse and adapt legacy response to modern format
    const success = legacyResponse.startsWith('SUCCESS');
    const transactionIdMatch = legacyResponse.match(/Transaction ([A-Z0-9-]+)/);
    const transactionId = transactionIdMatch ? transactionIdMatch[1] : 'UNKNOWN';

    this.logger.info(
      `Legacy payment ${success ? 'successful' : 'failed'}`,
      'PaymentAdapter',
      { transactionId, success }
    );

    if (!success) {
      throw new OperationError(
        `Payment failed: ${legacyResponse}`,
        { accountId, amount, currency }
      );
    }

    return {
      success,
      transactionId,
      amount,
      currency,
      timestamp: new Date(),
      message: success ? 'Payment processed successfully' : legacyResponse
    };
  }

  public async getAccountInfo(accountId: string): Promise<AccountInfo> {
    this.logger.debug(
      `Fetching account info via adapter`,
      'PaymentAdapter',
      { accountId }
    );

    // Call legacy system
    const balanceInCents = this.legacySystem.checkAccountBalance(accountId);

    if (balanceInCents < 0) {
      throw new OperationError(
        `Account not found: ${accountId}`,
        { accountId }
      );
    }

    // Convert cents to dollars
    const balance = balanceInCents / 100;

    return {
      accountId,
      balance,
      currency: 'USD',
      status: 'ACTIVE'
    };
  }
}